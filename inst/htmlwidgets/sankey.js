(()=>{"use strict";HTMLWidgets,HTMLWidgets.widget({name:"sankey",type:"output",factory:function(n,e,t){return{renderValue:function(n){const d=n.data,s=sankey().nodeId((n=>n.name)).nodeAlign(d3[nodeAlign]).nodeWidth(15).nodePadding(10).extent([[1,5],[e-1,t-5]]),{nodes:i,links:o}=s({nodes:d.nodes.map((n=>Object.assign({},n))),links:d.links.map((n=>Object.assign({},n)))})},resize:function(n,e){}}}})})();