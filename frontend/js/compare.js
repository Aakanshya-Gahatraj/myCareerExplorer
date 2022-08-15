/* eslint-disable require-jsdoc */
const form = document.getElementById("compare-form");
async function getComparison(fd) {
  const response = await fetch(`http://localhost:3000/compare`, {
    method: "POST",
    body: fd,
  });
  const data = await response.json();
  return data;
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const fdLoad = new FormData(form);
  const fd = new URLSearchParams(fdLoad);
  // console.log([...fd]);
  const data = await getComparison(fd);
  showData(data);
});

async function showData(data) {
  console.log("I'm Here.");
  // eslint-disable-next-line no-unused-vars
  const comparisonContainer = document.querySelector(".comparison-card");
  console.table({ data });
  data.forEach((el) => {
    const divElement = document.createElement("div");
    divElement.className = "comparison-item";
    const heading = document.createElement("h1");
    heading.innerText = `${el._id}`;
    const paragraph = document.createElement("h3");
    paragraph.innerText =
      "Total No. of Vacancies till date: " + el.totalVacancy;
    divElement.appendChild(heading);
    divElement.append(paragraph);
    comparisonContainer?.appendChild(divElement);
  });
}
