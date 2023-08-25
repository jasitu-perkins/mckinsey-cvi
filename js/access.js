  import {
    Runtime,
    Inspector,
  } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
  // import define from "https://api.observablehq.com/d/757cb747d120befc@1597.js?v=3";

  import define1 from "https://api.observablehq.com/d/a33468b95d0b15b0@808.js?v=3&resolutions=757cb747d120befc@1597";

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
  const tableToggleAccess = document.getElementById(
    "toggle-table-trivariate-access"
  );
  tableToggleAccess.addEventListener("change", function () {
    toggleTable(this.checked, "#data-table-trivariate-wrapper-access");
  });

  function _1(md) {
    return md`
# Trivariate Choropleth v2 - Access
    `;
  }

  function _csvfile(Inputs) {
    return Inputs.file({ label: "CSV file", accept: ".csv", required: false });
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

  function _cviFilterAccess(Inputs, d3, html) {
    return Inputs.range(d3.extent([50, 500]), {
      value: 150,
      step: 50,
      label: html`<span class="sr-only">Show counties on access map with </span
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

  function _physiciansFilter(Inputs) {
    return Inputs.toggle({ value: true, label: "Access to physicians" });
  }

  function _physiciansLegend(Legend, d3, physiciansColors) {
    return Legend(d3.scaleOrdinal(["Good", "Med", "Poor"], physiciansColors), {
      tickSize: 0,
      width: 150,
    });
  }

  function _uninsuredFilter(Inputs) {
    return Inputs.toggle({ value: false, label: "% uninsured" });
  }

  function _uninsuredLegend(Legend, d3, uninsuredColors) {
    return Legend(d3.scaleOrdinal(["Low", "Med", "High"], uninsuredColors), {
      tickSize: 0,
      width: 150,
    });
  }

  function _noDataLegendAccess(html, cviFilterAccess) {
    return html`<div
      style="display: flex; flex-direction: row; gap: 50px; flex-wrap: wrap"
    >
      <div style="display: flex; flex-direction: column; align-items: center">
        <svg height="10" width="49" style="margin-bottom: -10px">
          <rect
            width="49"
            height="10"
            fill="url(#hatch-access)"
            stroke="#555"
          ></rect>
        </svg>
        <p>No data</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center">
        <svg height="10" width="49" style="margin-bottom: -10px">
          <rect width="49" height="10" fill="#efefef" stroke="#555"></rect>
        </svg>
        <p>Est. CVI prevalence < ${cviFilterAccess}</p>
      </div>
    </div>`;
  }

  function _tooltipStyles(html) {
    return html`
<style type="text/css">

#access-svg-container {
  position: relative
}

.tooltip-bivariate-map, 
.tooltip-bivariate-map-access {
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
  .tooltip-bivariate-map-access:before {
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
.tooltip-bivariate-map-access span {
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
`;
  }

  function _svgContainerAccess(html) {
    return html`<div id="access-svg-container"></div>`;
  }

  function _accessChart(
    d3,
    topojson,
    us,
    color,
    data,
    path,
    fullData,
    physiciansFilter,
    uninsuredFilter,
    format
  ) {
    // const svg = d3.create("svg")
    const viewBoxWidth = 975;
    const viewBoxHeight = 610;

    d3.selectAll("#access-map-svg").remove();
    const svg = d3
      .select("#access-svg-container")
      .append("svg")
      .attr("id", "access-map-svg")
      .attr("role", "img")
      .attr(
        "aria-label",
        "Map of US counties showing access to CVI resources that can be filtered by CVI prevalence per 100000 people. Layers for access to physicians (measured by physicians per 100000 people) or percentage of county uninsured can be activated, with each layer bucketing counties into good-poor physician access and high-low percent uninsured."
      )
      .attr("focusable", "false")
      .attr("viewBox", [0, 0, viewBoxWidth, viewBoxHeight]);

    // svg
    //   .append("title")
    //   .attr("id", "access-map-title")
    //   .text(
    //     "Map of US counties showing access to CVI resources that can be filtered by CVI prevalence per 100000 people"
    //   );
    // svg
    //   .append("desc")
    //   .attr("id", "access-map-description")
    //   .text(
    //     "Layers for access to physicians (measured by physicians per 100000 people) or percentage of county uninsured can be activated, with each layer bucketing counties into good-poor physician access and high-low percent uninsured"
    //   );

    const hatch_size = 4;
    const defs = svg.append("defs");
    const hatch_pattern_2 = defs
      .append("pattern")
      .attr("id", "hatch-access")
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
      .selectAll("path")
      .data(topojson.feature(us, us.objects.counties).features)
      .join("path")
      .attr("fill", (d) => color(data.get(d.id)))
      .attr("d", path)
      //.attr("stroke", "#ffffff80")
      .on("touchmove mousemove", function (event, d) {
        if (fullData.get(d.id) && (physiciansFilter || uninsuredFilter)) {
          const name = d.properties.name;
          const [x, y] = d3.pointer(event, this);

          // stroke around hovered county
          d3.select(this)
            .attr("stroke", "#000000")
            .attr("stroke-width", "2px")
            .raise();

          // show the tooltip if hovering over a county with data
          tooltipAccess
            .style("opacity", 1)
            .style("left", `${event.offsetX - tooltipWidth / 2 - 4}px`)
            .style("top", `${event.offsetY + 30}px`).html(`<strong>${
            d.properties.name
          } County, ${fullData.get(d.id).state}</strong> <br> 
                      Est. CVI prevalence: ${Math.round(
                        fullData.get(d.id).cvi
                      )} per 100k 
                      ${
                        physiciansFilter || uninsuredFilter
                          ? format(data.get(d.id), d.id, d)
                          : ""
                      }`);
        }
      })
      .on("touchend mouseleave", function () {
        tooltipAccess.style("opacity", 0).style("display", "null");
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

    // append tooltip to parent div
    const tooltipAccess = d3
      .select("#access-svg-container")
      .append("div")
      .style("width", `${tooltipWidth}px`)
      .style("pointer-events", "none")
      .style("display", null)
      .style("opacity", 0)
      .classed("tooltip-bivariate-map-access", true);

    // Add no metric to map
    if (!(physiciansFilter || uninsuredFilter)) {
      svg
        .append("text")
        .text("No metric selected")
        .attr("stroke", "black")
        .attr(
          "transform",
          `translate(${viewBoxWidth / 2}, ${viewBoxHeight / 2})`
        )
        .attr("font-size", "70px")
        .attr("text-anchor", "middle");
    }

    return svg.node();
  }

  function _numCounties(html, tableData) {
    return html`<div role="status" style="font-size: 14px; font-weight: 700">
      ${tableData.length} counties
    </div>`;
  }

  function _data(filtered) {
    return Object.assign(
      new Map(
        filtered.map(({ county_fips, physiciansCat, uninsuredCat, cvi }) => [
          county_fips,
          [physiciansCat, uninsuredCat, cvi],
        ])
      ),
      { title: ["Access to physicians", "Uninsured rate"] }
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

  function _physiciansColors(colors) {
    return [colors[0], colors[3], colors[6]];
  }

  function _uninsuredColors(colors) {
    return colors.slice(0, 3);
  }

  function _colors() {
    return [
      "#d3d3d3",
      "#7ac2c2",
      "#00abab",
      "#cd85be",
      "#767aaf",
      "#006c9a",
      "#c3079d",
      "#700791",
      "#000680",
    ];
  }

  function _capitalize() {
    return function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };
  }

  function _color(
    cviFilterAccess,
    physiciansFilter,
    uninsuredFilter,
    colors,
    physiciansColors,
    uninsuredColors
  ) {
    return (value) => {
      if (!value) return "url(#hatch-access)";
      let [a, b, c] = value;
      if (c < cviFilterAccess) return "#efefef";
      if (physiciansFilter) {
        if (uninsuredFilter) {
          return colors[b + 3 * a];
        } else {
          return physiciansColors[a];
        }
      } else if (uninsuredFilter) return uninsuredColors[b];
      return "#efefef";
    };
  }

  function _labelsPhysicians() {
    return ["good", "med", "poor"];
  }

  function _labelsUninsured() {
    return ["low", "med", "high"];
  }

  function _26(data) {
    return data.title;
  }

  function _format(
    fullData,
    cviFilterAccess,
    physiciansFilter,
    uninsuredFilter,
    color,
    data,
    capitalize,
    labelsPhysicians,
    labelsUninsured,
    colors
  ) {
    return (value, id, d) => {
      if (!value) return "N/A";
      let [a, b, c] = value;
      const uninsuredVal = Math.round(fullData.get(id).uninsured * 100);
      if (c < cviFilterAccess) return "";
      if (physiciansFilter) {
        if (uninsuredFilter) {
          return `<br><hr><span style="background-color: ${color(
            data.get(d.id)
          )}"></span> <strong>${capitalize(
            labelsPhysicians[a]
          )} access to physicians, ${labelsUninsured[b]} uninsured</strong> <br>
            <span style="background-color: ${colors[3 * a]}"></span> ${
            data.title[0]
          }: ${fullData.get(id).physicians} per 100k <br>
            <span style="background-color: ${colors[b]}"></span> ${
            data.title[1]
          }: ${uninsuredVal}%`;
        } else {
          return `<br><hr><span style="background-color: ${
            colors[3 * a]
          }"></span> ${data.title[0]}: ${
            fullData.get(id).physicians
          } per 100k (${labelsPhysicians[a]})`;
        }
      } else if (uninsuredFilter) {
        return `<br><hr><span style="background-color: ${colors[b]}"></span> ${data.title[1]}: ${uninsuredVal}% (${labelsUninsured[b]})`;
      }
      return;
    };
  }

  function _states(us) {
    return new Map(
      us.objects.states.geometries.map((d) => [d.id, d.properties])
    );
  }

  function _us(FileAttachment) {
    return FileAttachment("counties-albers-10m.json").json();
  }

  function _raw(csvfile) {
    return (
      // csvfile.csv({typed: true})
      d3.csv("https://raw.githubusercontent.com/jasitu-perkins/mckinsey-cvi/main/data/2023-06-01-county-level-CVI-output-for-DVL_v7.2.csv")
    );
  }

  function _filtered(wrangleData, raw) {
    return wrangleData(raw).map((d) => ({
      ...d,
      physiciansCat: +d.physiciansCat.substring(0, 1) - 1,
      uninsuredCat: +d.uninsuredCat.substring(0, 1) - 1,
    }));
  }

  let table;
  let filteredDataAccess;

  $(document).ready(function () {
    // Initialize DataTable
    table = $("#data-table-trivariate-access").DataTable({
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
          data: "physicians",
          title: "Physicians per 100k",
          className: "align-right",
        },
        {
          data: "uninsured",
          title: "Uninsured rate",
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
    $('#toggle-table-trivariate-access').change(function () {
        if(this.checked) {
            $('#data-table-trivariate-wrapper-access').css('height', 'auto');
            table.columns.adjust().responsive.recalc();
        } else {
            $('#data-table-trivariate-wrapper-access').css('height', '0');
        }
    });   
});

  function _tableData(filtered, cviFilterAccess) {
  filteredDataAccess = filtered.filter((d) => d.cvi > cviFilterAccess);

    // Populate DataTable with preloaded data
    table.clear();
    table.rows.add(Array.from(filteredDataAccess.values()));
    table.draw();
  
    return filtered.filter((d) => d.cvi > cviFilterAccess);
  }

  function _33(d3, filtered) {
    return d3
      .scaleQuantile(
        filtered.map((d) => d.distToProviderUndiagnosed),
        d3.range(3)
      )
      .quantiles();
  }

  function _34(d3, filtered) {
    return d3
      .scaleQuantile(
        filtered.map((d) => d.physicians),
        d3.range(3)
      )
      .quantiles();
  }

  function _35(d3, filtered) {
    return d3
      .scaleQuantile(
        filtered.map((d) => d.uninsured),
        d3.range(3)
      )
      .quantiles();
  }

  function _wrangleData() {
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
          povertyCat:
            +d.sdoh_poverty_rate < 0.13
              ? "1-low"
              : +d.sdoh_poverty_rate < 0.18
              ? "2-med"
              : "3-high",
          transportation: +d.sdoh_transportation_access_score_algorex,
          transportCat:
            +d.sdoh_transportation_access_score_algorex < 5
              ? "1-low"
              : +d.sdoh_transportation_access_score_algorex == 5
              ? "2-med"
              : "3-high",
          cvi: Math.round(+d.combined_cvi_prevalence_ped_100k * 100) / 100,
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
      .define("csvfile", ["Generators", "viewof csvfile"], (G, _) =>
        G.input(_)
      );
    main
      .variable(observer("filterTitle"))
      .define("filterTitle", ["html"], _filterTitle);
    main
      .variable(observer("viewof cviFilterAccess"))
      .define(
        "viewof cviFilterAccess",
        ["Inputs", "d3", "html"],
        _cviFilterAccess
      );
    main
      .variable(observer("cviFilterAccess"))
      .define(
        "cviFilterAccess",
        ["Generators", "viewof cviFilterAccess"],
        (G, _) => G.input(_)
      );
    main
      .variable(observer("legendTitle"))
      .define("legendTitle", ["html"], _legendTitle);
    main
      .variable(observer("viewof physiciansFilter"))
      .define("viewof physiciansFilter", ["Inputs"], _physiciansFilter);
    main
      .variable(observer("physiciansFilter"))
      .define(
        "physiciansFilter",
        ["Generators", "viewof physiciansFilter"],
        (G, _) => G.input(_)
      );
    main
      .variable(observer("physiciansLegend"))
      .define(
        "physiciansLegend",
        ["Legend", "d3", "physiciansColors"],
        _physiciansLegend
      );
    main
      .variable(observer("viewof uninsuredFilter"))
      .define("viewof uninsuredFilter", ["Inputs"], _uninsuredFilter);
    main
      .variable(observer("uninsuredFilter"))
      .define(
        "uninsuredFilter",
        ["Generators", "viewof uninsuredFilter"],
        (G, _) => G.input(_)
      );
    main
      .variable(observer("uninsuredLegend"))
      .define(
        "uninsuredLegend",
        ["Legend", "d3", "uninsuredColors"],
        _uninsuredLegend
      );
    main
      .variable(observer("noDataLegendAccess"))
      .define(
        "noDataLegendAccess",
        ["html", "cviFilterAccess"],
        _noDataLegendAccess
      );
    main
      .variable(observer("tooltipStyles"))
      .define("tooltipStyles", ["html"], _tooltipStyles);
    main
      .variable(observer("svgContainerAccess"))
      .define("svgContainerAccess", ["html"], _svgContainerAccess);
    main
      .variable(observer("accessChart"))
      .define(
        "accessChart",
        [
          "d3",
          "topojson",
          "us",
          "color",
          "data",
          "path",
          "fullData",
          "physiciansFilter",
          "uninsuredFilter",
          "format",
        ],
        _accessChart
      );
    main
      .variable(observer("numCounties"))
      .define("numCounties", ["html", "tableData"], _numCounties);
    main.variable(observer("data")).define("data", ["filtered"], _data);
    main
      .variable(observer("fullData"))
      .define("fullData", ["filtered"], _fullData);
    main.variable(observer("path")).define("path", ["d3"], _path);
    main
      .variable(observer("physiciansColors"))
      .define("physiciansColors", ["colors"], _physiciansColors);
    main
      .variable(observer("uninsuredColors"))
      .define("uninsuredColors", ["colors"], _uninsuredColors);
    main.variable(observer("colors")).define("colors", _colors);
    main.variable(observer("capitalize")).define("capitalize", _capitalize);
    main
      .variable(observer("color"))
      .define(
        "color",
        [
          "cviFilterAccess",
          "physiciansFilter",
          "uninsuredFilter",
          "colors",
          "physiciansColors",
          "uninsuredColors",
        ],
        _color
      );
    main
      .variable(observer("labelsPhysicians"))
      .define("labelsPhysicians", _labelsPhysicians);
    main
      .variable(observer("labelsUninsured"))
      .define("labelsUninsured", _labelsUninsured);
    main.variable(observer()).define(["data"], _26);
    main
      .variable(observer("format"))
      .define(
        "format",
        [
          "fullData",
          "cviFilterAccess",
          "physiciansFilter",
          "uninsuredFilter",
          "color",
          "data",
          "capitalize",
          "labelsPhysicians",
          "labelsUninsured",
          "colors",
        ],
        _format
      );
    main.variable(observer("states")).define("states", ["us"], _states);
    main.variable(observer("us")).define("us", ["FileAttachment"], _us);
    main.variable(observer("raw")).define("raw", ["csvfile"], _raw);
    main
      .variable(observer("filtered"))
      .define("filtered", ["wrangleData", "raw"], _filtered);
    main
      .variable(observer("tableData"))
      .define("tableData", ["filtered", "cviFilterAccess"], _tableData);
    main.variable(observer()).define(["d3", "filtered"], _33);
    main.variable(observer()).define(["d3", "filtered"], _34);
    main.variable(observer()).define(["d3", "filtered"], _35);
    main.variable(observer("wrangleData")).define("wrangleData", _wrangleData);
    return main;
  }

  new Runtime().module(define, (name) => {
    // if (name === "viewof csvfile") return new Inspector(document.querySelector("#observablehq-viewof-csvfile-66c14cf9"));
    if (name === "filterTitle")
      return new Inspector(
        document.querySelector("#observablehq-filterTitle-66c14cf9")
      );
    if (name === "viewof cviFilterAccess")
      return new Inspector(
        document.querySelector("#observablehq-viewof-cviFilterAccess-66c14cf9")
      );
    if (name === "legendTitle")
      return new Inspector(
        document.querySelector("#observablehq-legendTitle-66c14cf9")
      );
    if (name === "viewof physiciansFilter")
      return new Inspector(
        document.querySelector("#observablehq-viewof-physiciansFilter-66c14cf9")
      );
    if (name === "physiciansLegend")
      return new Inspector(
        document.querySelector("#observablehq-physiciansLegend-66c14cf9")
      );
    if (name === "viewof uninsuredFilter")
      return new Inspector(
        document.querySelector("#observablehq-viewof-uninsuredFilter-66c14cf9")
      );
    if (name === "uninsuredLegend")
      return new Inspector(
        document.querySelector("#observablehq-uninsuredLegend-66c14cf9")
      );
    if (name === "noDataLegendAccess")
      return new Inspector(
        document.querySelector("#observablehq-noDataLegendAccess-66c14cf9")
      );
    if (name === "tooltipStyles")
      return new Inspector(
        document.querySelector("#observablehq-tooltipStyles-66c14cf9")
      );
    if (name === "svgContainerAccess")
      return new Inspector(
        document.querySelector("#observablehq-svgContainerAccess-66c14cf9")
      );
    if (name === "accessChart")
      return new Inspector(
        document.querySelector("#observablehq-accessChart-66c14cf9")
      );
    if (name === "numCounties")
      return new Inspector(
        document.querySelector("#observablehq-numCounties-66c14cf9")
      );
    // if (name === "tableData") return new Inspector(document.querySelector("#observablehq-tableData-66c14cf9"));
    return ["raw", "filtered", "data", "fullData", "format", "color"].includes(
      name
    );
  });