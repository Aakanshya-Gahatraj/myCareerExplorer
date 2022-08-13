// @ts-check
/* eslint-disable require-jsdoc */
// eslint-disable-next-line require-jsdoc
function getLocationData() {
  return fetch(`http://localhost:3000/location`)
    .then((response) => response.json())
    .then((data) => data);
}

async function showData() {
  const jobsContainer = document.querySelector(".puzzle-grid-container");
  const data = await getLocationData();
  // console.log({ data });
  data.forEach((element) => {
    const divElement = document.createElement("div");
    divElement.className = "grid-item";
    divElement.innerText = element.location + " ( " + element.vacancy + " )";
    jobsContainer?.appendChild(divElement);
  });
}

window.onload = () => {
  showData();
};
