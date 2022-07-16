// imports
const puppeteer = require("puppeteer"); // importing puppeteer
const mongoose = require("mongoose"); // importing mongoose for db
const fs = require("fs"); // importing file-system for json file
const mod = require("./functions");
const path = require("path");

const getPath = (filename) => path.resolve(__dirname, filename);
const main = async () => {
  const jobsURL = "https://merojob.com/search/?q=&page=1";
  const companyURL = "https://merojob.com/company/";

  const browser = await puppeteer.launch({ headless: true }); // initiating browser

  console.log("Extracting Job Links.");
  const links = await mod.jobLinks({
    URL: jobsURL,
    browser: browser,
  });

  links.splice(links.length - 1, 1);
  // try {
  //   fs.writeFileSync(getPath("joblinks.json"), JSON.stringify(links, null, 2));
  // } catch (error) {
  //   console.log(error);
  // }
  // --------
  // console.log({ links });

  // reading links
  // const links = JSON.parse(fs.readFileSync("./links.json"));

  // Data from job links---------
  const jobData = await mod.dataFromJobLink({
    links: links,
    browser: browser,
  });

  // Writing Job Data to File --------------------------------------------------------------------------

  try {
    fs.writeFileSync(getPath("jobData.json"), JSON.stringify(jobData, null, 2));
    console.log("\nJob Data Written!\n");
  } catch (error) {
    console.log(error);
  }

  // Company Links-----------------------------------------
  const compLinks = await mod.companyLinks({
    URL: companyURL,
    browser: browser,
  });

  // Data from company links
  const compData = await mod.dataFromCompanyLink({
    links: compLinks,
    browser: browser,
  });

  // Writing Company Data to File
  try {
    fs.writeFileSync(
      getPath("compData.json"),
      JSON.stringify(compData, null, 2)
    );
    console.log("\nComp Data Written!\n");
  } catch (error) {
    console.log(error);
  }
  // ----------------------------------------------------------

  // Inserting Job Data in DB
  try {
    await mod.dbforJobs(mongoose, fs, getPath);
  } catch (error) {
    console.log(error);
  }

  // Inserting Comp Data in DB
  try {
    await mod.dbforCompanies(mongoose, fs, getPath);
  } catch (error) {
    console.log(error);
  }

  await browser.close();
};
main();

// const cron = require("node-cron");
// cron.schedule("0 5 * * 0", main(), { timezone: "Asia/Kathmandu" });
