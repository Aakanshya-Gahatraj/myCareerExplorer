/* eslint-disable no-unused-vars */
// @ts-nocheck
/* eslint-disable require-jsdoc */
// eslint-disable-next-line require-jsdoc

async function getLocationData(locationName) {
  console.log("here/......");
  const response = await fetch(
    `http://localhost:3000/location/${locationName}`
  );
  const data = await response.json();
  return data;
}

// LOGIC: { location: { $nin: [ "Kathmandu", "kathmandu", "Bhaktapur", "Lalitpur" ] }}

async function showData(id) {
  // @ts-ignore
  const data = await getLocationData(id);
  console.log(data);
  const totalVac = data[1];
  const actualData = data[0];
  console.log(totalVac);
  console.log(actualData);
  const btnElement = document.querySelector(".locButton");
  btnElement.innerHTML = `${id}: ${totalVac} Vacancies`;
  const jobsContainer = document.querySelector(".jobs-grid-container");

  actualData.forEach((element) => {
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
}

window.onload = () => {
  // retriving all query params
  const urlSearchParams = new URLSearchParams(
    window.location.search.replace("%20", "")
  );
  const params = Object.fromEntries(urlSearchParams.entries());
  console.log({ params });
  const myLocation = params.location;
  console.log(myLocation);
  if (myLocation) {
    showData(myLocation);
  }
};
