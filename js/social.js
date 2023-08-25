  import {
    Runtime,
    Inspector,
  } from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
  // import define from "https://api.observablehq.com/d/d3460c701bcf978c@1696.js?v=3";

  import define1 from "https://api.observablehq.com/d/a33468b95d0b15b0@808.js?v=3&resolutions=d3460c701bcf978c@1696";

  function toggleTable(enable, tableSelector) {
    if (enable) {
      // show container that contains graphic that will animate as we scroll
      document.querySelector(tableSelector).style.display = "block";
    } else {
      // hide container that contains graphic that animates as we scroll
      document.querySelector(tableSelector).style.display = "none";
    }
  }
  // Handle toggle button change
  const tableToggleSdoh = document.getElementById("toggle-table-trivariate");
  tableToggleSdoh.addEventListener("change", function () {
    toggleTable(this.checked, "#data-table-trivariate-wrapper");
  });

  function _1(md) {
    return md`
# Trivariate Choropleth v2 - SDOH Variables
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

  function _cviFilter(Inputs, d3, html) {
    return Inputs.range(d3.extent([50, 500]), {
      value: 150,
      step: 50,
      label: html`<span class="sr-only"
          >Show counties on social risk map with </span
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

  function _povertyFilter(Inputs) {
    return Inputs.toggle({ value: true, label: "Poverty rate" });
  }

  function _povertyLegend(Legend, d3, povertyColors) {
    return Legend(d3.scaleOrdinal(["Low", "Med", "High"], povertyColors), {
      tickSize: 0,
      width: 150,
    });
  }

  function _transportFilter(Inputs) {
    return Inputs.toggle({ label: "Access to transportation" });
  }

  function _transportLegend(Legend, d3, transportColors) {
    return Legend(d3.scaleOrdinal(["Good", "Med", "Poor"], transportColors), {
      tickSize: 0,
      width: 150,
    });
  }

  function _noDataLegend(html, cviFilter) {
    return html`<div
      style="display: flex; flex-direction: row; gap: 50px; flex-wrap: wrap"
    >
      <div style="display: flex; flex-direction: column; align-items: center">
        <svg height="10" width="49" style="margin-bottom: -10px">
          <rect width="49" height="10" fill="url(#hatch)" stroke="#555"></rect>
        </svg>
        <p>No data</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center">
        <svg height="10" width="49" style="margin-bottom: -10px">
          <rect width="49" height="10" fill="#efefef" stroke="#555"></rect>
        </svg>
        <p>Est. CVI prevalence < ${cviFilter}</p>
      </div>
    </div>`;
  }

  function _tooltipStyles(html) {
    return html`
<style type="text/css">

#sdoh-svg-container {
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

  function _svgContainer(html) {
    return html`<div id="sdoh-svg-container"></div>`;
  }

  function _chart(
    d3,
    topojson,
    us,
    color,
    data,
    path,
    fullData,
    povertyFilter,
    transportFilter,
    format
  ) {
    // const svg = d3.create("svg")
    const viewBoxWidth = 975;
    const viewBoxHeight = 610;

    d3.selectAll("#sdoh-map-svg").remove();
    d3.selectAll(".tooltip-bivariate-map").remove();
    const svg = d3
      .select("#sdoh-svg-container")
      .append("svg")
      .attr("id", "sdoh-map-svg")
      .attr("role", "img")
      .attr(
        "aria-label",
        "Map of US counties showing social risk factors that can be filtered by CVI prevalence per 100000 people. Layers for poverty rate and access to transportation can be activated, with each layer bucketing counties into high-low poverty and good-poor transportation access."
      )
      .attr("focusable", "false")
      .attr("viewBox", [0, 0, viewBoxWidth, viewBoxHeight]);

    // svg
    //   .append("title")
    //   .attr("id", "social-risk-map-title")
    //   .text(
    //     "Map of US counties showing social risk factors that can be filtered by CVI prevalence per 100000 people"
    //   );
    // svg
    //   .append("desc")
    //   .attr("id", "social-risk-map-description")
    //   .text(
    //     "Layers for poverty rate and access to transportation can be activated, with each layer bucketing counties into high-low poverty and good-poor transportation access"
    //   );

    const hatch_size = 4;
    const defs = svg.append("defs");
    const hatch_pattern_2 = defs
      .append("pattern")
      .attr("id", "hatch")
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
        if (fullData.get(d.id) && (povertyFilter || transportFilter)) {
          const name = d.properties.name;
          const [x, y] = d3.pointer(event, this);

          // stroke around hovered county
          d3.select(this)
            .attr("stroke", "#000000")
            .attr("stroke-width", "2px")
            .raise();

          // show the tooltip if hovering over a county with data
          tooltip
            .style("opacity", 1)
            .style("left", `${event.offsetX - tooltipWidth / 2 - 4}px`)
            .style("top", `${event.offsetY + 30}px`).html(`<strong>${
            d.properties.name
          } County, ${fullData.get(d.id).state}</strong> <br> 
                      Est. CVI prevalence: ${Math.round(
                        fullData.get(d.id).cvi
                      )} per 100k 
                      ${
                        povertyFilter || transportFilter
                          ? format(data.get(d.id), d.id, d)
                          : ""
                      }`);
        }
      })
      .on("touchend mouseleave", function () {
        tooltip.style("opacity", 0).style("display", "null");
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
    const tooltip = d3
      .select("#sdoh-svg-container")
      .append("div")
      .style("width", `${tooltipWidth}px`)
      .style("pointer-events", "none")
      .style("display", null)
      .style("opacity", 0)
      .classed("tooltip-bivariate-map", true);

    // Add no metric to map
    if (!(povertyFilter || transportFilter)) {
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

  function _search(Inputs, filtered) {
    return Inputs.search(filtered);
  }

  function _table(Inputs, search) {
    return Inputs.table(search, {
      columns: [
        "name",
        "state",
        "cvi",
        "poverty",
        "freeLunch",
        "transportation",
      ],
      header: {
        name: "County",
        state: "State",
        cvi: "Estimated CVI prevalence",
        poverty: "Poverty rate",
        freeLunch: "Children on free/reduced lunch",
        transportation: "Transportation access",
      },
    });
  }

  function _data(filtered) {
    return Object.assign(
      new Map(
        filtered.map(({ county_fips, povertyCat, transportCat, cvi }) => [
          county_fips,
          [povertyCat, transportCat, cvi],
        ])
      ),
      {
        title: [
          "Poverty rate",
          "Access to transportation",
          "Free or reduced lunch",
        ],
      }
    );
  }

  function _19(data) {
    return data.get("46113");
  }

  function _fullData(filtered) {
    return Object.assign(new Map(filtered.map((d) => [d.county_fips, d])), {
      title: ["Poverty", "Transportation"],
    });
  }

  function _path(d3) {
    return d3.geoPath();
  }

  function _povertyColors(colors) {
    return [colors[0], colors[3], colors[6]];
  }

  function _transportColors(colors) {
    return colors.slice(0, 3);
  }

  function _colors() {
    return [
      "#d3d3d3",
      "#7bbfdc",
      "#009DE0",
      "#dc9c7c",
      "#808d81",
      "#007888",
      "#e84c00",
      "#874500",
      "#003b00",
    ];
  }

  function _color(
    cviFilter,
    povertyFilter,
    transportFilter,
    colors,
    povertyColors,
    transportColors
  ) {
    return (value) => {
      if (!value) return "url(#hatch)";
      let [a, b, c] = value;
      if (c < cviFilter) return "#efefef";
      if (povertyFilter) {
        if (transportFilter) {
          return colors[b + 3 * a];
        } else return povertyColors[a];
      } else if (transportFilter) return transportColors[b];
      return "#efefef";
    };
  }

  function _capitalize() {
    return function capitalize(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    };
  }

  function _labels() {
    return ["low", "med", "high"];
  }

  function _labelsTransport() {
    return ["good", "med", "poor"];
  }

  function _format(
    fullData,
    cviFilter,
    povertyFilter,
    transportFilter,
    color,
    data,
    capitalize,
    labels,
    labelsTransport,
    colors
  ) {
    return (value, id, d) => {
      if (!value) return "N/A";
      let [a, b, c] = value;
      const povertyVal = Math.round(fullData.get(id).poverty * 100);
      if (c < cviFilter) return "";
      if (povertyFilter) {
        if (transportFilter) {
          return `<br><hr><span style="background-color: ${color(
            data.get(d.id)
          )}"></span> <strong>${capitalize(labels[a])} poverty, ${
            labelsTransport[b]
          } access to transportation</strong> <br>
            <span style="background-color: ${colors[3 * a]}"></span> ${
            data.title[0]
          }: ${povertyVal}% <br>
            <span style="background-color: ${colors[b]}"></span> ${
            data.title[1]
          }: ${fullData.get(id).transportation}`;
        } else {
          return `<br><hr><span style="background-color: ${
            colors[3 * a]
          }"></span> ${data.title[0]}: ${povertyVal}% (${labels[a]})`;
        }
      } else if (transportFilter) {
        return `<br><hr><span style="background-color: ${colors[b]}"></span> ${
          data.title[1]
        }: ${fullData.get(id).transportation} (${labelsTransport[b]})`;
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
      povertyCat: +d.povertyCat.substring(0, 1) - 1,
      transportCat: +d.transportCat.substring(0, 1) - 1,
      // freeLunchCat: +d.freeLunchCat.substring(0,1)-1,
    }));
  }

  let table;
  let filteredData;

  $(document).ready(function () {
    // Initialize DataTable
    table = $("#data-table-trivariate").DataTable({
      destroy: true,
      columns: [
        { data: "name", title: "County" },
        { data: "stateFull", title: "State" },
        {
          data: "cvi",
          title: "Estimated CVI prevalence (per 100k)",
          className: "align-right",
        },
        { data: "poverty", title: "Poverty rate", className: "align-right" },
        {
          data: "transportation",
          title: "Transportation access",
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
      }
    });
    // Recalculates responsive datatable once toggle button triggered
    $('#toggle-table-trivariate').change(function () {
        if(this.checked) {
            $('#data-table-trivariate-wrapper').css('height', 'auto');
            table.columns.adjust().responsive.recalc();
        } else {
            $('#data-table-trivariate-wrapper').css('height', '0');
        }
    });   
});

  function _tableData(filtered, cviFilter) {
      filteredData = filtered.filter((d) => d.cvi > cviFilter);

  // Populate DataTable with preloaded data
  table.clear();
  table.rows.add(Array.from(filteredData.values()));
  table.draw();

    return filtered.filter((d) => d.cvi > cviFilter);
  }



  function _35(d3, filtered) {
    return d3
      .scaleQuantile(
        filtered.map((d) => d.distToProviderUndiagnosed),
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
              ? "1-low"
              : +d.sdoh_primary_care_physicians_per_100k_population < 74
              ? "2-med"
              : "3-high",
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
      [
        "image.png",
        {
          url: "https://static.observableusercontent.com/files/7e9675f3a7c910254422027d1bfa3669087c3590dd02eda703043b0e2fa73edea828c98ddee2509937344edaedc88e7cbc82040ab8086e4ab007dc3b7a74b2a9",
          mimeType: "image/png",
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
      .variable(observer("viewof cviFilter"))
      .define("viewof cviFilter", ["Inputs", "d3", "html"], _cviFilter);
    main
      .variable(observer("cviFilter"))
      .define("cviFilter", ["Generators", "viewof cviFilter"], (G, _) =>
        G.input(_)
      );
    main
      .variable(observer("legendTitle"))
      .define("legendTitle", ["html"], _legendTitle);
    main
      .variable(observer("viewof povertyFilter"))
      .define("viewof povertyFilter", ["Inputs"], _povertyFilter);
    main
      .variable(observer("povertyFilter"))
      .define("povertyFilter", ["Generators", "viewof povertyFilter"], (G, _) =>
        G.input(_)
      );
    main
      .variable(observer("povertyLegend"))
      .define(
        "povertyLegend",
        ["Legend", "d3", "povertyColors"],
        _povertyLegend
      );
    main
      .variable(observer("viewof transportFilter"))
      .define("viewof transportFilter", ["Inputs"], _transportFilter);
    main
      .variable(observer("transportFilter"))
      .define(
        "transportFilter",
        ["Generators", "viewof transportFilter"],
        (G, _) => G.input(_)
      );
    main
      .variable(observer("transportLegend"))
      .define(
        "transportLegend",
        ["Legend", "d3", "transportColors"],
        _transportLegend
      );
    main
      .variable(observer("noDataLegend"))
      .define("noDataLegend", ["html", "cviFilter"], _noDataLegend);
    main
      .variable(observer("tooltipStyles"))
      .define("tooltipStyles", ["html"], _tooltipStyles);
    main
      .variable(observer("svgContainer"))
      .define("svgContainer", ["html"], _svgContainer);
    main
      .variable(observer("chart"))
      .define(
        "chart",
        [
          "d3",
          "topojson",
          "us",
          "color",
          "data",
          "path",
          "fullData",
          "povertyFilter",
          "transportFilter",
          "format",
        ],
        _chart
      );
    main
      .variable(observer("numCounties"))
      .define("numCounties", ["html", "tableData"], _numCounties);
    main
      .variable(observer("viewof search"))
      .define("viewof search", ["Inputs", "filtered"], _search);
    main
      .variable(observer("search"))
      .define("search", ["Generators", "viewof search"], (G, _) => G.input(_));
    main
      .variable(observer("table"))
      .define("table", ["Inputs", "search"], _table);
    main.variable(observer("data")).define("data", ["filtered"], _data);
    main.variable(observer()).define(["data"], _19);
    main
      .variable(observer("fullData"))
      .define("fullData", ["filtered"], _fullData);
    main.variable(observer("path")).define("path", ["d3"], _path);
    main
      .variable(observer("povertyColors"))
      .define("povertyColors", ["colors"], _povertyColors);
    main
      .variable(observer("transportColors"))
      .define("transportColors", ["colors"], _transportColors);
    main.variable(observer("colors")).define("colors", _colors);
    main
      .variable(observer("color"))
      .define(
        "color",
        [
          "cviFilter",
          "povertyFilter",
          "transportFilter",
          "colors",
          "povertyColors",
          "transportColors",
        ],
        _color
      );
    main.variable(observer("capitalize")).define("capitalize", _capitalize);
    main.variable(observer("labels")).define("labels", _labels);
    main
      .variable(observer("labelsTransport"))
      .define("labelsTransport", _labelsTransport);
    main
      .variable(observer("format"))
      .define(
        "format",
        [
          "fullData",
          "cviFilter",
          "povertyFilter",
          "transportFilter",
          "color",
          "data",
          "capitalize",
          "labels",
          "labelsTransport",
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
      .define("tableData", ["filtered", "cviFilter"], _tableData);
    main.variable(observer()).define(["d3", "filtered"], _35);
    main.variable(observer()).define(["d3", "filtered"], _36);
    main.variable(observer()).define(["d3", "filtered"], _37);
    main.variable(observer("wrangleData")).define("wrangleData", _wrangleData);
    return main;
  }

  new Runtime().module(define, (name) => {
    // if (name === "viewof csvfile") return new Inspector(document.querySelector("#observablehq-viewof-csvfile-2efbcca2"));
    if (name === "filterTitle")
      return new Inspector(
        document.querySelector("#observablehq-filterTitle-2efbcca2")
      );
    if (name === "viewof cviFilter")
      return new Inspector(
        document.querySelector("#observablehq-viewof-cviFilter-2efbcca2")
      );
    if (name === "legendTitle")
      return new Inspector(
        document.querySelector("#observablehq-legendTitle-2efbcca2")
      );
    if (name === "viewof povertyFilter")
      return new Inspector(
        document.querySelector("#observablehq-viewof-povertyFilter-2efbcca2")
      );
    if (name === "povertyLegend")
      return new Inspector(
        document.querySelector("#observablehq-povertyLegend-2efbcca2")
      );
    if (name === "viewof transportFilter")
      return new Inspector(
        document.querySelector("#observablehq-viewof-transportFilter-2efbcca2")
      );
    if (name === "transportLegend")
      return new Inspector(
        document.querySelector("#observablehq-transportLegend-2efbcca2")
      );
    if (name === "noDataLegend")
      return new Inspector(
        document.querySelector("#observablehq-noDataLegend-2efbcca2")
      );
    if (name === "tooltipStyles")
      return new Inspector(
        document.querySelector("#observablehq-tooltipStyles-2efbcca2")
      );
    if (name === "svgContainer")
      return new Inspector(
        document.querySelector("#observablehq-svgContainer-2efbcca2")
      );
    if (name === "chart")
      return new Inspector(
        document.querySelector("#observablehq-chart-2efbcca2")
      );
    if (name === "numCounties")
      return new Inspector(
        document.querySelector("#observablehq-numCounties-2efbcca2")
      );
    // if (name === "tableData") return new Inspector(document.querySelector("#observablehq-tableData-2efbcca2"));
    return [
      "raw",
      "filtered",
      "viewof search",
      "data",
      "fullData",
      "table",
      "format",
      "color",
    ].includes(name);
  });