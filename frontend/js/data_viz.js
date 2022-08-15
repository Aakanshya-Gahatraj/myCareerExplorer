/* eslint-disable no-invalid-this */
// Width and height
const w = 1000;
const h = 700;

// Define map projection
const projection = d3.geo
  .mercator()
  .scale(5300)
  .translate([w / 2, h / 2])
  .center([83.985593872070313, 28.465876770019531]);

// Define path generator
const path = d3.geo.path().projection(projection);

const tooltip = d3.select(".tooltip");

// Create SVG
const svg = d3
  .select("#svganchor")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Legend
svg
  .append("circle")
  .attr("cx", 800)
  .attr("cy", 130)
  .attr("r", 6)
  .style("fill", "#69b3a2");
svg
  .append("circle")
  .attr("cx", 800)
  .attr("cy", 160)
  .attr("r", 6)
  .style("fill", "#404080");
svg
  .append("circle")
  .attr("cx", 800)
  .attr("cy", 190)
  .attr("r", 6)
  .style("fill", "#404080");
svg
  .append("text")
  .attr("x", 820)
  .attr("y", 130)
  .text("High opportunities")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");
svg
  .append("text")
  .attr("x", 820)
  .attr("y", 160)
  .text("Less opportunities")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");
svg
  .append("text")
  .attr("x", 820)
  .attr("y", 190)
  .text("Unknown")
  .style("font-size", "15px")
  .attr("alignment-baseline", "middle");

// Load in GeoJSON data
d3.json("nepal-districts.geojson", (json) => {
  // Binding data and creating one path per GeoJSON feature
  svg
    .selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("stroke", "dimgray")
    .attr("class", "district")
    .on("mouseover", function (d) {
      d3.select(this).attr("stroke-width", 2);
      return tooltip.style("hidden", false).html(d.properties.DISTRICT);
    })
    .on("mousemove", function (d) {
      tooltip
        .classed("hidden", false)
        .style("top", d3.event.pageY + "px")
        .style("left", d3.event.pageX + 10 + "px")
        .html(d.properties.DISTRICT + " hello");
    })
    .on("mouseout", function () {
      tooltip.classed("hidden", true);
    });
});
