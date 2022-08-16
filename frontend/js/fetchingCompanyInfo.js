/* eslint-disable require-jsdoc */
const API = "http://localhost:3000";
const companyInfodata = JSON.parse(sessionStorage.getItem("companyData"));

window.onload = () => {
  // retriving all query params
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log({ params });
  const companyID = params.companyId;
  console.log(companyID);

  const companyDetail = Array.from(companyInfodata).find(
    (el) => el._id === companyID
  );
  console.log({ companyDetail });
  showData(companyDetail);
};

async function showData(companyDetail) {
  //   const companyInfoContainer = document.querySelector(".companyInfo");
  const image = document.querySelector(".logo");
  image.src = `${companyDetail.logo}`;
  const head1 = document.querySelector("h1");
  head1.innerHTML = `${companyDetail.companyName}`;
  const head3 = document.querySelector("h3");
  head3.innerHTML = `${companyDetail.industry}`;
  const paragraph = document.querySelector("p");
  paragraph.innerHTML = `${companyDetail.about}`;
  const viewJobs = document.querySelector("h4");
  viewJobs.id = `${companyDetail.companyName}`;
}

// const compViewJobsCta = document.querySelector(".compInfoCta");
// console.log("hello", compViewJobsCta);
// compViewJobsCta.addEventListener("click", () => {
//   console.log("clicked");
// });
// eslint-disable-next-line no-unused-vars
async function viewJobs(companyName) {
  const res = await fetch(`${API}/company/${companyName}`);
  const jobsData = await res.json();
  console.log("jobsdata", jobsData);
  // use selectors to get the container and show the jobs data
}
