/* eslint-disable require-jsdoc */
const mongoose = require("mongoose");
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
const jobModel = new model("jobInformation", jobInfoSchema);

const companyInfoSchema = new Schema(
  {
    companyName: {
      type: String,
    },
    logo: String,
    industry: String,
    about: String,
  },
  { collection: "companyInformation", timestamps: true, unique: true }
);

// checking if data already exists
companyInfoSchema.pre("save", function (next) {
  console.log("pre hook");
  // eslint-disable-next-line no-invalid-this
  const self = this;
  companyModel.find({ companyName: self.companyName }, function (err, docs) {
    if (!docs.length) {
      next();
    } else {
      console.log("company exists: ");
      next(new Error("company exists!"));
    }
  });
});
// eslint-disable-next-line new-cap
const companyModel = new model("companyInformation", companyInfoSchema);

module.exports = {
  jobModel,
  companyModel,
};
