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
    companyName: String,
    logo: String,
    industry: String,
    about: String,
  },
  { collection: "companyInformation", timestamps: true, unique: true }
);

// eslint-disable-next-line new-cap
const companyModel = new model("companyInformation", companyInfoSchema);

module.exports = {
  jobModel,
  companyModel,
};
