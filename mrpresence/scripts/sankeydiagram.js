(function () {
    
    const margin = 10;
    var width = 1250;
    //width = window.innerWidth;
    width = $("#sankey-diagram").width();
    const height = 700;
    const svgBackgroundColor = "#EBECF0";
    const svgBorderColor = "1px solid #EBECF0";
    const sankeyNodeWidth = 24;
    const sankeyNodeAlignment = d3.sankeyLeft;//d3.sankeyCenter;
    const sankeyNodePadding = 16;
    const sankeyNodeOpacity = 0.8;

    d3.json("data/SankeyData.json").then(function(data){ 
        // For sankey nodes
        const colorScale = d3.interpolateTurbo;
        const nodeStrokeColorFactor = 0.3;
        const nodeLinkOpacity = 0.5;

        const path = d3.sankeyLinkHorizontal();

        function GetColor(index) {
            let ratio = index / (data.nodes.length - 1.0);
            return colorScale(ratio);
        }

        const arrowSign = "\u2192";

        const svg = d3.select("#sankey-diagram")
            .append("svg:svg")
            .style("width", width)
            .style("height", height)
            .attr("class", "sd-svg")
            .style("background-color", svgBackgroundColor)
            .style("border", svgBorderColor)
            .append("g")
            .attr("transform", `translate(${margin},${margin})`);
    
        const sankeyGraphSize = [width - 2 * margin, height - 2 * margin];

        const sankey = d3.sankey()
            .size(sankeyGraphSize)
            .nodeId(d => d.name)
            .nodeWidth(sankeyNodeWidth)
            .nodePadding(sankeyNodePadding)
            .nodeAlign(sankeyNodeAlignment);

            //sankeyNodeAlignment
        let sankeyGraph = sankey(data);

        // append a defs (for definition) element to your SVG
        const sankeyDefs = svg.append('defs')
            .selectAll("g")
            .data(sankeyGraph.links)
            .enter();

        // svg.append("g")
        //     .classed("links", true)

        // Configure Link Stops Gradients
        let linkGradients = sankeyDefs.append("linearGradient")  
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x0", d=>d.source.x0)
            .attr("x1", d=>d.source.x1)
            .attr("id", d => `link_gradient_${d.source.name}_${d.target.name}`);
      

        // Add source node color
        linkGradients.append("stop")
            .attr("offset", 0.0)
            .attr("stop-color", d => GetColor(d.source.index));
        
        // Add target node color
        linkGradients.append("stop")
                .attr("offset", 1.0)
                .attr("stop-color", d => GetColor(d.target.index));

        // For sankey node links
        let sankeyNodeLinks = svg.append("g")
            .classed("links", true)
            .selectAll("g")
            .data(sankeyGraph.links)
            .enter()
            .append("g")
            .attr("id", d => `path_${d.source.name}_${d.target.name}`)
            .attr("onclick", d => `ClickedLink("${d.source.name}","${d.target.name}")`);

        // Add nodes link
        sankeyNodeLinks.append("title")
            .text(d => {
                var title = "" + d.source.name 
                + " " + arrowSign 
                + " " + d.target.name + "\n";

                if(d.value == 1)
                    title += "1 publication";
                else
                    title += d.value + " publications";

                return title;
            });

        sankeyNodeLinks.append("path")
            .classed("link", true)
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", d => `url("#${`link_gradient_${d.source.name}_${d.target.name}`}")`)
            .style("stroke-width", d => Math.max(1.0, d.width))
            .style("stroke-opacity", nodeLinkOpacity);
    
        // Loop through the nodes. Set additional properties to make a few things
        // easier to deal with later.
        sankeyGraph.nodes.forEach(node => {
            let nodeFillColor = GetColor(node.index);
            node.fillColor = nodeFillColor;
            node.strokeColor = d3.color(nodeFillColor).darker(nodeStrokeColorFactor);
            node.width = node.x1 - node.x0;
            node.height = node.y1 - node.y0;
        });

        // For each sankey node
        let sankeyNode = svg.append("g")
            .classed("nodes", true)
            .selectAll("g")
            .data(sankeyGraph.nodes)
            .enter()
            .append("g")
            .attr("onclick", d => `ClickedNode("${d.name}")`);;

        sankeyNode.append("title")
            .text(d =>
            {
                var title = "" + d.name + "\n";

                if(d.value == 1)
                    title += "1 publication";
                else
                    title += d.value + " publications";

                return title;
                
            });

        sankeyNode.append("rect")
            .classed("node", true)
            .attr("x", d => d.x0)
            .attr("y", d => d.y0)
            .style("width", d => d.width)
            .style("height", d => d.height)
            .style("fill", d => d.fillColor)
            .style("opacity", sankeyNodeOpacity)
            .style("stroke", d => d.strokeColor)
            .style("stroke-width", 0);

        sankeyNode.append('text')
            .attr('x', d => d.x1 + 20)
            .attr('y', d => (d.y1 - d.y0) / 2 + d.y0)
            .attr('dy', '.35em')
            .attr('text-anchor', 'start')
            .attr('transform', null)
            .text(d => d.name)
            .filter(d => d.x1 > width / 2)
                .attr('x', d => d.x1 - sankey.nodeWidth() - 20)
                .attr('text-anchor', 'end');
    });
    
    // const data = {
    //     nodes: [
    //         { group_nodes: 1, id: "General Presence" },
    //         { group_nodes: 1, id: "Spatial Presence" },
    //         { group_nodes: 1, id: "Social Presence" },
    //         { group_nodes: 2, id: "Questionnaire" },
    //         { group_nodes: 2, id: "Interview" },
    //         { group_nodes: 2, id: "Physiological" },
    //         { group_nodes: 3, id: "Behavior" },
    //         { group_nodes: 3, id: "VR" },
    //         { group_nodes: 3, id: "MR" },
    //         { group_nodes: 3, id: "Self-development" },
    //         { group_nodes: 4, id: "2" },
    //         { group_nodes: 5, id: "4" }
    //     ],
    //     links: [
            
    //         { source: "General Presence", target: "2", value:  5 },
    //         { source: "Spatial Presence", target: "2", value:  2 },
    //         { source: "Social Presence", target: "2", value:  4 },
    //         { source: "General Presence", target: "4", value:  5 },
    //         { source: "Spatial Presence", target: "4", value:  2 },
    //         { source: "Social Presence", target: "4", value:  6 },
    //         { source: "2", target: "Questionnaire", value:  1 },
    //         { source: "2", target: "Interview", value:  1 },
    //         { source: "4", target: "Questionnaire", value:  1 },
    //         { source: "4", target: "Interview", value:  1 },
    //         { source: "General Presence", target: "Questionnaire", value:  5 },
    //         { source: "Questionnaire", target: "VR", value:  10 },
    //         { source: "Questionnaire", target: "MR", value:  3 },
    //         { source: "Interview", target: "Self-development", value:  1 }
    //     ]
    // }

    // let nodeDepths = sankeyGraph.nodes
    //     .map(n => n.depth)
    //     .reduce(ReduceUnique, []);
    
    // nodeDepths.forEach(d => {
    //     let nodesAtThisDepth = sankeyGraph.nodes.filter(n => n.depth === d);
    //     let numberOfNodes = nodesAtThisDepth.length;
    //     let totalHeight = nodesAtThisDepth
    //                         .map(n => n.height)
    //                         .reduce(GetSum, 0);
    //     let whitespace = sankeyGraphSize[1] - totalHeight;
    //     let balancedWhitespace = whitespace / (numberOfNodes + 1.0);
    //     console.log("depth", d, "total height", totalHeight, "whitespace", whitespace, "balanced whitespace", balancedWhitespace);
    // });

            
    // svgNodes.call(d3.drag()
    //                 .on("start", onDragStart)
    //                 .on("drag", onDragDragging)
    //                 .on("end", onDragEnd));

    console.log("sankey1.js loaded.");
})();

function RootVisualization() {
    $("#list_publications").empty();
    $("#home_tiles").empty();

    $.getJSON("data/Publications/PresenceAspects.json", function(json) {
        json.forEach(aspect =>{

            var p = '<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" title = "' + aspect.NumberOfPapers + ' publications of ' + aspect.Aspect + '">' + 
                        '<div class="flex flex-col items-center py-4">' +
                            '<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">' + aspect.NumberOfPapers + '</h5>' +
                            '<span class="text-sm text-gray-500 dark:text-gray-400">' + aspect.Aspect + '</span>' +
                        '</div>' +
                '</div>';
            
            $("#home_tiles").append(p);

            for(var id = 0; id < aspect.Measurements.length; id++)
            {
                var element = aspect.Measurements[id];
                
                for(var i = 0; i < element.MeasurementsAspects.length; i++)
                {
                    for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                    {
                        html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + aspect.Aspect + "</th>" +  
                                "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                "<td class=\"px-6 py-4\"><a href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" target=\"_blank\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                            "</tr>";

                        $("#list_publications").append(html);
                    }
                }                 
            }
        });

        $("#bc_hierachy").empty();
        var html = '<li class="inline-flex items-center">' +
                        '<a class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                        '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                        'Root' +
                        '</a>' +
                    '</li>';
        $("#bc_hierachy").append(html);
    });

}

RootVisualization();


function ClickedLink(source, target)
{
    $("#list_publications").empty();
    var flag = false;
    $.getJSON("data/Publications/PresenceAspects.json", function(json) {
        json.forEach(element =>{
            if(element.Aspect == source)
            {
                element.Measurements.forEach(element =>
                {
                    if(element.Measurement == target)
                    {
                        for(var i = 0; i < element.MeasurementsAspects.length; i++)
                        {
                            for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                            {
                                html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                            "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + source + "</th>" +  
                                            "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                            "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                                        "</tr>";
    
                                $("#list_publications").append(html);
                            }
                        }
                        
                        flag = true;
                    }
                });
                

                $("#bc_hierachy").empty();
                var html = '<li class="inline-flex items-center">' +
                                '<a onclick="RootVisualization()" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                                '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                                'Root' +
                                '</a>' +
                            '</li>' +
                            '<li>' +
                                '<div class="flex items-center">' +
                                '<svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' +
                                '<a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">' + source + " \u2192 " + target + '</a>' +
                                '</div>' +
                            '</li>';
                $("#bc_hierachy").append(html);
            }
        });

        if(!flag)
        {
            flag = false;

            json.forEach(aspect =>{
                for(var id = 0; id < aspect.Measurements.length; id++)
                {
                    var element = aspect.Measurements[id];
                    if(element.Measurement == source)
                    {
                        for(var i = 0; i < element.MeasurementsAspects.length; i++)
                        {
                            for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                            {
                                if(element.MeasurementsAspects[i].Aspect == target)
                                {                                    
                                    html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                                "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + aspect.Aspect + "</th>" +  
                                                "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                                "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                                            "</tr>";
        
                                    $("#list_publications").append(html);
                                }
                            }
                        }
                    }                    
                }

                $("#bc_hierachy").empty();
                var html = '<li class="inline-flex items-center">' +
                                '<a onclick="RootVisualization()" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                                '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                                'Root' +
                                '</a>' +
                            '</li>' +
                            '<li>' +
                                '<div class="flex items-center">' +
                                '<svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' +
                                '<a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">' + source + " \u2192 " + target + '</a>' +
                                '</div>' +
                            '</li>';
                $("#bc_hierachy").append(html);
                
                flag = true;
            });
        }
        
    });

    
}

function ClickedNode(source)
{
    $("#list_publications").empty();
    $("#home_tiles").empty();

    var flag = false;
    $.getJSON("data/Publications/PresenceAspects.json", function(json) {
        json.forEach(element =>{
            if(element.Aspect == source)
            {

                var p = '<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" title = "' + element.NumberOfPapers + ' publications of ' + element.Aspect + '">' + 
                            '<div class="flex flex-col items-center py-4">' +
                                '<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">' + element.NumberOfPapers + '</h5>' +
                                '<span class="text-sm text-gray-500 dark:text-gray-400">' + element.Aspect + '</span>' +
                            '</div>' +
                        '</div>';
                
                $("#home_tiles").append(p);

                //$("#home_tiles").addClass('grid-cols-8').removeClass('grid-cols-9');

                element.Measurements.forEach(element =>
                    {
                        var p = '<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" title = "' + element.NumberOfPapers + ' publications of ' + element.Measurement + '">' + 
                                    '<div class="flex flex-col items-center py-4">' +
                                        '<h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">' + element.NumberOfPapers + '</h5>' +
                                        '<span class="text-sm text-gray-500 dark:text-gray-400">' + element.Measurement + '</span>' +
                                    '</div>' +
                                '</div>';
                        
                        $("#home_tiles").append(p);
                        
                        for(var i = 0; i < element.MeasurementsAspects.length; i++)
                        {
                            for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                            {
                                html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                            "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + source + "</th>" +  
                                            "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                            "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                                        "</tr>";

                                $("#list_publications").append(html);
                            }
                        }
                    });
                

                $("#bc_hierachy").empty();
                var html = '<li class="inline-flex items-center">' +
                                '<a onclick="RootVisualization()" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                                '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                                'Root' +
                                '</a>' +
                            '</li>' +
                            '<li>' +
                                '<div class="flex items-center">' +
                                '<svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' +
                                '<a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">' + source + '</a>' +
                                '</div>' +
                            '</li>';
                $("#bc_hierachy").append(html);
                
                flag = true;
            }
        });

        if(!flag)
        {
            flag = false;
            json.forEach(aspect =>{
                for(var id = 0; id < aspect.Measurements.length; id++)
                {
                    var element = aspect.Measurements[id];
                    if(element.Measurement == source)
                    {                        
                        for(var i = 0; i < element.MeasurementsAspects.length; i++)
                        {                                                
                            for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                            {
                                html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                            "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + source + "</th>" +  
                                            "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                            "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                            "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                                        "</tr>";
    
                                $("#list_publications").append(html);
                            }
                        }

                        flag = true;
                    }                    
                }
                

                if(flag)
                {
                    $("#bc_hierachy").empty();
                    var html = '<li class="inline-flex items-center">' +
                                    '<a onclick="RootVisualization()" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                                    '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                                    'Root' +
                                    '</a>' +
                                '</li>' +
                                '<li>' +
                                    '<div class="flex items-center">' +
                                    '<svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' +
                                    '<a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">' + source + '</a>' +
                                    '</div>' +
                                '</li>';
                    $("#bc_hierachy").append(html);
                }
            });

            if(!flag)
            {
                flag = false;
                
                json.forEach(aspect =>{
                    for(var id = 0; id < aspect.Measurements.length; id++)
                    {
                        var element = aspect.Measurements[id];
                        for(var i = 0; i < element.MeasurementsAspects.length; i++)
                        {
                            for(var j = 0; j < element.MeasurementsAspects[i].Papers.length; j++)
                            {
                                
                                if(element.MeasurementsAspects[i].Aspect == source)
                                {
                                    html = "<tr class=\"bg-white border-b dark:bg-gray-900 dark:border-gray-700\">" + 
                                                "<th scope=\"row\" class=\"px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white\">" + source + "</th>" +  
                                                "<td class=\"px-6 py-4\">" + element.Measurement + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Aspect + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Title + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Authors + "</td>" + 
                                                "<td class=\"px-6 py-4\">" + element.MeasurementsAspects[i].Papers[j].Year + "</td>" + 
                                                "<td class=\"px-6 py-4\"><a target=\"_blank\" href=\"" + element.MeasurementsAspects[i].Papers[j].ArticleURL + "\" class=\"font-medium text-blue-600 dark:text-blue-500 hover:underline\">Access</a></td>";
                                            "</tr>";
        
                                    $("#list_publications").append(html);
                                }
                            }
                        }                 
                    }
                    
    
                    $("#bc_hierachy").empty();
                    var html = '<li class="inline-flex items-center">' +
                                    '<a onclick="RootVisualization()" class="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">' +
                                    '<svg aria-hidden="true" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>' +
                                    'Root' +
                                    '</a>' +
                                '</li>' +
                                '<li>' +
                                    '<div class="flex items-center">' +
                                    '<svg aria-hidden="true" class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>' +
                                    '<a href="#" class="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">' + source + '</a>' +
                                    '</div>' +
                                '</li>';
                    $("#bc_hierachy").append(html);
                    
                    flag = true;
                });
            }
        }
        
    });
}

// function WriteTable(data, div)
// {    
//     var html = "";

//     var detailObject = data.value.find(function(element) {
//         return element.name === "Studies";
//     });

//     html += 
//         '<div class="table-container">' +
//             '<table class="table" id="reported_papers_table">' +
//                 '<thead>' +
//                     '<tr style="background-color: gainsboro;">' +
//                         '<th><abbr title="Title">Title</abbr></th>' +
//                         '<th><abbr title="Author">Author</abbr></th>' +
//                         '<th><abbr title="AdjectiveRating">Adjective Rating</abbr></th>' +
//                         '<th><abbr title="Score">Score</abbr></th>' +
//                         '<th><abbr title="Participants">Number of Participants</abbr></th>' +
//                         '<th><abbr title="Year">Year</abbr></th>' +
//                         '<th><abbr title="Published in">Published in</abbr></th>' +
//                         '<th><abbr title="Link">Link</abbr></th>' +
//                     '</tr>' +
//                 '</thead>' +
//                 '<tfoot>' +
//                     '<tr style="background-color: gainsboro;">' +
//                         '<th><abbr title="Title">Title</abbr></th>' +
//                         '<th><abbr title="Author">Author</abbr></th>' +
//                         '<th><abbr title="AdjectiveRating">Adjective Rating</abbr></th>' +
//                         '<th><abbr title="Score">Score</abbr></th>' +
//                         '<th><abbr title="Participants">Number of Participants</abbr></th>' +
//                         '<th><abbr title="Year">Year</abbr></th>' +
//                         '<th><abbr title="Published in">Published in</abbr></th>' +
//                         '<th><abbr title="Link">Link</abbr></th>' +
//                     '</tr>' +
//                 '</tfoot>' +
//                 '<tbody height="200px">';

//     var rating_scale = "Ranking_class";

//     if(data.subscale === "Overall")
//     {
//         rating_scale = 'Ranking_class';
//     }
//     else if(data.subscale === "SP")
//     {
//         rating_scale = 'Sp_ranking_class';
//     }
//     else if(data.subscale === "GP")
//     {
//         rating_scale = 'Gp_ranking_class';
//     }
//     else if(data.subscale === "INV")
//     {
//         rating_scale = 'Inv_ranking_class';
//     }
//     else if(data.subscale === "REAL")
//     {
//         rating_scale = 'Real_ranking_class';
//     }

//     detailObject.value.forEach(function(e){         
//         html = html + '<tr style="background-color:' + data.color + '">' +
//                         '<td>' + e.Title + '</td>' + 
//                         '<td>' + e.Authors + '</td>' + 
//                         '<td>' + e[rating_scale] + '</td>' + 
//                         '<td>' + Math.round(e.Standard_total_each_item * 1000) / 1000 + '</td>' + 
//                         '<td>' + e.Number_of_total_participants + '</td>' + 
//                         '<td>' + e.Year + '</td>' + 
//                         '<td>' + e.Source + '</td>' + 
//                         '<td><a href="' + e.ArticleURL + '">Link</a></td>' +                    
//                     '</tr>';
//     });

//     html += '</tbody>' +
//         '</table>' +
//     '</div>';
    
//     $(div).html(html);
// }

// When the user clicks on the button, scroll to the top of the document
function GoTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}