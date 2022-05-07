const puppeteer = require('puppeteer'); // used to import puppeteer

(async () => {

    let meroJobURL= "https://merojob.com/search/?q=";
    
    const browser = await puppeteer.launch({headless:true}); //initiating browser
    const page = await browser.newPage();  //opening new page
    
    await page.goto(meroJobURL); //navigating to page
    // await page.screenshot({ path: 'examp.png' });

    const jobtitles=await page.evaluate(() =>
        [...document.querySelectorAll("[itemprop='title']> a")].map(el=>el.innerText)
    );

    const orgNames=await page.evaluate(()=>
      [...document.querySelectorAll("[itemprop='hiringOrganization']> meta")].map(el=>el.content)
    );

    const jobDetails=await page.evaluate(()=>
     Array.from(document.querySelectorAll("div.job-card"))
     .map(el=> ({ 
         jobtitle: el.querySelector("[itemprop='title']> a").innerText.trim(),
         company: el.querySelector("[itemprop='hiringOrganization']> meta").content,
         location: el.querySelector("[itemprop='addressLocality']").innerText.trim(),
         }))
    );
    
    // console.log(jobtitles);
    // console.log(orgNames);
    console.log(jobDetails);

    await browser.close();
})()