/* eslint-disable no-unused-vars */
// @ts-nocheck

// Functions used in index.js

const districtList = {
  achham: ["mangalsen", "sanphebagar", "kamalbazar"],
  arghakhanchi: ["sandhikharka"],
  baglung: ["baglung", "galkot", "jaimini", "dhorpatan"],
  baitadi: ["dasharathchand", "melauli"],
  bajhang: ["jayaprithvi"],
  bajura: ["martadi", "badimalika", "tribeni", "budhiganga"],
  banke: ["nepalgunj", "kohalpur"],
  bara: ["kalaiya", "jitpursimara", "mahagadhimai"],
  bardiya: ["gulariya", "barbardiya", "rajapur", "bansgadhi"],
  bhaktapur: ["bhaktapur", "suryabinayak", "thimi", "changunarayan"],
  bhojpur: ["bhojpur", "shadanand"],
  chitwan: [
    "bharatpur",
    "narayangadh",
    "rampur",
    "sauraha",
    "devghat",
    "ratnanagar",
    "rapti",
  ],
  dadeldhura: ["amargadhi", "parshuram"],
  dailekh: ["narayan", "dullu", "aathabis"],
  dang: ["ghorahi", "tulsipur"],
  darchula: ["darchula", "mahakali", "shailyashikhar"],
  dhading: ["nilkantha", "dhading besi"],
  dhankuta: ["dhankuta", "mahalaxmi", "pakhribas"],
  dhanusa: ["janakpur", "chhireshwarnath"],
  dolakha: ["bhimeshwar", "charikot", "jiri"],
  dolpa: ["dunai", "thuli bheri"],
  doti: ["dipayal"],
  gorkha: ["gorkha", "palungtar"],
  gulmi: ["tamghas", "resunga"],
  humla: ["simikot"],
  ilam: ["suryodaya"],
  jajarkot: ["khalanga", "bheri"],
  jhapa: [
    "bhadrapur",
    "mechinagar",
    "birtamod",
    "damak",
    "shivasatakshi",
    "arjundhara",
  ],
  jumla: ["chandannath"],
  kailali: ["dhangadhi", "tikapur", "lamki chuha", "ghodaghodi"],
  kalikot: ["manma", "raskot", "tilagupha"],
  kanchanpur: ["bhimdatta", "krishnapur", "belauri", "mahendranagar"],
  kapilvastu: [
    "taulihawa",
    "banganga",
    "shivaraj",
    "buddhabhumi",
    "krishnanagar",
  ],
  kaski: ["pokhara", "lekhnath"],
  kathmandu: [
    "kathmandu",
    "thapathali",
    "durbarmarg",
    "dilibazar",
    "budhanilkantha",
    "chandragiri",
    "tokha",
    "gokarneshwar",
    "kirtipur",
  ],
  kavre: ["dhulikhel", "banepa", "paunauti"],
  khotang: ["diktel"],
  lalitpur: [
    "lalitpur",
    "patan",
    "kupondole",
    "nakkhu",
    "Godawari",
    "jawalakhel",
    "imadol",
    "sanepa",
    "ekantakuna",
    "lagankhel",
  ],
  lamjung: ["besisahar", "sundarbazar", "rainas"],
  mahottari: ["jaleshwar", "bardibas"],
  makwanpur: ["hetauda"],
  manang: ["chame"],
  morang: [
    "biratnagar",
    "belbari",
    "urlabari",
    "ratuwamai",
    "rangeli",
    "sunawarshi",
    "letang",
  ],
  mugu: ["gamgadhi"],
  mustang: ["jomsom"],
  myagdi: ["beni"],
  nawalparasi: [
    "kawasoti",
    "ramgram",
    "madhyabindu",
    "gaindakot",
    "sunwal",
    "bardghat",
  ],
  nuwakot: ["bidur"],
  okhaldhunga: ["siddhicharan"],
  palpa: ["tansen", "rampur"],
  panchthar: ["phidim"],
  parbat: ["kushma", "phalewas"],
  parsa: ["birgunj"],
  pyuthan: ["pyuthan", "swargadwari"],
  ramechhap: ["manthali"],
  rasuwa: ["dhunche"],
  rautahat: ["gaur", "chandrapur"],
  rolpa: ["liwang"],
  rukum: ["rukumkot", "musikot"],
  rupandehi: [
    "siddharthanagar",
    "butwal",
    "tilottama",
    "lumbini",
    "devdaha",
    "manigram",
    "lumbini sanskritik",
    "sainamaina",
  ],
  salyan: ["salyan", "bagchaur", "shaarda"],
  sankhuwasabha: ["khandbari", "chainpur"],
  saptari: ["rajbiraj"],
  sarlahi: ["malangwa", "barahathwa", "ishwarpur"],
  sindhuli: ["kamalamai"],
  sindhupalchok: ["chautara", "melamchi", "barhabise"],
  siraha: ["siraha"],
  solukhumbu: ["salleri", "solu dudhkunda"],
  sunsari: [
    "inaruwa",
    "itahari",
    "dharan",
    "barahachhetra",
    "duhabi",
    "ramdhuni",
  ],
  surkhet: ["birendranagar", "gurbhakot", "panchapuri"],
  syangja: ["putalibazar", "waling"],
  tanahun: ["damauli", "vyas", "shuklagandaki", "bhanu"],
  taplejung: ["taplejung"],
  terhathum: ["myanglung"],
  udayapur: ["gaighat", "triyuga", "katari", "chaudandigadhi"],
  remote: ["remote", "work from home"],
  allNepal: ["all over nepal", "nepal"],
};

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
        //          `body > div.container.my-3 div.card-body.p-0.table-responsive .clearfix`).innerText;

        const location = await newPage.$eval(
          `body > div.container.my-3 div.card-body.p-0.table-responsive .clearfix`,
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
          const jobLocations = location.replace(",", "").split(" ");
          const districtKeys = Object.keys(districtList);
          const districtVals = Object.values(districtList);

          const listForDistrict = [];
          jobLocations.forEach((el) => {
            if (districtKeys.includes(el.toLowerCase()))
              listForDistrict.push(el);
            else {
              const districtIndex = districtVals.findIndex((cities) =>
                cities.includes(el.toLowerCase())
              );
              if (districtIndex >= 0) {
                listForDistrict.push(districtKeys[districtIndex]);
              } else {
                listForDistrict.push("Unknown");
              }
            }
          });

          let district = "";
          if (listForDistrict.length < 1) {
            // no district found in location
            district = "Others";
          } else if (listForDistrict.length == 1) {
            // 1 district present
            district = listForDistrict[0];
          } else {
            // many district present
            district = listForDistrict.toString();
          }

          totalResult.push({
            jobTitle,
            industry,
            companyName,
            location,
            vacancy,
            // district,
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
        // district: String,
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
