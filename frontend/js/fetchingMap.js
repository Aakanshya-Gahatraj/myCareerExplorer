/* eslint-disable require-jsdoc */
/* eslint-disable no-invalid-this */
const form = document.getElementById("mapSearchBar-form");
// console.log(form);
async function getInfo(fd) {
  const response = await fetch(`http://localhost:3000/opportunities`, {
    method: "POST",
    body: fd,
  });
  // console.log(fd);
  const data = await response.json();
  return data;
}
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // const count = 0;
  // if (count == 1) d3.map.clear();
  const fdLoad = new FormData(form);
  const fd = new URLSearchParams(fdLoad);
  console.log([...fd]);
  const data = await getInfo(fd);
  console.log(data);
  const { districtDict, max } = countJobsPerDistricts(data);
  console.log(districtDict);
  console.log(max);
  // count += 1;
  showData(districtDict, max);
});

async function showData(districtDict, max) {
  // Width and height
  const w = 980;
  const h = 650;

  // Define map projection
  const projection = d3.geo
    .mercator()
    .scale(5300) // scale things down so see entire Nepal
    .translate([w / 2, h / 2]) // translate to center of screen
    .center([83.985593872070313, 28.465876770019531]);

  // Define path generator
  const path = d3.geo.path().projection(projection); // path generator that will convert GeoJSON to SVG paths
  const tooltip = d3.select(".tooltip");

  // Range of colors
  // eslint-disable-next-line no-unused-vars
  const color = d3.scale
    .linear()
    .domain([1, max])
    .range(["#239B56", "#7DCEA0"]);

  // Creating SVG in concerend div of html to append map
  const canvas = d3
    .select("#svganchor")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Legends
  canvas
    .append("circle")
    .attr("cx", 720)
    .attr("cy", 130)
    .attr("r", 6)
    .style("fill", "#7DCEA0");
  canvas
    .append("circle")
    .attr("cx", 720)
    .attr("cy", 160)
    .attr("r", 6)
    .style("fill", "#239B56");
  canvas
    .append("circle")
    .attr("cx", 720)
    .attr("cy", 190)
    .attr("r", 6)
    .style("fill", "#402a64");
  canvas
    .append("text")
    .attr("x", 740)
    .attr("y", 130)
    .text("High opportunities")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  canvas
    .append("text")
    .attr("x", 740)
    .attr("y", 160)
    .text("Less opportunities")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  canvas
    .append("text")
    .attr("x", 740)
    .attr("y", 190)
    .text("Not known")
    .style("font-size", "15px")
    .attr("alignment-baseline", "middle");
  canvas
    .append("text")
    .attr("x", 100)
    .attr("y", 550)
    .text("N E P A L")
    .style("font-size", "40px")
    .style("font-family", '"MullerBlack", "Arial Black", "aria", "sans-serif"')
    .style("fill", "gray")
    .attr("alignment-baseline", "middle");

  // Load in GeoJSON data
  d3.json("../js/nepal-districts.geojson", (json) => {
    // Binding data and creating one path per GeoJSON feature
    canvas
      .selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("stroke", "#8e8692")
      .style("fill", function (d) {
        // Get data value
        const value = districtDict[String(d.properties.DISTRICT).toLowerCase()];
        if (value > 0) {
          // If value exists…
          return color(value);
        } else {
          // If value is undefined…
          return "#402a64";
        }
      })
      .attr("class", "district")
      .on("mouseover", function (d) {
        d3.select(this).style("fill", function (d) {
          // Get data value
          const value =
            districtDict[String(d.properties.DISTRICT).toLowerCase()];
          if (value > 0) {
            // If value exists…
            return color(value);
          } else {
            // If value is undefined…
            return "#a5a5a7";
          }
        });
        return tooltip.style("hidden", false).html(d.properties.DISTRICT);
      })
      .on("mousemove", function (d) {
        tooltip
          .classed("hidden", false)
          .style("top", d3.event.pageY + "px")
          .style("left", d3.event.pageX + 15 + "px")
          .html(
            d.properties.DISTRICT +
              "<br/> No. of Jobs: " +
              districtDict[String(d.properties.DISTRICT).toLowerCase()]
          );
      })
      .on("mouseout", function () {
        d3.select(this).style("fill", function (d) {
          // Get data value
          const value =
            districtDict[String(d.properties.DISTRICT).toLowerCase()];
          if (value > 0) {
            // If value exists…
            return color(value);
          } else {
            // If value is undefined…
            return "#402a64";
          }
        });
        tooltip.classed("hidden", true);
      });
  });
}

// counting data

function countJobsPerDistricts(jobLists) {
  const districtDict = {
    achham: 0,
    arghakhanchi: 0,
    baglung: 0,
    baitadi: 0,
    bajhang: 0,
    bajura: 0,
    banke: 0,
    bara: 0,
    bardiya: 0,
    bhaktapur: 0,
    bhojpur: 0,
    chitwan: 0,
    dadeldhura: 0,
    dailekh: 0,
    dang: 0,
    darchula: 0,
    dhading: 0,
    dhankuta: 0,
    dhanusa: 0,
    dolakha: 0,
    dolpa: 0,
    doti: 0,
    gorkha: 0,
    gulmi: 0,
    humla: 0,
    ilam: 0,
    jajarkot: 0,
    jhapa: 0,
    jumla: 0,
    kailali: 0,
    kalikot: 0,
    kanchanpur: 0,
    kapilvastu: 0,
    kaski: 0,
    kathmandu: 0,
    kavre: 0,
    khotang: 0,
    lalitpur: 0,
    lamjung: 0,
    mahottari: 0,
    makwanpur: 0,
    manang: 0,
    morang: 0,
    mugu: 0,
    mustang: 0,
    myagdi: 0,
    nawalparasi: 0,
    nuwakot: 0,
    okhaldhunga: 0,
    palpa: 0,
    panchthar: 0,
    parbat: 0,
    parsa: 0,
    pyuthan: 0,
    ramechhap: 0,
    rasuwa: 0,
    rautahat: 0,
    rolpa: 0,
    rukum: 0,
    rupandehi: 0,
    salyan: 0,
    sankhuwasabha: 0,
    saptari: 0,
    sarlahi: 0,
    sindhuli: 0,
    sindhupalchok: 0,
    siraha: 0,
    solukhumbu: 0,
    sunsari: 0,
    surkhet: 0,
    syangja: 0,
    tanahun: 0,
    taplejung: 0,
    terhathum: 0,
    udayapur: 0,
  };
  const districtsList = [
    "achham",
    "arghakhanchi",
    "baglung",
    "baitadi",
    "bajhang",
    "bajura",
    "banke",
    "bara",
    "bardiya",
    "bhaktapur",
    "bhojpur",
    "chitwan",
    "dadeldhura",
    "dailekh",
    "dang",
    "darchula",
    "dhading",
    "dhankuta",
    "dhanusa",
    "dholkha",
    "dolpa",
    "doti",
    "gorkha",
    "gulmi",
    "humla",
    "ilam",
    "jajarkot",
    "jhapa",
    "jumla",
    "kailali",
    "kalikot",
    "kanchanpur",
    "kapilvastu",
    "kaski",
    "kathmandu",
    "kavre",
    "khotang",
    "lalitpur",
    "lamjung",
    "mahottari",
    "makwanpur",
    "manang",
    "morang",
    "mugu",
    "mustang",
    "myagdi",
    "nawalparasi",
    "nuwakot",
    "okhaldhunga",
    "palpa",
    "panchthar",
    "parbat",
    "parsa",
    "pyuthan",
    "ramechhap",
    "rasuwa",
    "rautahat",
    "rolpa",
    "rukum",
    "rupandehi",
    "salyan",
    "sankhuwasabha",
    "saptari",
    "sarlahi",
    "sindhuli",
    "sindhupalchok",
    "siraha",
    "solukhumbu",
    "sunsari",
    "surkhet",
    "syangja",
    "tanahu",
    "taplejung",
    "terhathum",
    "udayapur",
  ];
  // "bhatbhatini, ktm"=> ["bhatbhatini", "ktm"]
  const jobLocations = jobLists
    .map((el) => el.location)
    .map((el) =>
      el
        .replace(",", "")
        .split(" ")
        .map((el) => el.trim())
    );

  // split(",")

  jobLocations.forEach((loc) => {
    for (const place of loc) {
      const index = districtsList.findIndex((el) =>
        String(el).includes(place.toLowerCase())
      );
      console.log({ index, place });
      if (index > 0) {
        districtDict[districtsList[index]] += 1;
      }
      // else ma chai yo bhayena bhane bhitro ko cities haru sanga match garcha bhane keys ko indxx chai hya badhaune
      // eg: loc => pokhara ,, district=> [...cities] eg : kaski => ['pokhara']
    }
  });

  const keys = Object.keys(districtDict);
  console.log(keys); // ['num1', 'num2', 'num3', 'num4']

  const values = keys.map((key) => districtDict[key]);
  console.log(values); // [10, 20, 5, 15]

  const max = Math.max.apply(null, values);
  console.log(max);

  // console.l;
  return { districtDict, max };
}
