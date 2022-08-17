const mongoose = require("mongoose");

// eslint-disable-next-line no-unused-vars
const removeCompDups = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDB"); // db connect
    const { Schema, model } = mongoose;

    const companyInfoSchema = new Schema(
      {
        companyName: String,
        logo: String,
        industry: String,
        about: String,
      },
      { collection: "companyInformation", timestamps: true, unique: true }
    );

    // eslint-disable-next-line new-cap
    const companyInfo = new model("companyInformation", companyInfoSchema);

    const dups = companyInfo.aggregate([
      {
        $group: {
          _id: { companyName: "$companyName" },
          slugs: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    for await (const doc of dups) {
      doc.slugs.shift();
      const res = await companyInfo.remove({
        _id: { $in: doc.slugs },
      });

      console.log({ res });
    }

    console.log({ dups });
  } catch (err) {
    console.log(err);
  }
};

const removeJobDups = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myDB"); // db connect
    const { Schema, model } = mongoose;

    const jobInfoSchema = new Schema(
      {
        jobTitle: String,
        industry: String,
        companyName: String,
        location: String,
        vacancy: Number,
      },

      { collection: "jobInformation", timestamps: true, unique: true }
    );

    // eslint-disable-next-line new-cap
    const jobInfo = new model("jobInformation", jobInfoSchema);

    const dups = jobInfo.aggregate([
      {
        $group: {
          _id: {
            companyName: "$companyName",
            jobTitle: "$jobTitle",
            vacancy: "$vacancy",
          },
          slugs: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 },
        },
      },
    ]);
    for await (const doc of dups) {
      doc.slugs.shift();
      const res = await jobInfo.remove({
        _id: { $in: doc.slugs },
      });

      console.log({ res });
    }

    console.log({ dups });
  } catch (err) {
    console.log(err);
  }
};

// removeCompDups();
removeJobDups();
