// @ts-nocheck
/* eslint-disable require-jsdoc */

async function getData(jobName) {
  const name = { jobname: jobName };
  const response = await fetch(`http://localhost:3000/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(name),
  });
  const data = await response.json();
  return data;
}

async function showData(id) {
  console.log("Inside show data: " + id);
  const data = await getData(id);
  console.log({ data });

  if (data.length > 0) {
    // Storing the data in session for trend analysis
    const dataString = JSON.stringify(data);
    sessionStorage.setItem("searchData", dataString);

    let sum = 0;
    for (const job of data) {
      sum += job.vacancy;
    }

    const navTop = document.querySelector("#navtop");
    const listItem1 = document.createElement("li");
    const listheading = document.createElement("h1");
    listheading.className = "_pink button";
    listheading.id = "searchResults";
    listheading.innerHTML = `${id}: ${sum} Vacancies`;

    listItem1.appendChild(listheading);
    const listItem2 = document.createElement("li");
    listItem2.className = "_pink btn";
    listItem2.id = "trend";
    listItem2.innerHTML = "View Trend Graph";

    navTop.appendChild(listItem1);
    navTop.appendChild(listItem2);

    const analyzeTrend = document.querySelector("#trend");
    analyzeTrend.onclick = () => {
      window.location.href = `trends.html?jobName=${id}`;
    };

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
      head5one.innerHTML = `Company:  ${element.companyName}`;
      const head5two = document.createElement("h5");
      head5two.className = "head5two";
      head5two.innerHTML = `Location:  ${element.location}`;

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
  } else {
    showError("Sorry no such job found !!");
  }
}

function showError(message) {
  const navTop = document.querySelector("#navtop");
  const listItem1 = document.createElement("li");
  listItem1.innerHTML = message;
  listItem1.style.color = "rgb(240, 239, 239)";
  listItem1.style.fontstyle = "MullerBlack, Arial Black, arial, sans-serif";
  listItem1.style.fontsize = "50px";

  navTop.appendChild(listItem1);

  const jobsContainer = document.querySelector(".jobs-grid-container");
  const errContents = document.createElement("div");
  errContents.className = "errContents";
  const image = document.createElement("img");
  image.className = "errImg";
  image.src = "../img/errr.png";

  errContents.appendChild(image);
  jobsContainer.appendChild(errContents);
}

window.onload = () => {
  // retriving all query params
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  //   console.log({ params });
  const job = params.job;

  //   console.log(job);
  if (job) {
    showData(job);
  } else {
    showError("Please type in a job's name !");
  }
};
