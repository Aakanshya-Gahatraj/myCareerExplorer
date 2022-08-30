const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");
AdminBro.registerAdapter(AdminBroMongoose);

const { jobModel, companyModel } = require("../script/dbSchemaModel");
const mongoose = require("mongoose");
const express = require("express");
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());

// adminBro
const run = async () => {
  const connection = await mongoose.connect("mongodb://localhost:27017/myDB", {
    useNewUrlParser: true,
  });

  const adminBro = new AdminBro({
    databases: [connection],
    resources: [
      {
        resource: companyModel,
        options: {
          listProperties: ["companyName", "logo", "industry"],
          name: "Company Details",
          properties: {
            about: { type: "richtext" },
          },
        },
      },
      {
        resource: jobModel,
        options: {
          listProperties: [
            "jobTitle",
            "industry",
            "companyName",
            "location",
            "vacancy",
          ],
          name: "Job Details",
        },
      },
    ],
    rootPath: "/admin",
    branding: {
      // logo: "https://i.pinimg.com/474x/f7/99/20/f79920f4cb34986684e29df42ec0cebe.jpg",
      companyName: "MyCareerExplorer",
    },
  });

  const ADMIN = {
    email: "admin@example.com",
    password: "admin123",
  };
  const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
    cookieName: "admin-bro",
    cookiePassword: "my-secret-password-for-my-application",
    authenticate: async (email, password) => {
      if (email === ADMIN.email && password === ADMIN.password) {
        return ADMIN;
      } else {
        return null;
      }
    },
  });
  app.use(adminBro.options.rootPath, router);

  // rest api
  app.get("/industry/:industry_name", async (req, res) => {
    const industryName = req.params.industry_name;
    try {
      const getIndustryData = await jobModel.find({ industry: industryName });
      // console.log("Number:", count(getIndustryData));
      // res.send(industryName);
      res.send(getIndustryData);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.get("/company", async (req, res) => {
    try {
      const getCompanyData = await companyModel.find({});
      res.send(getCompanyData);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.get("/company/:companyName", async (req, res) => {
    const companyName = req.params.companyName;
    const getJobsFromCompany = await jobModel.find({
      companyName: companyName,
    });
    try {
      res.send(getJobsFromCompany);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.get("/location/:location_name", async (req, res) => {
    try {
      // console.log("Inside API");
      const location = req.params.location_name;
      console.log("Location: " + location);

      const getLocationData = await jobModel.find({
        $text: { $search: location },
      });
      // console.log("Location Data:  " + getLocationData);
      // console.log(getLocationData.length);

      const locationVacancies = await jobModel.aggregate([
        { $match: { $text: { $search: `"${location}"` } } },
        { $group: { _id: location, totalVacancy: { $sum: "$vacancy" } } },
      ]);
      const result = [];
      for await (const docs of locationVacancies) {
        result.push(docs);
      }
      const totalVac = result[0]["totalVacancy"];
      // console.log(totalVac);
      res.send([getLocationData, totalVac]);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  // Needed for post
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.post("/opportunities", async (req, res) => {
    try {
      job = req.body.job1;
      console.log(job);
      const getData = await jobModel.find({
        $text: { $search: `\"${job}\"` },
      });

      // console.log(countsExtende  d);

      // const locations = [];
      // getData.forEach((el) => {
      //   locations.push(el.location);
      // });
      // // locations.append(getData.location);
      // console.log(locations);

      // const dataArray= getData.aggregate([
      //   { $match: { $text: { $search: `"${job}"` } } },
      //   {
      //     $group: {
      //       _id: {job,jobModel.location},
      //       totalVacancy: { $sum: "$vacancy" },
      //     },
      //   },
      // ]);
      // const result = [];
      // for await (const docs of getLocationData) {
      //   // console.log(docs);
      //   result.push(docs);
      // }
      // console.log(getData);
      res.send(getData);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.post("/search", async (req, res) => {
    try {
      job = req.body.jobname;
      // console.log(job);
      const searchJobs = await jobModel.find({
        $text: { $search: `\"${job}\"` },
      });
      // console.log(searchJobs);
      res.send(searchJobs);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  // app.get("/location/:location", async (req, res) => {
  //   const location = req.params.location;
  //   try {
  //     const getLocationData = await jobModel.find({
  //       location: { $regex: new RegExp(".*" + location + ".*", "i") },
  //     });
  //     console.log(getLocationData);
  //     res.send(getLocationData);
  //   } catch (e) {
  //     res.status(400).send(e);
  //   }
  // });

  app.post("/compare", async (req, res) => {
    try {
      console.log(req.body);
      const job1 = req.body.job1;
      const job2 = req.body.job2;
      const job1Pipeline = jobModel.aggregate([
        { $match: { jobTitle: `${job1}` } },
        { $group: { _id: `${job1}`, totalVacancy: { $sum: "$vacancy" } } },
      ]);
      const job2Pipeline = jobModel.aggregate([
        { $match: { jobTitle: `${job2}` } },
        { $group: { _id: `${job2}`, totalVacancy: { $sum: "$vacancy" } } },
      ]);
      const result = [];
      for await (const docs of job1Pipeline) {
        // console.log(docs);
        result.push(docs);
      }
      for await (const docs of job2Pipeline) {
        // console.log(docs);
        result.push(docs);
      }
      // console.log(result);

      res.send(result);
    } catch (e) {
      res.status(400).send(e);
    }
  });

  app.listen(port, () =>
    console.log(`AdminBro is under localhost:${port}/admin`)
  );
};

run();
