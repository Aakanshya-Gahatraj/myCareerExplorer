// @ts-check
/* eslint-disable require-jsdoc */
function getCompanyData() {
  return fetch(`http://localhost:3000/company`)
    .then((response) => response.json())
    .then((data) => data);
}

async function showData() {
  const totalnoOfCompanies = document.querySelector(".compButton");
  const imgContainer = document.querySelector(".circle-grid-container");
  const data = await getCompanyData();
  console.log({ data });
  const totalCompanies = data.length;
  // @ts-ignore
  totalnoOfCompanies.innerHTML = `${totalCompanies} Companies`;

  const dataString = JSON.stringify(data);
  sessionStorage.setItem("companyData", dataString);
  data.forEach((element) => {
    if (element.logo) {
      const companyLogos = document.createElement("img");
      companyLogos.className = "circle-item";
      companyLogos.title = `${element.companyName}`;
      companyLogos.src = element.logo;
      companyLogos.onclick = () => {
        window.location.href = `compInfo.html?companyId=${element._id}`;
      };
      // const logoToolTip = document.createElement("h5");
      // logoToolTip.innerHTML =
      // logoToolTip.className = "tooltip";
      imgContainer?.appendChild(companyLogos);
    }
  });
}

window.onload = () => {
  showData();
};
