/* eslint-disable no-unused-vars */
// @ts-check

// Functions used in index.js

const e = require("express");

// Job Links Extraction (Pagination Handled) ----------------------------------------------------

const jobLinks = async ({ URL, browser }) => {
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: "load",
    // Remove the timeout
    timeout: 0,
  });

  const links = await page.evaluate(() =>
    Array.from(document.querySelectorAll("[itemprop='title']> a")).map(
      (el) => el.href
    )
  );
  // Recursion
  condition = await page.evaluate(() =>
    document.querySelector(
      "#main-content > div.row.mt-3 > div.col-md-8 > div.search-results"
    )
  );
  await page.close();

  if (condition == null) {
    // Terminating Condition: search-results div being null means it's the endpage
    console.log(`Terminate recursion on: ${URL}`);
    return;
  } else {
    // Go to next page
    const nextPageNumber = parseInt(URL.match(/page=(\d+)$/)[1], 10) + 1;
    const nextPageURL = `https://merojob.com/search/?q=&page=${nextPageNumber}`;
    return links.concat(await jobLinks({ URL: nextPageURL, browser }));
  }
};

// Scraping Job Data from each links --------------------------------------------------------

const dataFromJobLink = async ({ links, browser }) => {
  const totalResult = [];
  console.log(`Extracting Job data........`);
  const selectorHead =
    "body > div.container.my-3 > div.row.my-3 > div.col-md-8";
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link != null) {
      const newPage = await browser.newPage();
      await newPage.goto(link, {
        waitUntil: "load",
        // Removing the timeout
        timeout: 0,
      });

      try {
        const jobTitle = await newPage.$eval(
          `${selectorHead} div.card-header h1`,
          (el) => el.innerText
        );
        const industry = await newPage.$eval(
          `${selectorHead} table > tbody a`,
          (el) => el.innerText
        );
        const companyName = await newPage.$eval(
          `${selectorHead} h2 > a > span`,
          (el) => el.innerText
        );
        const location = await newPage.$eval(
          `${selectorHead} table .clearfix`,
          (el) => el.innerText
        );
        const vacancy = parseInt(
          await newPage.$eval(
            `${selectorHead} table strong `,
            (el) => el.innerText
          )
        );

        if (!jobTitle || !industry || !companyName || !location || !vacancy) {
          // guard condition
        } else {
          totalResult.push({
            jobTitle,
            industry,
            companyName,
            location,
            vacancy,
          });
        }
      } catch (error) {
        process.stdout.write("*");
      }
      await newPage.close();
    }
  }

  // Filtering Data, removing empty values
  const filteredResult = totalResult.filter((x) => Object.keys(x).length !== 0);
  return filteredResult;
};

// Company Links Extraction ------------------------------------------------------------------

const companyLinks = async ({ URL, browser }) => {
  console.log("Extracting Company Links.");
  const page = await browser.newPage();
  await page.goto(URL, {
    waitUntil: "load",
    // Remove the timeout
    timeout: 0,
  });

  const compLinks = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        "body > section:nth-child(8) > div > div > div.card-body h6> a"
      )
    ).map((el) => el.href.trim())
  );
  return compLinks;
};

// Scraping Company Data from each links -----------------------------------------------------

const dataFromCompanyLink = async ({ links, browser }) => {
  const totalResult = [];
  console.log(`Extracting company data........`);
  const selectorHead = "body > div.container > div > div.col-md-4.mt-3 > div";
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link != null) {
      const newPage = await browser.newPage();
      await newPage.goto(link, {
        waitUntil: "load",
        // Removing the timeout
        timeout: 0,
      });
      await newPage.click("[data-target='#about']");

      try {
        const companyName = await newPage.$eval(
          `${selectorHead}> div.card-body.card-title.my-0 > h1`,
          (el) => el.innerText.trim()
        );
        const logo = await newPage.$eval(
          `${selectorHead}> div:nth-child(1) > img.logo-position.border`,
          (el) => el.src.trim()
        );
        const industry = await newPage.$eval(
          `${selectorHead}> div.card-body.card-title.my-0 > small:nth-child(2) > span`,
          (el) => el.innerText.trim()
        );

        const about = await newPage.$eval("#about", (el) =>
          el.innerText.trim()
        );

        totalResult.push({
          companyName,
          logo,
          industry,
          about,
        });
      } catch (error) {
        console.log("Error in Company Links:  " + link);
        // console.log(error);
      }
      await newPage.close();
    }
  }
  console.log(`Company data Extracted........`);

  return totalResult;
};

// Adding to Database -----------------------------------------------------------------------

const dbforJobs = async (mongoose, fs, getPath) => {
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
    const JobInformation = new model("jobInformation", jobInfoSchema);

    const jobData = fs.readFileSync(getPath("jobData.json"));
    const jobs = JSON.parse(jobData);
    JobInformation.insertMany(jobs)
      .then(function () {
        console.log("Job Data Inserted to DB"); // Success
      })
      .catch(function (error) {
        console.log(error); // Failure
      });
  } catch (error) {
    console.log("Couldn't connect to database.\n" + error);
  }
};

const dbforCompanies = async (mongoose, fs, getPath) => {
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

    // eslint-disable-next-line new-cap, no-unused-vars
    const companyInfo = new model("companyInformation", companyInfoSchema);

    const companyData = fs.readFileSync(getPath("compData.json"));
    const data = JSON.parse(companyData);
    const dataName = data.map((el) => el.companyName);
    console.log({ "length: ": data.length });

    for await (const name of dataName) {
      const res = await companyInfo.findOne({
        companyName: name,
      });
      if (!res) {
        console.log("new data");
        const newCompanyInfoIdx = Array.from(dataName).findIndex(
          (el) => String(el).toLowerCase() == String(name).toLowerCase()
        );

        if (newCompanyInfoIdx >= 0) {
          console.log("value", data[newCompanyInfoIdx], newCompanyInfoIdx);
          companyInfo.create(data[newCompanyInfoIdx]).then(function () {
            console.log("Company Data Inserted to DB"); // Success
          });
        }
      } else {
        console.log("pre-existing data");
      }
    }
  } catch (error) {
    console.log("Couldn't connect to database.\n" + error);
  }
};

module.exports = {
  jobLinks,
  dataFromJobLink,
  companyLinks,
  dataFromCompanyLink,
  dbforJobs,
  dbforCompanies,
};
