// CONSTANTS AND FUNCTIONS FOR MAP

// constants
const statePathColor = "#555";
const countyPathColor = "#ffffff80";
// univariate map colors
const stepColors = [
  ["#E6E6E6", "#B9E1F2", "#72C2E4"],
  ["#E6E6E6", "#DEC5E4", "#CB9AD7"],
];
const continuousColors = ["#F2F4F6", "#1D4F91"]; //["#71A6D5", "#F7F7F7"];
// bivariate map colors
const lowVar1 = ["#EFEFEF", "#AFD5E5", "#6CB7D7"]; // [lowVar2, medVar2, highVar2]
const medVar1 = ["#DEC5E4", "#A1AED8", "#6396CB"]; // [lowVar2, medVar2, highVar2]
const highVar1 = ["#CB9AD7", "#9388CB", "#5B75C0"]; // [lowVar2, medVar2, highVar2]
const bivariateColors = [
  "#EFEFEF",
  "#AFD5E5",
  "#6CB7D7",
  "#DEC5E4",
  "#A1AED8",
  "#6396CB",
  "#CB9AD7",
  "#9388CB",
  "#5B75C0",
];
const numBuckets = Math.floor(Math.sqrt(bivariateColors.length)); // 3
const noDataColor = "white";
const univariateStepVariables = [
  "diagnosed",
  "undiagnosed",
  "combined",
  // "combined",
  // "combined_prevalence",
  // "combined_prevalence",
];
const bivariateStepVariables = ["diagnosed", "undiagnosed"];
const binClassifier = "quantile"; // quantize, quantile or equalIntervals
const numSteps = 3; // for populating static maps
const legendTitles = [
  "Diagnosed CVI prevalence, per 100k",
  "Likely CVI prevalence, per 100k",
  "Total estimated CVI prevalence, per 100k",
  "Total estimated CVI prevalence, per 100k",
  "Total estimated CVI prevalence, per 100k",
];
const ariaLabels = [
  "Estimated prevalence of diagnosed CVI in the United States, by county. Counties are visualized on a color scale ranging from 50 to 250 people with CVI per 100000 people",
  "Estimated prevalence of likely CVI in the United States, by county. Counties are visualized on a color scale ranging from 50 to 250 people with CVI per 100000 people",
  "Estimated total prevalence CVI in the United States, by county. Counties are visualized on a color scale ranging from 50 to 250 people with CVI per 100000 people",
];
const legendTextColor = "#515151";
const legendBarWidth = 40 * 6;
const legendBarHeight = 15;
const maxWidth = 992; // max-width of <main>

let width = d3.min([window.innerWidth, maxWidth]);
// const width = window.innerWidth;
let height = window.innerHeight * 0.75; // from scrollytelling.js figureHeight - change this so that graphic can take up more than half the page height

const tooltipWidth = 230;
const hoveredCountyStroke = "#000000";

// color scales for map
// continuous color scale with domain based on multiple data columns
const colorScaleContinuous = (dataset, columns, numColors) => {
  const dataValues = Array.from(dataset.values())
    .map((d) => columns.map((c) => d[c])) //[d.diagnosed, d.undiagnosed, d.combined])
    .flat();

  const equalIntDomain = [];
  const dataExtent = d3.extent(dataValues);
  for (const i in d3.range(numColors - 1)) {
    equalIntDomain.push(
      +dataExtent[0] +
        ((+dataExtent[1] - +dataExtent[0]) / numColors) * (+i + 1)
    );
  }

  const min = d3.min(dataValues);
  const max = d3.max(dataValues);
  // if (numColors === 2) {
  // return d3
  //   .scaleLinear()
  //   .domain([min, max])
  //   .range(["#F2F4F6", "#1D4F91"]);
  // } else {
  //   return d3
  //     .scaleLinear()
  //     .domain(equalIntDomain)
  //     .range(d3.schemeBlues[numColors]);
  // }
  return d3.scaleThreshold(
    [50, 100, 150, 200, 250],
    ["#A4EBF6", "#55C8F0", "#06A6EA", "#0F7DC7", "#013796", "#002455"]
  );
};
// function to return discrete color scale based on variable we want to map; colors we want to map to; the type of scale (quantize, quantile or equalIntervals); whether we are doing the bivariate map or not
const colorScale = (
  dataset,
  variable,
  binClassifier = "quantile",
  step,
  bivariate = false
) => {
  const range = bivariate ? d3.range(numBuckets) : stepColors[step];
  //   const colorRangeDiscrete = stepColors[step];
  const data = Array.from(dataset.values()).map((d) => d[variable]);

  if (binClassifier === "quantize") {
    return d3.scaleQuantize().domain(d3.extent(data)).range(range).nice(); // .nice() gives roughly equal intervals if distribution is skewed
  } else if (binClassifier === "equalIntervals") {
    const equalIntDomain = [];
    const dataExtent = d3.extent(data);
    const numColors = range.length;
    for (const i in d3.range(numColors - 1)) {
      equalIntDomain.push(
        +dataExtent[0] +
          ((+dataExtent[1] - +dataExtent[0]) / numColors) * (+i + 1)
      );
    }
    return d3.scaleThreshold().domain(equalIntDomain).range(range);
  } else {
    return d3.scaleQuantile().domain(data).range(range);
  }
};

// generate tooltips - inspired by https://jhiatt.github.io/pages/county_project.html
function generate_tooltips(element, classSelector, keyboardNav = false) {
  const testScalingFactor = d3.min([
    document.querySelector("#viz").getBoundingClientRect().width / width,
    1,
  ]);
  const yScalingFactor =
    document.querySelector("#viz").getBoundingClientRect().height / height;
  // d3.selectAll(".tooltip-scrolly-map").remove();
  const tooltip = element
    .append("div")
    .style("width", `${tooltipWidth}px`)
    .style("pointer-events", "none")
    .style("display", null)
    .style("opacity", 0)
    .classed("tooltip-scrolly-map", true);
  // add tooltips
  // adapted from https://observablehq.com/@duynguyen1678/choropleth-with-tooltip
  // data = this.data;
  // var tooltip = element.append("g");
  // const tooltip = element
  //   .append("div")
  //   .style("width", `${tooltipWidth}px`)
  //   .style("pointer-events", "none")
  //   .classed("tooltip-scrolly-map", true);
  // format = d => `${this.data == this.ump_data ? (parseFloat(d)).toFixed(2) : (parseFloat(d)*100).toFixed(2)}%`;
  format = (d) => `${d}`;

  if (keyboardNav) {
    d3.selectAll(".county-path")
      .attr("stroke", countyPathColor)
      .attr("stroke-width", "0.7px");
    d3.select(`#county_${activeCounty}`)
      // d3.select(document.querySelector(`#county_${activeCounty}`))
      // d3.select(this)
      .attr("stroke", hoveredCountyStroke)
      .attr("stroke-width", "2px")
      .style("z-index", 999);

    // tooltip
    //   // .attr("transform", `translate(${d3.pointer(event, this)})`)
    //   .style("opacity", 1)
    //   .style("left", `${0 - tooltipWidth / 2}px`)
    //   .style("top", `${0 + 30}px`)
    //   .html(
    //     `${activeCounty}`
    //   );
  } else {
    element
      .selectAll(classSelector) //select sections of path with county outline
      .on("touchmove mousemove", function (event, d) {
        const hoveredCounty = d.properties.STATE + d.properties.COUNTY;
        if (cviData.get(hoveredCounty) !== undefined) {
          if (cviData.get(hoveredCounty).step4Color !== "url(#hatch-scrolly)") {
            // tooltip_text(d, tooltip, cviData);
            // console.log(tooltip_text(d, tooltip, cviData));
            tooltip
              // .attr("transform", `translate(${d3.pointer(event, this)})`)
              .style("opacity", 1)
              .style("left", `${event.offsetX - tooltipWidth / 2}px`)
              .style("top", `${event.offsetY + 30}px`)
              .html(
                `<strong>${cviData.get(hoveredCounty).county}, ${
                  cviData.get(hoveredCounty).state
                }</strong> <br>
                  Est. prevalence: ${d3.format(".0f")(
                    cviData.get(hoveredCounty).combined
                  )} per 100k`
              );
            d3.select(this)
              .attr("stroke", hoveredCountyStroke) //red outline of highlighted tooltip
              .attr("stroke-width", "2px")
              .raise();
          }
        }
      })
      .on("touchend mouseleave", function () {
        // element.selectAll(classSelector).on("blur", function () {
        // .on("focusout", function () {
        // console.log("blur event firing");
        // tooltip.call(callout, null);
        tooltip.style("opacity", 0).style("display", "null");
        d3.select(this)
          .attr("stroke", "#ffffff80") // return to original outline
          .attr("stroke-width", "1px")
          .lower();
      });
  }
}

// scrollama event handlers
function handleStepEnter(response) {
  if (cviData.size === 0) return;
  // response = { element, direction, index }

  // update graphic based on step
  currentStepMap = response.index;
  const countyPaths = d3.selectAll(".county-path-interactive"); // specify that we only want to change the counties in the interactive graphic container (the one that changes as we scroll)
  const legendTitle = d3.selectAll(".legend-title"); // change legend title on scroll

  countyPaths
    .transition()
    .duration(500)
    .attr("fill", function (d) {
      const countyFips = `${d.properties.STATE + d.properties.COUNTY}`;
      return cviData.get(countyFips)
        ? cviData.get(countyFips)[`step${currentStepMap}Color`]
        : "url(#hatch-scrolly)";
    });
  legendTitle.text(legendTitles[currentStepMap]);

  // if on the last step, make graphic interactive by activating mousemove event & placing steps within article behind figure
  if (currentStepMap === 4) {
    article.style("z-index", -10);
    // generate_tooltips(svg, ".county-path-interactive");
    generate_tooltips(d3.select("#viz"), ".county-path-interactive");
  } else {
    article.style("z-index", 10);
    countyPaths.on("mousemove", null);
  }
}

function init() {
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.5,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // 4. If user has prefers-reduced-motion set to 'reduce', turn off animation & scrollytelling
  if (mediaQuery.matches) {
    document.querySelector("#scrollToggle").checked = false;
    toggleScrollytelling(
      scroller,
      false,
      "#interactive-graphic-container",
      "#step-container",
      graphicsMap,
      stepsMap
    );
  }
}

// Enable/disable scrollytelling based on the toggle button state
function toggleScrollytelling(
  scrollerInstance,
  enable,
  interactiveGraphicId,
  stepContainerId,
  graphics,
  steps
) {
  if (enable) {
    // enable scrollytelling
    scrollerInstance.enable();
    // show container that contains graphic that will animate as we scroll
    // document.querySelector(interactiveGraphicId).style.display = "block";
    document.querySelector(interactiveGraphicId).style.visibility = "visible";
    document.querySelector(interactiveGraphicId).style.height = `${height}px`;
    // hide static graphics
    graphics.forEach((graphic) => (graphic.style.visibility = "hidden"));
    // increase height of steps for scrolling
    step.style("height", Math.floor(window.innerHeight * 0.75) + "px");
    steps.forEach(
      (step) =>
        (step.style.height = Math.floor(window.innerHeight * 0.75) + "px")
    );
    // sliding transition for carousel
    $("#slick").slick("unslick");
    $("#slick").slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: `<button type="button" class="slick-prev slick-arrow" aria-label="Display Previous Photo">Previous</button>`,
      nextArrow: `<button type="button" class="slick-next slick-arrow" aria-label="Display Next Photo">Next</button>`,
    });
  } else {
    // disable scrollytelling
    scrollerInstance.disable();
    // hide container that contains graphic that animates as we scroll
    // document.querySelector(interactiveGraphicId).style.display = "none";
    document.querySelector(interactiveGraphicId).style.visibility = "hidden";
    document.querySelector(interactiveGraphicId).style.height = "0px";
    // show static graphics
    graphics.forEach((graphic) => (graphic.style.visibility = "visible"));
    // auto height for steps since they are now stacked over each graphic
    steps.forEach((step) => (step.style.height = "auto"));
    // disable sliding transition for carousel
    $("#slick").slick("unslick");
    $("#slick").slick({
      dots: true,
      infinite: true,
      speed: 0,
      slidesToShow: 1,
      slidesToScroll: 1,
      prevArrow: `<button type="button" class="slick-prev slick-arrow" aria-label="Display Previous Photo">Previous</button>`,
      nextArrow: `<button type="button" class="slick-next slick-arrow" aria-label="Display Next Photo">Next</button>`,
    });
  }
}

function tabulate(data, columns) {
  var table = d3
    .select("#data-table-container")
    .append("table")
    .attr("id", "data-table");
  var thead = table.append("thead");
  var tbody = table.append("tbody");

  // append the header row
  thead
    .append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function (column) {
      return column;
    });

  // create a row for each object in the data
  var rows = tbody.selectAll("tr").data(data).join("tr");

  // create a cell in each row for each column
  var cells = rows
    .selectAll("td")
    .data(function (row) {
      return columns.map(function (column) {
        return { column: column, value: row[column] };
      });
    })
    .enter()
    .append("td")
    .text(function (d) {
      return d.value;
    });

  return table;
}

// Enable/disable scrollytelling based on the toggle button state
function toggleTable(enable, tableSelector) {
  if (enable) {
    // show container that contains graphic that will animate as we scroll
    document.querySelector(tableSelector).style.display = "block";
  } else {
    // hide container that contains graphic that animates as we scroll
    document.querySelector(tableSelector).style.display = "none";
  }
}
// LOAD DATA AND CREATE SCROLLYTELLING MAP

const svg = d3
  .select("#viz")
  .append("svg")
  .attr("id", "svg-interactive")
  .attr("role", "img")
  .attr(
    "aria-label",
    "Animated map of US counties transitioning between estimated diagnosed, likely and total CVI cases per 100000 people."
  )
  .attr("focusable", "false")
  .attr("width", "100%")
  .attr("height", height) //prev height
  .attr("viewBox", "0 0 " + width + " " + `${height + 65}`);
// .attr("preserveAspectRatio", "xMinYMin");

const g = svg
  .append("g")
  .attr("class", "map-g")
  .attr("transform", `translate(0, 65)`); // move map lower than legend
const legendG = svg
  .append("g")
  .attr("class", "legend-g")
  .attr("transform", `translate(${width / 2}, 20)`);

// const projection = d3
//   .geoAlbersUsa()
//   .translate([width / 2, height / 2])
//   // .scale((width - 1) / 2 / Math.PI);
//   .scale(1400)
//   // .fitSize([width, height], geojson)

let cviData = new Map();
let countyGeoData = new Map();

Promise.all([
  // geojson files downloaded from https://eric.clst.org/tech/usgeojson/, downloaded in turn from the US Census Bureau
  d3.json(
    "https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/min/countymin.json",
    // "https://raw.githubusercontent.com/kelsey-n/data/main/countyBorders_20m.json",
    // "https://raw.githubusercontent.com/kelsey-n/data/main/countyBorders_20m_centroids.json",
    // "https://raw.githubusercontent.com/kelsey-n/data/main/geoData/us_counties_closest_centroids.json",
    // "https://devperkins.wpengine.com/wp-content/uploads/2023/06/countyBorders_20m.json", // doesn't have closest centroids
    d3.autoType
  ),
  d3.json(
    "https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/min/statemin.json",
    //"https://raw.githubusercontent.com/kelsey-n/data/main/stateBorders_20m.json",
    // "https://devperkins.wpengine.com/wp-content/uploads/2023/06/stateBorders_20m.json",
    d3.autoType
  ),
  d3.csv(
    "https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/2023-06-01-county-level-CVI-output-for-DVL_v7.2.csv",
    // "2023 06 01 county level CVI output for DVL_v7.2.csv",
    function (d) {
      cviData.set(d.county_fips, {
        diagnosed: Math.round(+d.diagnosed_cvi_prevalence_ped_100k),
        undiagnosed: Math.round(+d.undiagnosed_cvi_prevalence_ped_100k),
        combined: Math.round(+d.combined_cvi_prevalence_ped_100k),
        county: d.county + " County",
        state: d.state_abbr,
        stateFull: d.state_full,
      });
    }
  ),
]).then((data) => {
  const countyBorders = data[0];
  const stateBorders = data[1];

  for (const d of countyBorders.features) {
    countyGeoData.set(`${d.properties.GEO_ID}`, {
      L: d.properties.closest_left,
      R: d.properties.closest_right,
      T: d.properties.closest_top,
      B: d.properties.closest_bottom,
    });
  }

  let projection = d3
    .geoAlbersUsa()
    .translate([width / 2, height / 2])
    // .scale((width - 1) / 2 / Math.PI);
    // .scale(1400)
    .fitSize([width, height], countyBorders);

  const step0ColorScale = colorScale(
    cviData,
    univariateStepVariables[0],
    binClassifier,
    0 // CHANGE THIS TO ADJUST THE COLOR SCALE
  );
  const step1ColorScale = colorScale(
    cviData,
    univariateStepVariables[1],
    binClassifier,
    0 // CHANGE THIS TO ADJUST THE COLOR SCALE
  );
  const step2ColorScale = colorScale(
    cviData,
    univariateStepVariables[2],
    binClassifier,
    0 // CHANGE THIS TO ADJUST THE COLOR SCALE
  );

  const colorSameScale = colorScaleContinuous(
    cviData,
    ["diagnosed", "undiagnosed", "combined"],
    2
  );

  // Bivariate color scale - uses same colorScale so we can change the binClassifier as well
  const xScaleBivariate = colorScale(
    cviData,
    bivariateStepVariables[0],
    binClassifier,
    null,
    true
  );
  const yScaleBivariate = colorScale(
    cviData,
    bivariateStepVariables[1],
    binClassifier,
    null,
    true
  );

  const hatch_size = 4;
  const defs = svg.append("defs");
  const hatch_pattern_2 = defs
    .append("pattern")
    .attr("id", "hatch-scrolly")
    .attr("width", hatch_size)
    .attr("height", hatch_size)
    .attr("patternTransform", `rotate(35)`)
    .attr("patternUnits", "userSpaceOnUse"); //used to make the pattern independent of location of circle
  //Add the actual pattern shape
  hatch_pattern_2
    .append("rect")
    .attr("width", hatch_size / 5)
    .attr("height", hatch_size)
    .style("fill", "#000")
    .style("opacity", ".4");

  // Add color values for each step to the data HERE so we're not calculating the color as the scrolling is happening:
  for (const [key, value] of cviData) {
    cviData.set(key, {
      ...value,
      step0Color:
        colorSameScale(value[univariateStepVariables[0]]) !== undefined
          ? colorSameScale(value[univariateStepVariables[0]])
          : "url(#hatch-scrolly)",
      step1Color:
        colorSameScale(value[univariateStepVariables[1]]) !== undefined
          ? colorSameScale(value[univariateStepVariables[1]])
          : "url(#hatch-scrolly)",
      step2Color:
        colorSameScale(value[univariateStepVariables[2]]) !== undefined
          ? colorSameScale(value[univariateStepVariables[2]])
          : "url(#hatch-scrolly)",
      step3Color:
        colorSameScale(value[univariateStepVariables[2]]) !== undefined
          ? colorSameScale(value[univariateStepVariables[2]])
          : "url(#hatch-scrolly)",
      step4Color:
        colorSameScale(value[univariateStepVariables[2]]) !== undefined
          ? colorSameScale(value[univariateStepVariables[2]])
          : "url(#hatch-scrolly)",
      // Different color scale for each map
      // step0Color: step0ColorScale(value[univariateStepVariables[0]]),
      // step1Color: step1ColorScale(value[univariateStepVariables[1]]),
      // step2Color: step2ColorScale(value[univariateStepVariables[2]]),
    });
  }

  // Draw the map
  g.append("g")
    .selectAll(".county-path-interactive")
    .data(countyBorders.features)
    .join("path")
    .attr("class", "county-path-interactive")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", "#ffffff80")
    .attr("stroke-width", "0.7px")
    .attr("fill", function (d) {
      const countyFips = `${d.properties.STATE + d.properties.COUNTY}`;
      return cviData.get(countyFips)
        ? cviData.get(countyFips)[`step${0}Color`]
        : "url(#hatch-scrolly)";
    });
  g.append("g")
    .selectAll(".state-path")
    .data(stateBorders.features)
    .join("path")
    .attr("class", "state-path")
    .attr("d", d3.geoPath().projection(projection))
    .attr("stroke", statePathColor)
    .attr("fill", "none");

  // Add the legend using d3-legend library
  legendG
    .selectAll(".legend-title")
    .data([null])
    .join("text")
    .attr("class", "legend-title")
    .text(legendTitles[0])
    .attr("text-anchor", "middle")
    .attr("dx", "1.5em");

  const linear = d3
    .scaleLinear()
    .domain([0, 50, 100, 150, 200, 250])
    .range(["#A4EBF6", "#55C8F0", "#06A6EA", "#0F7DC7", "#013796", "#002455"]);

  legendG
    .append("g")
    .attr("class", "legendLinear")
    .attr("transform", `translate(${-legendBarWidth / 2}, ${20})`);

  const legendLinear = d3
    .legendColor()
    .shapeWidth(legendBarWidth / 6)
    .labelFormat(d3.format(".0f"))
    .cells(["", 50, 100, 150, 200, 250])
    .orient("horizontal")
    .labelAlign("start")
    .shapePadding(0)
    .labelOffset(15)
    .scale(linear);
  // .scale(color);

  legendG.select(".legendLinear").call(legendLinear);

  // Add vertical lines to legend
  d3.selectAll(".cell").append("line").attr("y2", 23).attr("stroke", "black");
  // Move legend labels slightly to left
  d3.selectAll(".cell").selectAll(".label").attr("dx", "-0.71em");
  const noDataLegendG = d3
    .selectAll(".legend-g")
    .append("g")
    .attr(
      "transform",
      `translate(${legendBarWidth / 2 + 25}, ${legendBarHeight + 5})`
    );
  noDataLegendG
    .append("rect")
    .attr("width", legendBarWidth / 6)
    .attr("height", 15)
    // .attr("x", legendBarWidth + 25)
    .attr("stroke", "#555")
    .attr("fill", "url(#hatch-scrolly)");
  noDataLegendG
    .selectAll(".no-data-text")
    .data([null])
    .join("text")
    .attr("class", "no-data-text")
    // .append("text")
    .text("No data")
    .attr("y", legendBarHeight + 25)
    .attr("dx", "-0.71em");

  // draw maps on static graphic divs once, then can switch them out on user toggle
  for (const step of d3.range(numSteps)) {
    let svgStatic = d3
      .select(`#static-graphic-map-${step}`)
      .append("svg")
      .attr("id", `svg-${step}`)
      .attr("role", "img")
      .attr("aria-label", ariaLabels[step])
      .attr("focusable", step === 2 ? "true" : "false")
      .attr("tabindex", step === 2 ? 0 : "")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", "0 0 " + width + " " + `${height + 65}`);
    // .attr("preserveAspectRatio", "xMinYMin");

    const defsStatic = svgStatic.append("defs");
    const hatch_pattern_2 = defsStatic
      .append("pattern")
      .attr("id", "hatch-scrolly-static")
      .attr("width", hatch_size)
      .attr("height", hatch_size)
      .attr("patternTransform", `rotate(35)`)
      .attr("patternUnits", "userSpaceOnUse"); //used to make the pattern independent of location of circle
    //Add the actual pattern shape
    hatch_pattern_2
      .append("rect")
      .attr("width", hatch_size / 5)
      .attr("height", hatch_size)
      .style("fill", "#000")
      .style("opacity", ".4");

    // Draw the map
    d3.select(`#svg-${step}`)
      .append("g")
      .attr("transform", `translate(0, 65)`) // move map lower than legend
      .selectAll(".county-path")
      .data(countyBorders.features)
      .join("path")
      .attr("class", "county-path")
      .attr("id", (d) => (step === 2 ? `county_${d.properties.GEO_ID}` : null))
      .attr("focusable", step === 2 ? "true" : "false")
      .attr("tabindex", step === 2 ? -1 : null) // -1 to only allow programmatic focus, not auto focus with tab
      .attr("d", d3.geoPath().projection(projection))
      .attr("stroke", countyPathColor)
      .attr("stroke-width", "0.7px")
      // .on("click", function () {
      //   d3.select(this)
      //     .attr("stroke", hoveredCountyStroke) //red outline of highlighted tooltip
      //     .attr("stroke-width", "2px")
      //     .raise();
      // })
      .attr("fill", function (d) {
        const countyFips = `${d.properties.STATE + d.properties.COUNTY}`;
        return cviData.get(countyFips)
          ? cviData.get(countyFips)[`step${step}Color`] ===
            "url(#hatch-scrolly)"
            ? "url(#hatch-scrolly-static)"
            : cviData.get(countyFips)[`step${step}Color`]
          : "url(#hatch-scrolly-static)";
      });

    d3.select(`#svg-${step}`)
      .append("g")
      .attr("transform", `translate(0, 65)`) // move map lower than legend
      .selectAll(".state-path")
      .data(stateBorders.features)
      .join("path")
      .attr("class", "state-path")
      // .attr("id", function (d) {
      //   if (step === 2) {
      //     return d.properties.NAME;
      //   } else {
      //     return null;
      //   }
      // })
      .attr("d", d3.geoPath().projection(projection))
      .attr("stroke", statePathColor)
      .attr("fill", "none");

    // Add the legend
    let legendGStatic = d3
      .select(`#svg-${step}`)
      .append("g")
      .attr("class", `legend-g-static-${step}`)
      .attr("transform", `translate(${width / 2}, ${width < 800 ? -50 : 20})`);

    legendGStatic
      .selectAll(".legend-title-static")
      .data([null])
      .join("text")
      .attr("class", "legend-title-static")
      .text(legendTitles[step])
      .attr("text-anchor", "middle")
      .attr("dx", "1.5em");

    legendGStatic
      .append("g")
      .attr("class", `legendLinearStatic-${step}`)
      .attr("transform", `translate(${-legendBarWidth / 2}, ${20})`);

    d3.select(`.legendLinearStatic-${step}`).call(legendLinear);

    // Add vertical lines to legend
    d3.selectAll(".cell").append("line").attr("y2", 23).attr("stroke", "black");
    // Move legend labels slightly to left
    d3.selectAll(".cell").selectAll(".label").attr("dx", "-0.71em");
    const noDataLegendGStatic = legendGStatic
      .append("g")
      .attr(
        "transform",
        `translate(${legendBarWidth / 2 + 25}, ${legendBarHeight + 5})`
      );
    noDataLegendGStatic
      .append("rect")
      .attr("width", legendBarWidth / 6)
      .attr("height", 15)
      // .attr("x", legendBarWidth + 25)
      .attr("stroke", "#555")
      .attr("fill", "url(#hatch-scrolly-static)");
    noDataLegendGStatic
      .selectAll(".no-data-text-static")
      .data([null])
      .join("text")
      .attr("class", "no-data-text-static")
      .text("No data")
      .attr("y", legendBarHeight + 25)
      .attr("dx", "-0.71em");

    // Only make the final map interactive
    generate_tooltips(d3.select("#static-graphic-map-2"), ".county-path");
    // generate_tooltips(d3.select("#static-graphic-map-2"), ".state-path");
  }

  function redrawOnResize() {
    // Recalculate window width and height
    width = d3.min([window.innerWidth, maxWidth]);
    // const width = window.innerWidth;
    height = window.innerHeight * 0.75; // from scrollytelling.js figureHeight - change this so that graphic can take up more than half the page height

    projection = d3
      .geoAlbersUsa()
      .translate([width / 2, height / 2])
      // .scale((width - 1) / 2 / Math.PI);
      // .scale(1400)
      .fitSize([width, height], countyBorders);

    // d3.selectAll(".county-path-interactive .state-path").remove();
    let g = d3.select(".map-g");
    if (g) g.remove();

    //   const g = svg
    // .append("g")
    // .attr("class", "map-g")
    // .attr("transform", `translate(0, 65)`); // move map lower than legend

    svg.attr("viewBox", "0 0 " + width + " " + `${height + 65}`);

    const newg = svg
      .append("g")
      .attr("class", "map-g")
      .attr("transform", `translate(0, 65)`); // move map lower than legend.append("g")
    newg
      .selectAll(".county-path-interactive")
      .data(countyBorders.features)
      .join("path")
      .attr("class", "county-path-interactive")
      .attr("d", d3.geoPath().projection(projection))
      .attr("stroke", "#ffffff80")
      .attr("stroke-width", "0.7px")
      .attr("fill", function (d) {
        const countyFips = `${d.properties.STATE + d.properties.COUNTY}`;
        return cviData.get(countyFips)
          ? cviData.get(countyFips)[`step${0}Color`]
          : "url(#hatch-scrolly)";
      });
    newg
      .append("g")
      .selectAll(".state-path")
      .data(stateBorders.features)
      .join("path")
      .attr("class", "state-path")
      .attr("d", d3.geoPath().projection(projection))
      .attr("stroke", statePathColor)
      .attr("fill", "none");

    legendG.attr("transform", `translate(${width / 2}, 20)`);
  }

  let doit;
  window.addEventListener("resize", function () {
    // if window hasn't been resized in 100ms, then redraw - inspired by __________________________________________________
    clearTimeout(doit);
    doit = setTimeout(redrawOnResize, 100);
  });

  // can also invoke init() function here, then everything will load after the datasets load. However initial loading of the html elements will not look good

  // Create table view for map
  tabulate(
    Array.from(cviData.values()).filter((d) => !isNaN(d.combined)), // Filter out all NaN values in columns containing data so they are recognized as numeric for sorting purposes
    ["county", "stateFull", "combined"]
  );
  // convert to DataTable
  $(document).ready(function () {
    let table = $("#data-table").DataTable({
      columns: [
        { data: "county", title: "County" },
        { data: "stateFull", title: "State" },
        {
          data: "combined",
          title: "Estimated CVI prevalence (per 100k)",
          className: "align-right",
        },
      ],
      order: [[2, "desc"]],
    });
  });
});
// HANDLE SCROLLYTELLING ANIMATION

// using d3 for convenience
var main = d3.select("#main-map");
var scrolly = main.select("#scrolly");
var figure = scrolly.select("figure");
var article = scrolly.select("article");
var step = article.selectAll(".step");
let currentStepMap = 0;

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = height;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();

  // 4. adjust map scale
  // let projection = d3
  //   .geoAlbersUsa()
  //   .translate([width / 2, height / 2])
  //   // .scale((width - 1) / 2 / Math.PI);
  //   // .scale(1400)
  //   .fitSize([width, height]);
}

const graphicsMap = document.querySelectorAll(".static-graphic-map");
const stepsMap = document.querySelectorAll(".step");

// Handle toggle button change
const scrollToggle = document.getElementById("scrollToggle");
scrollToggle.addEventListener("change", function () {
  toggleScrollytelling(
    scroller,
    this.checked,
    "#interactive-graphic-container",
    "#step-container",
    graphicsMap,
    stepsMap
  );
  document.querySelector("#cvi-audio-transcript").innerHTML =
    "“My vision is very unpredictable. It likes to do what it wants. It gets frustrating because I want to be able to see things, I want to be able to participate in things, but sometimes it's hard for me because my vision just completely goes at the wrong time! For me, my vision can go from probably visually impaired to only seeing movement, light, shadows, and color... I guess kinda like Monet paintings. Very distorted. I wish people understood more that our brains decide when it wants to work, visually, and when it wants to “peace out”, I'm done for the day.”";
  document.querySelector("#cvi-audio-transcript-header").innerHTML =
    "Tina's vision is like a Monet painting";
});

// kick things off
init();
// };

// Logic for keyboard navigation of third static map (animation off)

// Create map of each county's x and y centroid coordinates to lookup closest vertical or horizontal county to actively focused one
// Alternatively, this can be a map of each county, containing the closest county in each direction. When we press the relevant arrow key, we look up the specific column for that county
// To get these values for moving right across the map: for each county, we want the county with the closest vertical value and next closest horiz value in the pos x direction

// let activeCounty = null;
// window.addEventListener("keydown", function (e) {
//   e = e || window.event;

//   const tooltip = d3
//     .select("#static-graphic-map-2")
//     .append("div")
//     .style("width", `${tooltipWidth}px`)
//     .style("pointer-events", "none")
//     .style("display", null)
//     .style("opacity", 0)
//     .classed("tooltip-keyboard-nav", true);

//   // default: Jewell County in Nebraska: GEO_ID 0500000US20089
//   if (document.activeElement === document.querySelector("#svg-2")) {
//     if ([37, 38, 39, 40].includes(e.keyCode)) {
//       e.preventDefault(); // Disable scrolling

//       activeCounty = "0500000US20089";
//       document.querySelector(`#county_${activeCounty}`).focus();
//       // generate_tooltips(
//       //   d3.select("#static-graphic-map-2"),
//       //   ".county-path",
//       //   true
//       // );
//     }
//   } else if (
//     activeCounty !== null &&
//     document.activeElement ===
//       document.querySelector(`#county_${activeCounty}`)
//   ) {
//     e.preventDefault(); // Disable scrolling

//     if (e.keyCode === 13) {
//       // enter key
//       tooltip
//         // .attr("transform", `translate(${d3.pointer(event, this)})`)
//         .style("opacity", 1)
//         .style("left", `${0 - tooltipWidth / 2}px`)
//         .style("top", `${0 + 30}px`)
//         .html(
//           `<strong>${cviData.get(activeCounty.split("US")[1]).county}, ${
//             cviData.get(activeCounty.split("US")[1]).state
//           }</strong> <br>
//             Est. prevalence: ${d3.format(".0f")(
//               cviData.get(activeCounty.split("US")[1]).combined
//             )} per 100k`
//         );
//       // .html(`${activeCounty}`);
//     }

//     if (e.keyCode === 27) {
//       // esc key
//       // tooltip.style("opacity", 0).style("display", "null");
//       d3.selectAll(".tooltip-keyboard-nav").remove();
//     }

//     // force focus to specific states based on which arrow key selected - up/down/left/right
//     if (e.keyCode === 39) {
//       // right arrow key
//       d3.selectAll(".tooltip-keyboard-nav").remove();
//       document
//         .querySelector(`#county_${countyGeoData.get(activeCounty).R}`)
//         .focus();
//       activeCounty = countyGeoData.get(activeCounty).R;
//       // generate_tooltips(
//       //   d3.select("#static-graphic-map-2"),
//       //   ".county-path",
//       //   true
//       // );
//     } else if (e.keyCode === 37) {
//       // left arrow key
//       d3.selectAll(".tooltip-keyboard-nav").remove();
//       document
//         .querySelector(`#county_${countyGeoData.get(activeCounty).L}`)
//         .focus();
//       activeCounty = countyGeoData.get(activeCounty).L;
//     } else if (e.keyCode === 38) {
//       // up arrow key
//       d3.selectAll(".tooltip-keyboard-nav").remove();
//       document
//         .querySelector(`#county_${countyGeoData.get(activeCounty).T}`)
//         .focus();
//       activeCounty = countyGeoData.get(activeCounty).T;
//     } else if (e.keyCode === 40) {
//       // down arrow key
//       d3.selectAll(".tooltip-keyboard-nav").remove();
//       document
//         .querySelector(`#county_${countyGeoData.get(activeCounty).B}`)
//         .focus();
//       activeCounty = countyGeoData.get(activeCounty).B;
//     }
//   } else {
//     activeState = null;
//     generate_tooltips(
//       d3.select("#static-graphic-map-2"),
//       ".county-path",
//       true
//     );
//   }
// });

// Handle toggle button change
const tableToggle = document.getElementById("toggle-table");
tableToggle.addEventListener("change", function () {
  toggleTable(this.checked, "#data-table-container");
});
