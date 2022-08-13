// @ts-check
/* eslint-disable require-jsdoc */
// eslint-disable-next-line require-jsdoc
function getCompanyData() {
  return fetch(`http://localhost:3000/company`)
    .then((response) => response.json())
    .then((data) => data);
}

async function showData() {
  const jobsContainer = document.querySelector(".circle-grid-container");
  const data = await getCompanyData();
  // console.log({ data });
  data.forEach((element) => {
    if (element.logo) {
      const jobElement = document.createElement("img");
      jobElement.className = "circle-item";
      jobElement.src = element.logo;
      jobsContainer?.appendChild(jobElement);
    }
  });
}

window.onload = () => {
  showData();
};
