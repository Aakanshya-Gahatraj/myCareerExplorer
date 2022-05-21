// imports
const puppeteer = require("puppeteer"); // importing puppeteer
const fs = require("fs"); // importing file-system for json file

(async () => {
  // Setting things up and initiating browser
  // const meroJobURL = "https://merojob.com/search/?q=&page=1";
  const browser = await puppeteer.launch({ headless: true });

  // // Extracting links from each page (Pagination Handled)
  // const linksOnEachPage = async (URL) => {
  //   // Extracting Links
  //   const page = await browser.newPage();
  //   await page.goto(URL, {
  //     waitUntil: "load",
  //     // Remove the timeout
  //     timeout: 0,
  //   });

  //   // console.log(`On URL: ${URL}`);
  //   const links = await page.evaluate(() =>
  //     Array.from(document.querySelectorAll("[itemprop='title']> a")).map(
  //       (el) => el.href
  //     )
  //   );

  //   // Recursion
  //   condition = await page.evaluate(() =>
  //     document.querySelector(
  //       "#main-content > div.row.mt-3 > div.col-md-8 > div.search-results"
  //     )
  //   );

  //   if (condition == null) {
  //     // Terminating Condition: search-results div being null means it's the endpage
  //     console.log(`Terminate recursion on: ${URL}`);
  //     return;
  //   } else {
  //     // Go to next page
  //     const nextPageNumber = parseInt(URL.match(/page=(\d+)$/)[1], 10) + 1;
  //     const nextPageURL = `https://merojob.com/search/?q=&page=${nextPageNumber}`;
  //     return links.concat(await linksOnEachPage(nextPageURL));
  //   }
  // };

  // const links = await linksOnEachPage(meroJobURL);

  // links.splice(links.length - 1, 1);

  // console.log({ links });
  // // Saving links to a txt file
  // fs.writeFile("links.json", JSON.stringify(filteredLinks, null, 2), (err) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("Successfully written !");
  //   }
  // });

  // reading links
  const readlinks = JSON.parse(fs.readFileSync("./links.json"));

  // Scraping data from each links
  const dataFromLink = async (links) => {
    const totalResult = [];

    console.log(`Starting to extract data........`);
    // for (const l of links) {
    for (let i = 0; i < 20; i++) {
      if (links[i] != null) {
        // console.log(l);
        const newPage = await browser.newPage();
        await newPage.goto(links[i], {
          waitUntil: "load",
          // Remove the timeout
          timeout: 0,
        });
        const result = await newPage.evaluate(
          () => {
            const el = document.querySelector(
              "body > div.container.my-3 > div.row.my-3 > div.col-md-8"
            );
            const jobTitleNode = el.querySelector("div.card-header h1");
            const industryNode = el.querySelector(" table > tbody a");
            const companyNameNode = el.querySelector("h2 > a > span");
            const locationNode = el.querySelector("table .clearfix");
            const vacancyNode = el.querySelector("table strong");

            if (
              !jobTitleNode ||
              !industryNode ||
              !companyNameNode ||
              !locationNode ||
              !vacancyNode
            ) {
              // guard condition
              return;
            } else {
              const jobTitle = jobTitleNode.innerText.trim();
              const industry = industryNode.innerText.trim();
              const companyName = companyNameNode.innerText.trim();
              const location = locationNode.innerText.trim();
              const vacancy = vacancyNode.innerText.trim();

              return {
                jobTitle,
                industry,
                companyName,
                location,
                vacancy,
              };
            }
          }

          // const companyInfo = el
          //   .querySelector(
          //     "div.card.border-bottom-0 > div > div:nth-child(2) > div > div"
          //   )
          //   .innerText.trim();
        );
        if (result != null) {
          totalResult.push(result);
        }
        // array.filter(value => Object.keys(value).length !== 0);
      }
    }
    const filteredResult = totalResult.filter(
      (x) => Object.keys(x).length !== 0
    );

    // const filteredResult = totalResult.filter((x) => x !== null);

    return filteredResult;
  };

  const jobData = await dataFromLink(readlinks);

  // Filtering Data, removing null values
  // for (let i = 0; i < jobData.length; i++) {
  //   if(jobData[i].Value)
  //   filteredData=
  // }

  fs.writeFile("data.json", JSON.stringify(jobData, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully written !");
    }
  });

  // function for scraping
  // const jobDetails = async () => {
  //   const res = await page.evaluate(() =>
  //     Array.from(document.querySelectorAll("div.job-card")).map((el) => {
  //       const jobTitle = el
  //         .querySelector("[itemprop='title']> a")
  //         .innerText.trim();
  //       const company = el.querySelector(
  //         "[itemprop='hiringOrganization']> meta"
  //       ).content;
  //       const location = el
  //         .querySelector("[itemprop='addressLocality']")
  //         .innerText.trim();

  //       if (!jobTitle || !company || !location) return;
  //       return {
  //         jobTitle,
  //         company,
  //         location,
  //       };
  //     })
  //   );
  //   return res;
  // };

  // const Links = [
  //   "https://merojob.com/search/?page=1",
  //   "https://merojob.com/search/?page=2",
  //   "https://merojob.com/search/?page=3",
  // ];
  // console.log({ jobDetailsRes });

  // Saving data to json file
  // const jsonfile= fs.createWriteStream("")

  // const jobDetailsRes = await jobDetails(); //changing promise, to show the output in console
  //   console.log({ jobDetailsRes });
  // jobDetails().then(val => console.log({val})) **Another way

  await browser.close();
})();

// [1,2,3].map(el=> {if (el %2==0) return null; else return el}  ).filter(el=> !!el)   ****Filtering Null values
