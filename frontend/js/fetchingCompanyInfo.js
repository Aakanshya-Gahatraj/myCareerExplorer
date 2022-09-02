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
  const image = document.querySelector(".logoCompany");
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

// eslint-disable-next-line no-unused-vars
async function viewJobs(companyName) {
  const res = await fetch(`${API}/company/${companyName}`);
  const jobsData = await res.json();
  console.log("jobsdata: ", jobsData);
  console.log("jobsdata length: ", jobsData.length);

  const noJobElement = document.getElementById("no-job");
  const jobSubContainer = document.getElementById("jobs-sub-container");

  if (jobsData.length == 0) {
    if (noJobElement) return;
    const itemsContainer = document.querySelector(".compInfoJobs");
    const items = document.createElement("div");
    items.className = "compInfoJobItems";
    items.id = "no-job";
    const noJobs = document.createElement("h4");
    noJobs.innerHTML = "No Jobs Yet or Expired!";
    items.appendChild(noJobs);
    itemsContainer.appendChild(items);
    // console.log("Executed!");
  } else {
    if (jobSubContainer) return;
    jobsData.forEach((el) => {
      const itemsContainer = document.querySelector(".compInfoJobs");
      const itemsSubContainer = document.createElement("div");
      itemsSubContainer.id = "jobs-sub-container";
      const items = document.createElement("div");
      items.className = "compInfoJobItems";
      const jobName = document.createElement("h4");
      jobName.innerHTML = el.jobTitle;
      const jobLocation = document.createElement("h6");
      jobLocation.innerHTML = el.location;
      jobLocation.style.fontWeight = 100;
      const jobVac = document.createElement("h6");
      jobVac.innerHTML = `Vacancy: ${el.vacancy}`;
      items.appendChild(jobName);
      items.appendChild(jobLocation);
      items.appendChild(jobVac);
      itemsSubContainer.appendChild(items);
      itemsContainer.appendChild(itemsSubContainer);
    });
  }
  // document
  //   .getElementsByClassName(".viewButton")
  //   .target.setAttribute("disabled", true);
}
