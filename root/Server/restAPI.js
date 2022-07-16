const express = require("express");
const mongoose = require("mongoose");
// eslint-disable-next-line no-unused-vars
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

app.get("/industry", async (req, res) => {
  try {
    const getIndustryData = await jobModel.find({
      industry: "IT & Telecommunication",
    });
    // console.log("Number:", count(getIndustryData));
    res.send(getIndustryData);
  } catch (e) {
    res.status(400).send(e);
  }
});
app.listen(port, () => {
  console.log(`Server Started at Port: ${3000}`);
});
