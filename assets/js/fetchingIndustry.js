// @ts-check
/* eslint-disable require-jsdoc */

// const { Database } = require("@admin-bro/mongoose");

// eslint-disable-next-line require-jsdoc
function getIndustryData(industryName) {
  return fetch(`http://localhost:3000/industry/${industryName}`)
    .then((response) => response.json())
    .then((data) => data);
}

async function showData(id) {
  console.log(id);
  const jobsContainer = document.querySelector(".jobs-grid-container");
  const data = await getIndustryData(id);
  console.log({ data });
  data.forEach((element) => {
    const divElement = document.createElement("div");
    divElement.className = "grid-item";
    divElement.innerText = element.jobTitle + " ( " + element.vacancy + " )";
    jobsContainer?.appendChild(divElement);
  });
  const objValues = Object.values(data);
  console.log(objValues);
  // var result = objValues.find(item => item.);
}

window.onload = () => {
  // retriving all query params
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log({ params });
  const industry = params.industry.replace(/\//g, "%2F");
  console.log({ industry });
  if (industry) {
    showData(industry);
  }
};

// function getCompanyData(companyName) {
//   return fetch(`http://localhost:3000/company/${companyName}`)
//     .then((response) => response.json())
//     .then((data) => data);
// }
