import 'widgets';
import * as d3 from 'd3';
import * as d3Sankey from 'd3-sankey';

HTMLWidgets.widget({

  name: 'sankey',

  type: 'output',

  factory: function(el, width, height) {

    var sankey;

    return {

      renderValue: function(x) {

        const data = x.data;

        // Constructs and configures a Sankey generator.
        const sankey = d3Sankey()
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

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
