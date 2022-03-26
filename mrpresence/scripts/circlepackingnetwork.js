(function () {
  const margin = 10;
  const width = 1640;
  const height = 500;
  const svgBackgroundColor = "#EBECF0";
  const svgBorderColor = "1px solid #808080";
  const circleDiameter = width;

  
  const svg = d3.select("#circle-packing-network")
    .append("svg:svg")
    .style("width", width)
    .style("height", height)
    .attr("class", "cpn-svg")
    .style("background-color", svgBackgroundColor)
    .style("border", svgBorderColor);

  const color = d3.interpolateRainbow;

  var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  d3.json("data/network.json").then(function(data, error){ 
  
    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });
  
    var node = svg.append("g")
        .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
  
    var circles = node.append("circle")
      .attr("r", 20)
      .attr("fill", function(d) { return color(d.group); });
  
    // Create a drag handler and append it to the node object instead
    var drag_handler = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  
    drag_handler(node);
    
    var lables = node.append("text")
        .text(function(d) {
          return d.id;
        })
        .attr('x', 6)
        .attr('y', 3);
  
    node.append("title")
        .text(function(d) { return d.id; });
  
    simulation
        .nodes(data.nodes)
        .on("tick", ticked);
  
    simulation.force("link")
        .links(data.links);
  
    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
  
      node
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          })
    }
  });
  
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // const g = svg.append("g")
  //   .attr("transform", `translate(${margin},${margin})`);

  

  // // var svg = d3.select("#circle-packing-network"),
  // //   margin = 20,
  // //   diameter = +svg.attr("width"),
  // //   g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

  // var color = d3.scaleLinear()
  //   .domain([-1, 5])
  //   .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
  //   .interpolate(d3.interpolateHcl);

  // var pack = d3.pack()
  //   .size([circleDiameter - margin, circleDiameter - margin])
  //   .padding(2);

  // d3.json("data/flare.json").then(function(data){ 
  //   data = d3.hierarchy(data)
  //     .sum(d => d.size)
  //     .sort((a, b) => b.value - a.value);

  //   var focus = data, 
  //       nodes = pack(data).descendants(),
  //       view;
    
  //   var circle = g.selectAll("circle")
  //     .data(nodes)
  //     .enter().append("circle")
  //       .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
  //       .style("fill", function(d) { return d.children ? color(d.depth) : null; })
  //       .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
    
  //   var text = g.selectAll("text")
  //     .data(nodes)
  //     .enter().append("text")
  //       .attr("class", "label")
  //       .style("fill-opacity", function(d) { return d.parent === data ? 1 : 0; })
  //       .style("display", function(d) { return d.parent === data ? "inline" : "none"; })
  //       .text(function(d) { return d.data.name; });

  //       var node = g.selectAll("circle,text");

  //   svg.style("background", color(-1))
  //     .on("click", function() { zoom(data); });
      
  //   zoomTo([data.x, data.y, data.r * 2 + margin]);
      
  //   function zoom(d) {
  //     var focus0 = focus; focus = d;
  
  //     var transition = d3.transition()
  //         .duration(d3.event.altKey ? 7500 : 750)
  //         .tween("zoom", function(d) {
  //           var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
  //           return function(t) { zoomTo(i(t)); };
  //         });
  
  //     transition.selectAll("text")
  //       .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
  //         .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
  //         .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
  //         .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  //   }
      
  //   function zoomTo(v) {
  //     var k = circleDiameter / v[2]; view = v;
  //     node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  //     circle.attr("r", function(d) { return d.r * k; });
  //   }
    

  // });
  
  // d3.json(, function(error, root) {
  //   if (error) throw error;

  //   root = d3.hierarchy(root)
  //       .sum(function(d) { return d.size; })
  //       .sort(function(a, b) { return b.value - a.value; });

  //   var focus = root,
  //       nodes = pack(root).descendants(),
  //       view;

  //   var circle = g.selectAll("circle")
  //     .data(nodes)
  //     .enter().append("circle")
  //       .attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
  //       .style("fill", function(d) { return d.children ? color(d.depth) : null; })
  //       .on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

  //   var text = g.selectAll("text")
  //     .data(nodes)
  //     .enter().append("text")
  //       .attr("class", "label")
  //       .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
  //       .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
  //       .text(function(d) { return d.data.name; });

  //   var node = g.selectAll("circle,text");

  //   svg
  //       .style("background", color(-1))
  //       .on("click", function() { zoom(root); });

  //   zoomTo([root.x, root.y, root.r * 2 + margin]);

  //   function zoom(d) {
  //     var focus0 = focus; focus = d;

  //     var transition = d3.transition()
  //         .duration(d3.event.altKey ? 7500 : 750)
  //         .tween("zoom", function(d) {
  //           var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
  //           return function(t) { zoomTo(i(t)); };
  //         });

  //     transition.selectAll("text")
  //       .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
  //         .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
  //         .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
  //         .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  //   }

  //   function zoomTo(v) {
  //     var k = diameter / v[2]; view = v;
  //     node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
  //     circle.attr("r", function(d) { return d.r * k; });
  //   }
  // });
})();
