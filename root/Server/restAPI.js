const express = require("express");
const mongoose = require("mongoose");
const { jobModel, companyModel } = require("../script/dbSchemaModel");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost:27017/myDB", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully Connected to DB!");
  })
  .catch((e) => {
    console.log("Trouble Connecting to DB....");
  });

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
  const companyName = req.params.company_name;
  try {
    const getCompanyData = await companyModel.find({ company: companyName });
    res.send(getCompanyData);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/location", async (req, res) => {
  const location = req.params.location_name;
  try {
    const getLocationData = await jobModel.find({ locationName: location });
    console.log(getLocationData.count());
    res.send(getLocationData);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server Started at Port: ${3000}`);
});
