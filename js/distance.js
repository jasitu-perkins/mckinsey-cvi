import {
  Runtime,
  Inspector,
} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
// import define from "https://api.observablehq.com/d/39a654e98e6c2f64@1788.js?v=3";

import define1 from "https://api.observablehq.com/d/a33468b95d0b15b0@808.js?v=3&resolutions=39a654e98e6c2f64@1788";

// TO DELETE!!!!
function toggleTable(enable, tableSelector) {
  if (enable) {
    // show container that contains graphic that will animate as we scroll
    document.querySelector(tableSelector).style.display = "block";
  } else {
    // hide container that contains graphic that animates as we scroll
    document.querySelector(tableSelector).style.display = "none";
  }
}
// !!!!!!!!!!!!!!!!!!!!!!!

// Handle toggle button change
const tableToggleDistance = document.getElementById(
  "toggle-table-trivariate-distance"
);
tableToggleDistance.addEventListener("change", function () {
  toggleTable(this.checked, "#data-table-trivariate-wrapper-distance");
});

function _1(md) {
  return md`
# Trivariate Choropleth v2 - Distance to CVI centers
  `;
}

function _csvfile(Inputs) {
  return Inputs.file({ label: "CSV file", accept: ".csv", required: false });
}

function _cviCenters(Inputs) {
  return Inputs.file({
    label: "CVI centers (.csv)",
    accept: ".csv",
    required: false,
  });
}

function _filterTitle(html) {
  return html`<svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.50018 14.1514L1.06592 1.5H22.9344L14.5002 14.1514V22.5H9.50018V14.1514ZM2.93444 2.5L10.5002 13.8486V21.5H13.5002V13.8486L21.0659 2.5H2.93444Z"
        fill="#333333"
      /></svg
    ><strong>Filter counties</strong>`;
}

function _cviFilterDistance(Inputs, d3, html) {
  return Inputs.range(d3.extent([50, 500]), {
    value: 50,
    step: 50,
    id: "oi-3a86ea-3",
    label: html`<span class="sr-only">Show counties on distance map with </span
      >Estimated CVI prevalence (per 100k) of at least:`,
  });
}

function _legendTitle(html) {
  return html`<svg
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.9">
        <path
          d="M1 7.33691L12.9246 0.999572L25 7.41229L13 13.7496L1 7.33691Z"
          stroke="#231F20"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1 12.2126L13 18.6254L25 12.288"
          stroke="#231F20"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M1 17.4626L13 23.8754L25 17.538"
          stroke="#231F20"
          stroke-miterlimit="10"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g></svg
    ><strong>Map layers</strong>`;
}

function _marker() {
  return `<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 0.679688C9.37697 0.679688 4.07812 4.59423 4.07812 11.1446C4.07812 18.0072 13.7673 27.7752 14.1796 28.1875C14.2644 28.2727 14.3799 28.3203 14.5 28.3203C14.6201 28.3203 14.7356 28.2727 14.8204 28.1875C15.2327 27.7752 24.9219 18.0072 24.9219 11.1446C24.9219 4.59423 19.623 0.679688 14.5 0.679688ZM14.5 14.7266C12.4981 14.7266 10.875 13.1035 10.875 11.1016C10.875 9.09966 12.4981 7.47656 14.5 7.47656C16.5019 7.47656 18.125 9.09966 18.125 11.1016C18.125 13.1035 16.5019 14.7266 14.5 14.7266Z" fill="#FFB81C"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.3516 11.0547C18.3516 13.1818 16.6272 14.9062 14.5 14.9062C12.3728 14.9062 10.6484 13.1818 10.6484 11.0547C10.6484 8.92753 12.3728 7.20312 14.5 7.20312C16.6272 7.20312 18.3516 8.92753 18.3516 11.0547ZM11.1016 11.0547C11.1016 12.9316 12.6231 14.4531 14.5 14.4531C16.3769 14.4531 17.8984 12.9316 17.8984 11.0547C17.8984 9.17778 16.3769 7.65625 14.5 7.65625C12.6231 7.65625 11.1016 9.17778 11.1016 11.0547Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.1831 16.5203C24.1657 14.5057 24.6953 12.6839 24.6953 11.0977C24.6953 5.12539 19.9829 0.859375 14.5 0.859375C9.01711 0.859375 4.30469 5.12539 4.30469 11.0977C4.30469 12.6839 4.83434 14.5057 5.8169 16.5203C6.68577 18.3018 7.88603 20.1887 9.33411 22.1273C10.4289 23.5929 11.6014 25.0037 12.7739 26.3086C13.1843 26.7654 13.5655 27.1764 13.9077 27.5352C14.0276 27.6609 14.1341 27.7711 14.2261 27.8651C14.2814 27.9217 14.3197 27.9605 14.3398 27.9805L14.5 28.1407L14.6602 27.9805C14.6803 27.9605 14.7186 27.9217 14.7739 27.8651C14.8659 27.7711 14.9724 27.6609 15.0923 27.5352C15.4345 27.1764 15.8157 26.7654 16.2261 26.3086C17.3986 25.0037 18.5711 23.5929 19.6659 22.1273C21.114 20.1887 22.3142 18.3018 23.1831 16.5203ZM15.8891 26.0057C15.4818 26.4591 15.1036 26.8668 14.7644 27.2224C14.667 27.3245 14.5787 27.4162 14.5 27.497C14.4213 27.4162 14.333 27.3245 14.2356 27.2224C13.8964 26.8668 13.5182 26.4591 13.1109 26.0057C11.947 24.7104 10.783 23.3099 9.69714 21.8561C8.26476 19.9385 7.07913 18.0747 6.22417 16.3217C5.2692 14.3636 4.75781 12.6047 4.75781 11.0977C4.75781 5.38626 9.25786 1.3125 14.5 1.3125C19.7421 1.3125 24.2422 5.38626 24.2422 11.0977C24.2422 12.6047 23.7308 14.3636 22.7758 16.3217C21.9209 18.0747 20.7352 19.9385 19.3029 21.8561C18.217 23.3099 17.053 24.7104 15.8891 26.0057Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M18.3516 11.0547C18.3516 13.1818 16.6272 14.9062 14.5 14.9062C12.3728 14.9062 10.6484 13.1818 10.6484 11.0547C10.6484 8.92753 12.3728 7.20312 14.5 7.20312C16.6272 7.20312 18.3516 8.92753 18.3516 11.0547ZM11.1016 11.0547C11.1016 12.9316 12.6231 14.4531 14.5 14.4531C16.3769 14.4531 17.8984 12.9316 17.8984 11.0547C17.8984 9.17778 16.3769 7.65625 14.5 7.65625C12.6231 7.65625 11.1016 9.17778 11.1016 11.0547Z" stroke="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M23.1831 16.5203C24.1657 14.5057 24.6953 12.6839 24.6953 11.0977C24.6953 5.12539 19.9829 0.859375 14.5 0.859375C9.01711 0.859375 4.30469 5.12539 4.30469 11.0977C4.30469 12.6839 4.83434 14.5057 5.8169 16.5203C6.68577 18.3018 7.88603 20.1887 9.33411 22.1273C10.4289 23.5929 11.6014 25.0037 12.7739 26.3086C13.1843 26.7654 13.5655 27.1764 13.9077 27.5352C14.0276 27.6609 14.1341 27.7711 14.2261 27.8651C14.2814 27.9217 14.3197 27.9605 14.3398 27.9805L14.5 28.1407L14.6602 27.9805C14.6803 27.9605 14.7186 27.9217 14.7739 27.8651C14.8659 27.7711 14.9724 27.6609 15.0923 27.5352C15.4345 27.1764 15.8157 26.7654 16.2261 26.3086C17.3986 25.0037 18.5711 23.5929 19.6659 22.1273C21.114 20.1887 22.3142 18.3018 23.1831 16.5203ZM15.8891 26.0057C15.4818 26.4591 15.1036 26.8668 14.7644 27.2224C14.667 27.3245 14.5787 27.4162 14.5 27.497C14.4213 27.4162 14.333 27.3245 14.2356 27.2224C13.8964 26.8668 13.5182 26.4591 13.1109 26.0057C11.947 24.7104 10.783 23.3099 9.69714 21.8561C8.26476 19.9385 7.07913 18.0747 6.22417 16.3217C5.2692 14.3636 4.75781 12.6047 4.75781 11.0977C4.75781 5.38626 9.25786 1.3125 14.5 1.3125C19.7421 1.3125 24.2422 5.38626 24.2422 11.0977C24.2422 12.6047 23.7308 14.3636 22.7758 16.3217C21.9209 18.0747 20.7352 19.9385 19.3029 21.8561C18.217 23.3099 17.053 24.7104 15.8891 26.0057Z" stroke="black"/>
</svg>
`;
}

function _distanceMarkerLegend(html, marker) {
  return html`${marker}CVI care provider `;
}

function _distanceLabel(html) {
  return html`Distance to CVI care provider`;
}

function _distanceLegend(Legend, d3) {
  return Legend(
    d3.scaleOrdinal(["Low", "Med", "High"], ["#FFDFEE", "#FFBFCE", "#E0004D"]),
    {
      tickSize: 0,
      width: 150,
    }
  );
}

function _noDataLegendDistance(html, cviFilterDistance) {
  return html`<div
    style="display: flex; flex-direction: row; gap: 50px; flex-wrap: wrap"
  >
    <div style="display: flex; flex-direction: column; align-items: center">
      <svg height="10" width="49" style="margin-bottom: -10px">
        <rect
          width="49"
          height="10"
          fill="url(#hatch-distance)"
          stroke="#555"
        ></rect>
      </svg>
      <p>No data</p>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center">
      <svg height="10" width="49" style="margin-bottom: -10px">
        <rect width="49" height="10" fill="#efefef" stroke="#555"></rect>
      </svg>
      <p>Est. CVI prevalence < ${cviFilterDistance}</p>
    </div>
  </div>`;
}

function _tooltipStyles(html) {
  return html`
<style type="text/css">

#distance-svg-container {
  position: relative
}

.tooltip-bivariate-map, 
.tooltip-bivariate-map-distance {
  position: absolute;
  background: #ffffff;
  color: #000000;
  border-radius: 2px;
  left: 0px;
  top: 0px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 -5px 15px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  padding: 12px;
}

  .tooltip-bivariate-map:before, 
  .tooltip-bivariate-map-distance:before {
    content: "";
    position: absolute;
    left: 50%;
    top: -15px;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-bottom: 18px solid #ffffff;
    border-left: 15px solid transparent;
    margin-left: -15px;
  }

.tooltip-bivariate-map span,
.tooltip-bivariate-map-distance span {
    width: 12px;
    height: 12px;
    background-color: black;
    display: inline-block;
}

.sr-only:not(:focus, :focus-within, :active) { 
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

`;
}

function _svgContainerDistance(html) {
  return html`<div id="distance-svg-container"></div>`;
}

function _distanceChart(
  d3,
  topojson,
  us,
  color,
  data,
  path,
  fullData,
  format,
  cviCenter
) {
  // const svg = d3.create("svg")
  const [viewBoxWidth, viewBoxHeight] = [975, 610];
  const [markerWidth, markerHeight] = [29, 29];

  const projection = d3
    .geoAlbersUsa()
    .scale(1300)
    .translate([viewBoxWidth / 2, viewBoxHeight / 2]);

  d3.selectAll("#distance-map-svg").remove();
  d3.selectAll(".tooltip-bivariate-map-distance").remove();

  const svg = d3
    .select("#distance-svg-container")
    .append("svg")
    .attr("id", "distance-map-svg")
    .attr("role", "img")
    .attr(
      "aria-label",
      "Map of US counties showing locations of CVI care providers and distance of each county to a CVI care provider. Each county is colored according to good-poor distance to a CVI care provider."
    )
    .attr("focusable", "false")
    .attr("viewBox", [0, 0, viewBoxWidth, viewBoxHeight]);

  const hatch_size = 4;
  const defs = svg.append("defs");
  const hatch_pattern_2 = defs
    .append("pattern")
    .attr("id", "hatch-distance")
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

  const tooltipWidth = 350;

  // draw counties
  svg
    .append("g")
    .selectAll(".county-path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
    .attr("class", "county-path")
    .attr("fill", (d) => color(data.get(d.id)))
    .attr("d", path)
    .attr("stroke", "#ffffff80")
    .on("touchmove mousemove", function (event, d) {
      if (fullData.get(d.id)) {
        const name = d.properties.name;
        const [x, y] = d3.pointer(event, this);

        // stroke around hovered county
        d3.select(this)
          .attr("stroke", "#000000")
          .attr("stroke-width", "2px")
          .raise();

        // show the tooltip if hovering over a county with data
        tooltipDistance
          .style("opacity", 1)
          .style("left", `${event.offsetX - tooltipWidth / 2 - 4}px`)
          .style("top", `${event.offsetY + 30}px`).html(`<strong>${
          d.properties.name
        } County, ${fullData.get(d.id).state}</strong> <br> 
                      Est. CVI prevalence: ${Math.round(
                        fullData.get(d.id).cvi
                      )} per 100k
                      ${format(data.get(d.id), d.id, d)}`);
      }
    })
    .on("touchend mouseleave", function () {
      tooltipDistance.style("opacity", 0).style("display", "null");
      d3.select(this)
        .attr("stroke", "#ffffff80") // return to original outline
        .attr("stroke-width", "1px")
        .lower();
    });

  // draw states
  svg
    .append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", "#00000080")
    .attr("stroke-linejoin", "round")
    .style("pointer-events", "none")
    .attr("d", path);

  // draw border around US
  svg
    .append("path")
    .datum(topojson.mesh(us, us.objects.nation))
    .attr("fill", "none")
    .attr("stroke", "#00000080")
    .attr("stroke-linejoin", "round")
    .style("pointer-events", "none")
    .attr("d", path);

  // add markers for CVI centers
  // Inspired by https://observablehq.com/@bradydowling/u-s-state-capitals
  const cviCenters = svg.selectAll("g").data(cviCenter).join("g");

  const cviCenterGroups = cviCenters
    .append("g")
    .attr(
      "transform",
      ({ longitude, latitude }) =>
        `translate(${projection([longitude, latitude])[0] - markerWidth / 2}, ${
          projection([longitude, latitude])[1] - markerHeight
        })`
    );

  const svgGroups = cviCenterGroups
    .append("svg")
    .attr("width", "29")
    .attr("height", "29")
    .attr("viewBox", "0 0 29 29")
    .attr("fill", "none")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .style("pointer-events", "none");

  // Add paths to svg parent group
  svgGroups
    .append("path")
    .attr("fillRule", "evenodd")
    .attr("clipRule", "evenodd")
    .attr(
      "d",
      "M14.5 0.679688C9.37697 0.679688 4.07812 4.59423 4.07812 11.1446C4.07812 18.0072 13.7673 27.7752 14.1796 28.1875C14.2644 28.2727 14.3799 28.3203 14.5 28.3203C14.6201 28.3203 14.7356 28.2727 14.8204 28.1875C15.2327 27.7752 24.9219 18.0072 24.9219 11.1446C24.9219 4.59423 19.623 0.679688 14.5 0.679688ZM14.5 14.7266C12.4981 14.7266 10.875 13.1035 10.875 11.1016C10.875 9.09966 12.4981 7.47656 14.5 7.47656C16.5019 7.47656 18.125 9.09966 18.125 11.1016C18.125 13.1035 16.5019 14.7266 14.5 14.7266Z"
    )
    .attr("fill", "#FFB81C");
  svgGroups
    .append("path")
    .attr("fillRule", "evenodd")
    .attr("clipRule", "evenodd")
    .attr(
      "d",
      "M18.3516 11.0547C18.3516 13.1818 16.6272 14.9062 14.5 14.9062C12.3728 14.9062 10.6484 13.1818 10.6484 11.0547C10.6484 8.92753 12.3728 7.20312 14.5 7.20312C16.6272 7.20312 18.3516 8.92753 18.3516 11.0547ZM11.1016 11.0547C11.1016 12.9316 12.6231 14.4531 14.5 14.4531C16.3769 14.4531 17.8984 12.9316 17.8984 11.0547C17.8984 9.17778 16.3769 7.65625 14.5 7.65625C12.6231 7.65625 11.1016 9.17778 11.1016 11.0547Z"
    )
    .attr("fill", "black");
  svgGroups
    .append("path")
    .attr("fillRule", "evenodd")
    .attr("clipRule", "evenodd")
    .attr(
      "d",
      "M23.1831 16.5203C24.1657 14.5057 24.6953 12.6839 24.6953 11.0977C24.6953 5.12539 19.9829 0.859375 14.5 0.859375C9.01711 0.859375 4.30469 5.12539 4.30469 11.0977C4.30469 12.6839 4.83434 14.5057 5.8169 16.5203C6.68577 18.3018 7.88603 20.1887 9.33411 22.1273C10.4289 23.5929 11.6014 25.0037 12.7739 26.3086C13.1843 26.7654 13.5655 27.1764 13.9077 27.5352C14.0276 27.6609 14.1341 27.7711 14.2261 27.8651C14.2814 27.9217 14.3197 27.9605 14.3398 27.9805L14.5 28.1407L14.6602 27.9805C14.6803 27.9605 14.7186 27.9217 14.7739 27.8651C14.8659 27.7711 14.9724 27.6609 15.0923 27.5352C15.4345 27.1764 15.8157 26.7654 16.2261 26.3086C17.3986 25.0037 18.5711 23.5929 19.6659 22.1273C21.114 20.1887 22.3142 18.3018 23.1831 16.5203ZM15.8891 26.0057C15.4818 26.4591 15.1036 26.8668 14.7644 27.2224C14.667 27.3245 14.5787 27.4162 14.5 27.497C14.4213 27.4162 14.333 27.3245 14.2356 27.2224C13.8964 26.8668 13.5182 26.4591 13.1109 26.0057C11.947 24.7104 10.783 23.3099 9.69714 21.8561C8.26476 19.9385 7.07913 18.0747 6.22417 16.3217C5.2692 14.3636 4.75781 12.6047 4.75781 11.0977C4.75781 5.38626 9.25786 1.3125 14.5 1.3125C19.7421 1.3125 24.2422 5.38626 24.2422 11.0977C24.2422 12.6047 23.7308 14.3636 22.7758 16.3217C21.9209 18.0747 20.7352 19.9385 19.3029 21.8561C18.217 23.3099 17.053 24.7104 15.8891 26.0057Z"
    )
    .attr("fill", "black");
  svgGroups
    .append("path")
    .attr("fillRule", "evenodd")
    .attr("clipRule", "evenodd")
    .attr(
      "d",
      "M18.3516 11.0547C18.3516 13.1818 16.6272 14.9062 14.5 14.9062C12.3728 14.9062 10.6484 13.1818 10.6484 11.0547C10.6484 8.92753 12.3728 7.20312 14.5 7.20312C16.6272 7.20312 18.3516 8.92753 18.3516 11.0547ZM11.1016 11.0547C11.1016 12.9316 12.6231 14.4531 14.5 14.4531C16.3769 14.4531 17.8984 12.9316 17.8984 11.0547C17.8984 9.17778 16.3769 7.65625 14.5 7.65625C12.6231 7.65625 11.1016 9.17778 11.1016 11.0547Z"
    )
    .attr("stroke", "black");
  svgGroups
    .append("path")
    .attr("fillRule", "evenodd")
    .attr("clipRule", "evenodd")
    .attr(
      "d",
      "M23.1831 16.5203C24.1657 14.5057 24.6953 12.6839 24.6953 11.0977C24.6953 5.12539 19.9829 0.859375 14.5 0.859375C9.01711 0.859375 4.30469 5.12539 4.30469 11.0977C4.30469 12.6839 4.83434 14.5057 5.8169 16.5203C6.68577 18.3018 7.88603 20.1887 9.33411 22.1273C10.4289 23.5929 11.6014 25.0037 12.7739 26.3086C13.1843 26.7654 13.5655 27.1764 13.9077 27.5352C14.0276 27.6609 14.1341 27.7711 14.2261 27.8651C14.2814 27.9217 14.3197 27.9605 14.3398 27.9805L14.5 28.1407L14.6602 27.9805C14.6803 27.9605 14.7186 27.9217 14.7739 27.8651C14.8659 27.7711 14.9724 27.6609 15.0923 27.5352C15.4345 27.1764 15.8157 26.7654 16.2261 26.3086C17.3986 25.0037 18.5711 23.5929 19.6659 22.1273C21.114 20.1887 22.3142 18.3018 23.1831 16.5203ZM15.8891 26.0057C15.4818 26.4591 15.1036 26.8668 14.7644 27.2224C14.667 27.3245 14.5787 27.4162 14.5 27.497C14.4213 27.4162 14.333 27.3245 14.2356 27.2224C13.8964 26.8668 13.5182 26.4591 13.1109 26.0057C11.947 24.7104 10.783 23.3099 9.69714 21.8561C8.26476 19.9385 7.07913 18.0747 6.22417 16.3217C5.2692 14.3636 4.75781 12.6047 4.75781 11.0977C4.75781 5.38626 9.25786 1.3125 14.5 1.3125C19.7421 1.3125 24.2422 5.38626 24.2422 11.0977C24.2422 12.6047 23.7308 14.3636 22.7758 16.3217C21.9209 18.0747 20.7352 19.9385 19.3029 21.8561C18.217 23.3099 17.053 24.7104 15.8891 26.0057Z"
    )
    .attr("stroke", "black");

  // append tooltip to parent div
  const tooltipDistance = d3
    .select("#distance-svg-container")
    .append("div")
    .style("width", `${tooltipWidth}px`)
    .style("pointer-events", "none")
    .style("display", null)
    .style("opacity", 0)
    .classed("tooltip-bivariate-map-distance", true);

  return svg.node();
}

function _numCounties(html, tableData) {
  return html`<div role="status" style="font-size: 14px; font-weight: 700">
    ${tableData.length} counties
  </div>`;
}

function _cviCenter(cviCenters) {
  // return cviCenters.csv({ typed: true });
  return d3.csv(
    "https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/eye_centers_zip_lat_long_kaggle.csv"
  );
}

function _data(filtered) {
  return Object.assign(
    new Map(
      filtered.map(({ county_fips, distToProviderCat, cvi }) => [
        county_fips,
        [distToProviderCat, cvi],
      ])
    ),
    { title: ["Distance to CVI care provider"] }
  );
}

function _fullData(filtered) {
  return Object.assign(new Map(filtered.map((d) => [d.county_fips, d])), {
    title: ["Physicians", "Uninsured"],
  });
}

function _path(d3) {
  return d3.geoPath();
}

function _distanceColors() {
  return ["#FFDFEE", "#FFBFCE", "#E0004D"];
}

function _colors() {
  return [
    "#d3d3d3",
    "#82caca",
    "#00bcbc",
    "#d48ac5",
    "#8384bd",
    "#007bb0",
    "#d608ad",
    "#8408a5",
    "#00079a",
  ];
}

function _color(cviFilterDistance, distanceColors) {
  return (value) => {
    if (!value) return "url(#hatch-distance)";
    let [a, b] = value;
    if (b < cviFilterDistance) return "#efefef";
    // else if (distanceFilter)
    return distanceColors[a];
    // return "#efefef"
  };
}

function _capitalize() {
  return function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };
}

function _labelsDistance() {
  return ["good", "med", "poor"];
}

function _27(data) {
  return data.title;
}

function _format(
  fullData,
  cviFilterDistance,
  distanceColors,
  data,
  labelsDistance
) {
  return (value, id, d) => {
    if (!value) return "N/A";
    let [a, b] = value;
    const distVal = Math.round(fullData.get(id).distToProvider);
    if (b < cviFilterDistance) return "";
    else {
      return `<br><hr><span style="background-color: ${distanceColors[a]}"></span> ${data.title[0]}: ${distVal} miles (${labelsDistance[a]})`;
    }
  };
}

function _states(us) {
  return new Map(us.objects.states.geometries.map((d) => [d.id, d.properties]));
}

function _us(FileAttachment) {
  return FileAttachment("counties-albers-10m.json").json();
}

function _31(topojson, us) {
  return topojson
    .feature(us, us.objects.states)
    .features.filter((d) => d.properties.name === "Texas");
}

function _raw(csvfile) {
  return (
    // csvfile.csv({typed: true})
    d3.csv(
      "https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/2023-06-01-county-level-CVI-output-for-DVL_v7.2.csv"
    )
  );
}

function _filtered(wrangleData, raw) {
  return wrangleData(raw).map((d) => ({
    ...d,
    distToProviderCat: +d.distToProviderCat.substring(0, 1) - 1,
  }));
}

let table;
let filteredDataDistance;

$(document).ready(function () {
    // Initialize DataTable
    table = $("#data-table-trivariate-distance").DataTable({
      destroy: true,
      columns: [
        { data: "name", title: "County" },
        { data: "stateFull", title: "State" },
        {
          data: "cvi",
          title: "Estimated CVI prevalence (per 100k)",
          className: "align-right",
        },
        {
          data: "distToProvider",
          title: "Distance to CVI center (miles)",
          className: "align-right",
        },
      ],
      order: [[2, "desc"]],
      responsive: true,
      drawCallback: function(){ // running code after table draw
        let paginationLinks = document.querySelectorAll('.paginate_button');

        paginationLinks.forEach(function(link) {
          if (link.hasAttribute('aria-role')) {
            link.removeAttribute('aria-role');
            link.setAttribute('role', 'link');
          }
        });
      },
      initComplete: function() {
       $(this.api().table().container()).find('input').attr('autocomplete', 'off');
      }
    });
    // Recalculates responsive datatable once toggle button triggered
    $('#toggle-table-trivariate-distance').change(function () {
        if(this.checked) {
            $('#data-table-trivariate-wrapper-distance').css('height', 'auto');
            table.columns.adjust().responsive.recalc();
        } else {
            $('#data-table-trivariate-wrapper-distance').css('height', '0');
        }
    });   
});

function _tableData(filtered, cviFilterDistance) {
  filteredDataDistance = filtered.filter((d) => d.cvi > cviFilterDistance);
  
  // Populate DataTable with preloaded data
  table.clear();
  table.rows.add(Array.from(filteredDataDistance.values()));
  table.draw();

  return filtered.filter((d) => d.cvi > cviFilterDistance);
}


function _35(d3, filtered) {
  return d3
    .scaleQuantile(
      filtered.map((d) => d.distToProvider),
      d3.range(3)
    )
    .quantiles();
}

function _36(d3, filtered) {
  return d3
    .scaleQuantile(
      filtered.map((d) => d.physicians),
      d3.range(3)
    )
    .quantiles();
}

function _37(d3, filtered) {
  return d3
    .scaleQuantile(
      filtered.map((d) => d.uninsured),
      d3.range(3)
    )
    .quantiles();
}

function _wrangleData(d3) {
  return (raw) => {
    return raw
      .map((d) => ({
        name: d.county,
        county_fips:
          ("" + d.county_fips).length < 5
            ? "0" + d.county_fips
            : "" + d.county_fips,
        region: d.region == "midest" ? "midwest" : d.region,
        state: d.state_abbr,
        stateFull: d.state_full,
        poverty: +d.sdoh_poverty_rate,
        // physiciansCat : +d.sdoh_poverty_rate < .13 ? "1-low" : +d.sdoh_poverty_rate < .18 ? "2-med" : "3-high",
        povertyBool: +d.sdoh_poverty_rate >= 0.18 ? true : false,
        transportation: +d.sdoh_transportation_access_score_algorex,
        transportBool:
          +d.sdoh_transportation_access_score_algorex < 5 ? false : true,
        // uninsuredCat: +d.sdoh_transportation_access_score_algorex < 5 ? "1-low" : +d.sdoh_transportation_access_score_algorex == 5 ? "2-med" : "3-high",
        poverty50Pct: +d.sdoh_below_50pct_federal_poverty_level,
        cvi: Math.round(+d.combined_cvi_prevalence_ped_100k),
        cviCount: +d.combined_cvi_pt_count,
        cviCat:
          +d.combined_cvi_prevalence_ped_100k < 95
            ? "1-low"
            : +d.combined_cvi_prevalence_ped_100k < 165
            ? "2-med"
            : "3-high",
        physicians: +d.sdoh_primary_care_physicians_per_100k_population,
        physiciansCat:
          +d.sdoh_primary_care_physicians_per_100k_population < 37
            ? "3-high"
            : +d.sdoh_primary_care_physicians_per_100k_population < 74
            ? "2-med"
            : "1-low",
        uninsured: +d.sdoh_uninsured,
        uninsuredCat:
          +d.sdoh_uninsured < 0.08
            ? "1-low"
            : +d.sdoh_uninsured < 0.13
            ? "2-med"
            : "3-high",
        distToProvider: d3.format(".1f")(
          +d.combined_avg_min_distance_provider_or_inst
        ),
        distToProviderCat:
          +d.combined_avg_min_distance_provider_or_inst < 129.2
            ? "1-low"
            : +d.combined_avg_min_distance_provider_or_inst < 250.5
            ? "2-med"
            : "3-high",
        population: +d.age024_tot,

        //...d
      }))
      .filter((d) => d.name != "null" && d.region != "null");
  };
}

function define(runtime, observer) {
  const main = runtime.module();
  function toString() {
    return this.url;
  }
  const fileAttachments = new Map([
    [
      "counties-albers-10m.json",
      {
        url: "https://static.observableusercontent.com/files/6b1776f5a0a0e76e6428805c0074a8f262e3f34b1b50944da27903e014b409958dc29b03a1c9cc331949d6a2a404c19dfd0d9d36d9c32274e6ffbc07c11350ee",
        mimeType: "application/json",
        toString,
      },
    ],
  ]);
  main.builtin(
    "FileAttachment",
    runtime.fileAttachments((name) => fileAttachments.get(name))
  );
  main.variable(observer()).define(["md"], _1);
  const child1 = runtime.module(define1);
  main.import("Legend", child1);
  main.import("Swatches", child1);
  main
    .variable(observer("viewof csvfile"))
    .define("viewof csvfile", ["Inputs"], _csvfile);
  main
    .variable(observer("csvfile"))
    .define("csvfile", ["Generators", "viewof csvfile"], (G, _) => G.input(_));
  main
    .variable(observer("viewof cviCenters"))
    .define("viewof cviCenters", ["Inputs"], _cviCenters);
  main
    .variable(observer("cviCenters"))
    .define("cviCenters", ["Generators", "viewof cviCenters"], (G, _) =>
      G.input(_)
    );
  main
    .variable(observer("filterTitle"))
    .define("filterTitle", ["html"], _filterTitle);
  main
    .variable(observer("viewof cviFilterDistance"))
    .define(
      "viewof cviFilterDistance",
      ["Inputs", "d3", "html"],
      _cviFilterDistance
    );
  main
    .variable(observer("cviFilterDistance"))
    .define(
      "cviFilterDistance",
      ["Generators", "viewof cviFilterDistance"],
      (G, _) => G.input(_)
    );
  main
    .variable(observer("legendTitle"))
    .define("legendTitle", ["html"], _legendTitle);
  main.variable(observer("marker")).define("marker", _marker);
  main
    .variable(observer("distanceMarkerLegend"))
    .define("distanceMarkerLegend", ["html", "marker"], _distanceMarkerLegend);
  main
    .variable(observer("distanceLabel"))
    .define("distanceLabel", ["html"], _distanceLabel);
  main
    .variable(observer("distanceLegend"))
    .define("distanceLegend", ["Legend", "d3"], _distanceLegend);
  main
    .variable(observer("noDataLegendDistance"))
    .define(
      "noDataLegendDistance",
      ["html", "cviFilterDistance"],
      _noDataLegendDistance
    );
  main
    .variable(observer("tooltipStyles"))
    .define("tooltipStyles", ["html"], _tooltipStyles);
  main
    .variable(observer("svgContainerDistance"))
    .define("svgContainerDistance", ["html"], _svgContainerDistance);
  main
    .variable(observer("distanceChart"))
    .define(
      "distanceChart",
      [
        "d3",
        "topojson",
        "us",
        "color",
        "data",
        "path",
        "fullData",
        "format",
        "cviCenter",
      ],
      _distanceChart
    );
  main
    .variable(observer("numCounties"))
    .define("numCounties", ["html", "tableData"], _numCounties);
  main
    .variable(observer("cviCenter"))
    .define("cviCenter", ["cviCenters"], _cviCenter);
  main.variable(observer("data")).define("data", ["filtered"], _data);
  main
    .variable(observer("fullData"))
    .define("fullData", ["filtered"], _fullData);
  main.variable(observer("path")).define("path", ["d3"], _path);
  main
    .variable(observer("distanceColors"))
    .define("distanceColors", _distanceColors);
  main.variable(observer("colors")).define("colors", _colors);
  main
    .variable(observer("color"))
    .define("color", ["cviFilterDistance", "distanceColors"], _color);
  main.variable(observer("capitalize")).define("capitalize", _capitalize);
  main
    .variable(observer("labelsDistance"))
    .define("labelsDistance", _labelsDistance);
  main.variable(observer()).define(["data"], _27);
  main
    .variable(observer("format"))
    .define(
      "format",
      [
        "fullData",
        "cviFilterDistance",
        "distanceColors",
        "data",
        "labelsDistance",
      ],
      _format
    );
  main.variable(observer("states")).define("states", ["us"], _states);
  main.variable(observer("us")).define("us", ["FileAttachment"], _us);
  main.variable(observer()).define(["topojson", "us"], _31);
  main.variable(observer("raw")).define("raw", ["csvfile"], _raw);
  main
    .variable(observer("filtered"))
    .define("filtered", ["wrangleData", "raw"], _filtered);
  main
    .variable(observer("tableData"))
    .define("tableData", ["filtered", "cviFilterDistance"], _tableData);
  main.variable(observer()).define(["d3", "filtered"], _35);
  main.variable(observer()).define(["d3", "filtered"], _36);
  main.variable(observer()).define(["d3", "filtered"], _37);
  main
    .variable(observer("wrangleData"))
    .define("wrangleData", ["d3"], _wrangleData);
  return main;
}

new Runtime().module(define, (name) => {
  // if (name === "viewof csvfile") return new Inspector(document.querySelector("#observablehq-viewof-csvfile-c797d0e6"));
  // if (name === "viewof cviCenters")
  //   return new Inspector(
  //     document.querySelector("#observablehq-viewof-cviCenters-c797d0e6")
  //   );
  if (name === "filterTitle")
    return new Inspector(
      document.querySelector("#observablehq-filterTitle-c797d0e6")
    );
  if (name === "viewof cviFilterDistance")
    return new Inspector(
      document.querySelector("#observablehq-viewof-cviFilterDistance-c797d0e6")
    );
  if (name === "legendTitle")
    return new Inspector(
      document.querySelector("#observablehq-legendTitle-c797d0e6")
    );
  // if (name === "marker")
  //   return new Inspector(
  //     document.querySelector("#observablehq-marker-c797d0e6")
  //   );
  if (name === "distanceMarkerLegend")
    return new Inspector(
      document.querySelector("#observablehq-distanceMarkerLegend-c797d0e6")
    );
  if (name === "distanceLabel")
    return new Inspector(
      document.querySelector("#observablehq-distanceLabel-c797d0e6")
    );
  if (name === "distanceLegend")
    return new Inspector(
      document.querySelector("#observablehq-distanceLegend-c797d0e6")
    );
  if (name === "noDataLegendDistance")
    return new Inspector(
      document.querySelector("#observablehq-noDataLegendDistance-c797d0e6")
    );
  if (name === "tooltipStyles")
    return new Inspector(
      document.querySelector("#observablehq-tooltipStyles-c797d0e6")
    );
  if (name === "svgContainerDistance")
    return new Inspector(
      document.querySelector("#observablehq-svgContainerDistance-c797d0e6")
    );
  if (name === "distanceChart")
    return new Inspector(
      document.querySelector("#observablehq-distanceChart-c797d0e6")
    );
  if (name === "numCounties")
    return new Inspector(
      document.querySelector("#observablehq-numCounties-c797d0e6")
    );
  // if (name === "tableData") return new Inspector(document.querySelector("#observablehq-tableData-c797d0e6"));
  return [
    "raw",
    "filtered",
    "data",
    "fullData",
    "format",
    "cviCenter",
    "color",
  ].includes(name);
});