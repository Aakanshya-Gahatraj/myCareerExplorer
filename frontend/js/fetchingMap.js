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
  // eslint-disable-next-line no-unused-vars
  const citiesOfDistrict = {
    achham: ["mangalsen", "sanphebagar", "kamalbazar"],
    arghakhanchi: ["sandhikharka"],
    baglung: ["baglung", "galkot", "jaimini", "dhorpatan"],
    baitadi: ["dasharathchand", "melauli"],
    bajhang: ["jayaprithvi"],
    bajura: ["martadi", "badimalika", "tribeni", "budhiganga"],
    banke: ["nepalgunj", "kohalpur"],
    bara: ["kalaiya", "jitpursimara", "mahagadhimai"],
    bardiya: ["gulariya", "barbardiya", "rajapur", "bansgadhi"],
    bhaktapur: [
      "bhaktapur",
      "nagarkot",
      "suryabinayak",
      "thimi",
      "lokanthali",
      "changunarayan",
    ],
    bhojpur: ["bhojpur", "shadanand"],
    chitwan: [
      "bharatpur",
      "narayangadh",
      "narayangarh",
      "rampur",
      "sauraha",
      "devghat",
      "ratnanagar",
      "rapti",
    ],
    dadeldhura: ["amargadhi", "parshuram"],
    dailekh: ["narayan", "dullu", "aathabis"],
    dang: ["ghorahi", "tulsipur"],
    darchula: ["darchula", "mahakali", "shailyashikhar"],
    dhading: ["nilkantha", "galchi"],
    dhankuta: ["dhankuta", "mahalaxmi", "pakhribas"],
    dhanusa: ["janakpur", "chhireshwarnath"],
    dolakha: ["bhimeshwar", "charikot", "jiri"],
    dolpa: ["dunai", "thuli bheri"],
    doti: ["dipayal"],
    gorkha: ["gorkha", "palungtar"],
    gulmi: ["tamghas", "resunga"],
    humla: ["simikot"],
    ilam: ["suryodaya"],
    jajarkot: ["khalanga", "bheri"],
    jhapa: [
      "bhadrapur",
      "mechinagar",
      "birtamod",
      "damak",
      "shivasatakshi",
      "arjundhara",
    ],
    jumla: ["chandannath"],
    kailali: ["dhangadhi", "tikapur", "lamki chuha", "ghodaghodi"],
    kalikot: ["manma", "raskot", "tilagupha"],
    kanchanpur: ["bhimdatta", "krishnapur", "belauri", "mahendranagar"],
    kapilvastu: [
      "taulihawa",
      "banganga",
      "shivaraj",
      "buddhabhumi",
      "krishnanagar",
    ],
    kaski: ["pokhara", "lekhnath"],
    kathmandu: [
      "kathmandu",
      "baluwatar",
      "lainchaur",
      "lazimpat",
      "gongabu",
      "panipokhari",
      "putalisadak",
      "kamal pokhari",
      "new baneshwor",
      "mid baneshwor",
      "purano baneshwor",
      "boudhha",
      "thamel",
      "dallu",
      "thapathali",
      "durbarmarg",
      "dilibazar",
      "budhanilkantha",
      "chandragiri",
      "tokha",
      "gokarneshwar",
      "kirtipur",
      "gaushala",
      "gairidhara",
    ],
    kavre: ["dhulikhel", "banepa", "paunauti"],
    khotang: ["diktel"],
    lalitpur: [
      "lalitpur",
      "patan",
      "patan dhoka",
      "satdobato",
      "kupondole",
      "kandevsthan",
      "nakkhu",
      "Godawari",
      "jawalakhel",
      "imadol",
      "sanepa",
      "ekantakuna",
      "lagankhel",
    ],
    lamjung: ["besisahar", "sundarbazar", "rainas"],
    mahottari: ["jaleshwar", "bardibas"],
    makwanpur: ["hetauda"],
    manang: ["chame"],
    morang: [
      "biratnagar",
      "belbari",
      "urlabari",
      "ratuwamai",
      "rangeli",
      "sunawarshi",
      "letang",
    ],
    mugu: ["gamgadhi"],
    mustang: ["jomsom"],
    myagdi: ["beni"],
    nawalparasi: [
      "kawasoti",
      "ramgram",
      "madhyabindu",
      "gaindakot",
      "sunwal",
      "bardghat",
    ],
    nuwakot: ["bidur"],
    okhaldhunga: ["siddhicharan"],
    palpa: ["tansen", "rampur"],
    panchthar: ["phidim"],
    parbat: ["kushma", "phalewas"],
    parsa: ["birgunj"],
    pyuthan: ["pyuthan", "swargadwari"],
    ramechhap: ["manthali"],
    rasuwa: ["dhunche"],
    rautahat: ["gaur", "chandrapur"],
    rolpa: ["liwang"],
    rukum: ["rukumkot", "musikot"],
    rupandehi: [
      "siddharthanagar",
      "butwal",
      "tilottama",
      "lumbini",
      "devdaha",
      "manigram",
      "lumbini sanskritik",
      "sainamaina",
    ],
    salyan: ["salyan", "bagchaur", "shaarda"],
    sankhuwasabha: ["khandbari", "chainpur"],
    saptari: ["rajbiraj"],
    sarlahi: ["malangwa", "barahathwa", "ishwarpur"],
    sindhuli: ["kamalamai"],
    sindhupalchok: ["chautara", "melamchi", "barhabise"],
    siraha: ["siraha"],
    solukhumbu: ["salleri", "solu dudhkunda"],
    sunsari: [
      "inaruwa",
      "itahari",
      "dharan",
      "barahachhetra",
      "duhabi",
      "ramdhuni",
    ],
    surkhet: ["birendranagar", "gurbhakot", "panchapuri"],
    syangja: ["putalibazar", "waling"],
    tanahun: ["damauli", "vyas", "shuklagandaki", "bhanu"],
    taplejung: ["taplejung"],
    terhathum: ["myanglung"],
    udayapur: ["gaighat", "triyuga", "katari", "chaudandigadhi"],
  };

  // "bhatbhatini, ktm"=> ["bhatbhatini", "ktm"]
  const seperatedJobLists = jobLists
    .map((el) => el.location)
    .map((el) => el.split(","));

  console.log(seperatedJobLists);

  const jobLocations = seperatedJobLists.map((el) =>
    el.map((ele) => ele.trim())
  );
  console.log({ jobLocations });

  // Removing Nepal from locations eg; ["Kathmandu","Nepal"] but not ["Nepal"]
  for (let i = 0; i < jobLocations.length; i++) {
    // console.log("i: ", i);
    // console.log("No. of j: ", seperatedJobLists[i].length);
    if (jobLocations[i].length > 1) {
      for (let j = 1; j < jobLocations[i].length; j++) {
        // console.log(`j[${j}] ${seperatedJobLists[i][j]}`);
        if (jobLocations[i][j] == "Nepal") {
          jobLocations[i].splice(j, 1);
        }
      }
    }
  }
  // const jobLocations = seperatedJobLists;
  // console.log("Job Locations");
  // console.log(jobLocations);
  // // const districtKeys = Object.keys(citiesOfDistrict);
  // const districtVals = Object.values(citiesOfDistrict);

  // // final location list
  // const listForDistrict = [];
  // jobLocations.forEach((el) => {
  //   if (districtKeys.includes(el.toLowerCase())) listForDistrict.push(el);
  //   else {
  //     const districtIndex = districtVals.findIndex((cities) =>
  //       cities.includes(el.toLowerCase())
  //     );
  //     if (districtIndex >= 0) {
  //       listForDistrict.push(districtKeys[districtIndex]);
  //     } else {
  //       listForDistrict.push("Unknown");
  //     }
  //   }
  // });

  // let district = "";
  // if (listForDistrict.length < 1) {
  //   // no district found in location
  //   district = "Others";
  // } else if (listForDistrict.length == 1) {
  //   // 1 district present
  //   district = listForDistrict[0];
  // } else {
  //   // many district present
  //   district = listForDistrict.toString();
  // }

  const districtKeys = Object.keys(citiesOfDistrict);
  const districtVals = Object.values(citiesOfDistrict);

  jobLocations.forEach((loc) => {
    const districtsFound = [];
    for (const place of loc) {
      // When location is already a district
      // finding the district index of searched city in districtKeys

      const index = districtKeys.findIndex((el) =>
        String(el).includes(place.toLowerCase())
      );
      if (index > 0) {
        console.log("District Found-----", { index, place });
        if (districtsFound.includes(index) == false) {
          // saving the districts found
          districtsFound.push(index);
          districtDict[districtKeys[index]] += 1;
          console.log("District added", place, "cuz previous value not found!");
        }
      } else {
        // When location has a place eg; loc => pokhara ,
        // have to find respective district i.e district=> [...cities] eg : kaski=> ['pokhara']
        // finding the district index of searched city in citiesOfDistrict list

        const indexOfCity = districtVals.findIndex((el) =>
          String(el).includes(place.toLowerCase())
        );
        // console.log(
        //   `Index of searched City: ${place}, District: ${districtKeys[indexOfCity]} in cityList= `,
        //   indexOfCity
        // );

        // finding the respective index of found district in District Dict eg; districtDict["Kathmandu"]
        // console.log("Checker: ", districtsFound.includes(indexOfCity));

        if (indexOfCity > 0) {
          console.log("City Found-----", { indexOfCity, place });
          if (districtsFound.includes(indexOfCity) == false) {
            districtsFound.push(indexOfCity);
            districtDict[districtKeys[indexOfCity]] += 1;
            console.log("City added", place, "cuz previous value not found!");
          }
        }
      }
    }
  });

  const keys = Object.keys(districtDict);
  // console.log(keys); // ['num1', 'num2', 'num3', 'num4']

  const values = keys.map((key) => districtDict[key]);
  // console.log(values); // [10, 20, 5, 15]

  // Finding max value for color change in map
  const max = Math.max.apply(null, values);
  // console.log(max);

  // console.l;
  return { districtDict, max };
}
