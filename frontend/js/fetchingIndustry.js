// @ts-nocheck
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
  const data = await getIndustryData(id);
  console.log({ data });
  const jobsContainer = document.querySelector(".jobs-grid-container");
  data.forEach((element) => {
    const gridItem = document.createElement("div");
    gridItem.className = "jobs-grid-item";
    const contents = document.createElement("div");
    contents.className = "jobs-contents";

    const head3 = document.createElement("h3");
    head3.className = "head3";
    head3.innerHTML = element.jobTitle;
    const head5one = document.createElement("h5");
    head5one.className = "head5one";
    head5one.innerHTML = element.companyName;
    const head5two = document.createElement("h5");
    head5two.className = "head5two";
    head5two.innerHTML = element.location;

    contents.appendChild(head3);
    contents.appendChild(head5one);
    contents.appendChild(head5two);

    gridItem.appendChild(contents);

    const vac = document.createElement("div");
    vac.className = "vac";
    const head3two = document.createElement("h3");
    head3two.className = "head3two";
    head3two.innerHTML = "Vacancy:";
    const head1 = document.createElement("h1");
    head1.className = "head1";
    head1.innerHTML = element.vacancy;

    vac.appendChild(head3two);
    vac.appendChild(head1);
    gridItem.appendChild(vac);

    jobsContainer?.appendChild(gridItem);
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
