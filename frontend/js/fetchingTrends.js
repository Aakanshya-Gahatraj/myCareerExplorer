// @ts-nocheck
/* eslint-disable require-jsdoc */

const searchData = JSON.parse(sessionStorage.getItem("searchData"));

function getData(jobName) {
  console.log("Inside show data: ");
  const data = Array.from(searchData);

  // ISO Date: 2022-06-25T13:22:15.496+00:00
  // getting only date from ISO Date with regex
  // making an object with actual dates and vacancy of the particular job
  const extractedData = [];
  const dateRegex = /\d{4}(.\d{2}){2}/;
  data.forEach((el) => {
    extractedData.push({
      createdAt: el.createdAt.match(dateRegex)[0], // this returns an array & its [0] index includes the date
      vacancy: el.vacancy,
    });
  });

  console.log(extractedData);

  //   adding vacancies of the particular jobs from same date
  const sumOfSameDate = extractedData.reduce((c, v) => {
    c[v.createdAt] = (c[v.createdAt] || 0) + v.vacancy;
    return c;
  }, {});

  // console.log(sumOfSameDate);

  // managed the structure of data
  const structuredDateList = Object.keys(sumOfSameDate).map((el) => ({
    createdAt: el,
    vacancy: sumOfSameDate[el],
  }));
  return structuredDateList.sort(
    (a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt)
  );
}

// eslint-disable-next-line no-unused-vars
// async function showData(dateVacancyData) {
function showData(jobName) {
  const trendHeader = document.querySelector(".titleHead");
  trendHeader.innerHTML = `${jobName}`;
  const dateVacancyData = getData(jobName);
  console.log({ dateVacancyData });

  // dateVacancyData.forEach((el) => console.log(dateVacancyData.vacancy));

  // let staticArr = [];

  // Setting dimension
  const dim = {
    width: 800,
    height: 580,
    margin: 80,
  };

  const margin = { top: 0, right: 20, bottom: 60, left: 150 };

  const svg = d3
    .select("#trendChart")
    .append("svg")
    .attr("width", dim.width + margin.left)
    .attr("height", dim.height + margin.bottom)
    .attr("margin", dim.margin);

  // labels
  svg
    .append("text")
    .attr("x", 25)
    .attr("y", 300)
    .text("Vacancy")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", 250)
    .attr("y", 580)
    .text(`Demand for ${jobName}s from June to Sep 2022`)
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");

  // The X-Axis for date
  const xAxis = d3
    .scaleTime()
    .domain(
      d3.extent(dateVacancyData, function (d) {
        console.log(d.createdAt);
        return d3.timeParse("%Y-%m-%d")(d.createdAt);
      })
    )
    // .nice()
    .range([margin.left + 17, dim.width]);
  // console.log({ svg });
  svg
    .append("g")
    .attr("transform", `translate(0, ${dim.height - dim.margin + 1.5})`)
    .call(d3.axisBottom(xAxis));

  // The Y-Axis for vacancy
  const yAxis = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dateVacancyData, function (d) {
        return d.vacancy;
      }),
    ])
    .nice()
    .range([dim.height - dim.margin, dim.margin]);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left + 15}, 0)`)
    .call(d3.axisLeft(yAxis));
  // }

  svg
    .append("path")
    .datum(dateVacancyData)
    .attr("fill", "#cce5df")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 1.5)
    .attr(
      "d",
      d3
        .area()
        .x((d) => {
          const val = xAxis(d3.timeParse("%Y-%m-%d")(d.createdAt));
          // console.log({ val, date: d });
          return val;
        })
        .y0(yAxis(0))
        .y1((d) => {
          const yval = yAxis(d.vacancy);
          // console.log({ yval, d });
          return yval;
        })
    );
}

window.onload = () => {
  //   retriving all query params
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  //   console.log({ params });
  const job = params.jobName;
  // console.log(job);
  if (job) {
    // eslint-disable-next-line no-unused-vars
    showData(job);
    // showData(dateVacancyData);
  }
};
