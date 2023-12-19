import 'widgets';
import * as d3Base from 'd3';
import * as d3Sankey from "d3-sankey";
const d3 = Object.assign(d3Base, d3Sankey);

HTMLWidgets.widget({

  name: 'sankey',

  type: 'output',

  factory: function(el, width, height) {

    var sankey;

    return {

      renderValue: function(x) {

        const data = {
          links: HTMLWidgets.dataframeToD3(x.data.links),
          nodes: HTMLWidgets.dataframeToD3(x.data.nodes)
        };

        const opts = x.opts;

        // https://observablehq.com/@d3/sankey/2?collection=@d3/d3-sankey

        const nodeAlign = opts.nodeAlign ?? "sankeyJustify";
        const linkColor = opts.linkColor ?? "source-target";

        const format = d3.format(",.0f");

        // Create a SVG container.
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // Constructs and configures a Sankey generator.
        const sankey = d3.sankey()
            .nodeId(d => d.name)
            .nodeAlign(d3[nodeAlign]) // d3.sankeyLeft, etc.
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 5], [width - 1, height - 5]]);

        // Applies it to the data. We make a copy of the nodes and links objects
        // so as to avoid mutating the original.
        const {nodes, links} = sankey({
          nodes: data.nodes.map(d => Object.assign({}, d)),
          links: data.links.map(d => Object.assign({}, d))
        });

        // Defines a color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        // Creates the rects that represent the nodes.
        const rect = svg.append("g")
            .attr("stroke", "#000")
          .selectAll()
          .data(nodes)
          .join("rect")
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .attr("height", d => d.y1 - d.y0)
            .attr("width", d => d.x1 - d.x0)
            .attr("fill", d => color(d.category));

        // Adds a title on the nodes.
        rect.append("title")
            .text(d => `${d.name}\n${format(d.value)} TWh`);

        // Creates the paths that represent the links.
        const link = svg.append("g")
            .attr("fill", "none")
            .attr("stroke-opacity", 0.5)
          .selectAll()
          .data(links)
          .join("g")
            .style("mix-blend-mode", "multiply");

        // Creates a gradient, if necessary, for the source-target color option.
        if (linkColor === "source-target") {
          const gradient = link.append("linearGradient")
              //.attr("id", d => (d.uid = DOM.uid("link")).id)
              .attr("id", (d, i) => (d.uid = `link-${i}`))
              .attr("gradientUnits", "userSpaceOnUse")
              .attr("x1", d => d.source.x1)
              .attr("x2", d => d.target.x0);
          gradient.append("stop")
              .attr("offset", "0%")
              .attr("stop-color", d => color(d.source.category));
          gradient.append("stop")
              .attr("offset", "100%")
              .attr("stop-color", d => color(d.target.category));
        }

        link.append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
                : linkColor === "source" ? (d) => color(d.source.category)
                : linkColor === "target" ? (d) => color(d.target.category)
                : linkColor)
            .attr("stroke-width", d => Math.max(1, d.width));

        link.append("title")
            .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)} TWh`);

        // Adds labels on the nodes.
        svg.append("g")
          .selectAll()
          .data(nodes)
          .join("text")
            .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", d => (d.y1 + d.y0) / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
            .text(d => d.name);

        document.body.appendChild(svg.node());

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
