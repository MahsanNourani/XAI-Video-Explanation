// function createXScale(minDomain, maxDomain, minRange, maxRange) {
//     return d3.scale.ordinal()
//         .domain(d3.range(minDomain,maxDomain))
//         .rangeBands([minRange, maxRange]);
// }
//
// function createYScale(minDomain, maxDomain, minRange, maxRange) {
//     return d3.scale.linear()
//         .domain([minDomain, maxDomain])
//         .range([minRange, maxRange]);
// }
//
// var margin = {top: 10, right: 3, bottom: 10, left: 3};
//
// function createChartSvg(chartDiv) {
//     return chartDiv.append("div")
//         .classed("col-md-4 chart-div", true)
//         .append("svg")
//         .attr("width", "100%")
//         .attr("height", "150px")
//         .classed("svg-style", true);
// }
//
//
//
// function createBarChart(data, svg, xScale, yScale, colors, tooltip, newHeight) {
//     svg.selectAll("rect")
//         .data(data).enter()
//         .append("rect")
//         .style('fill', function (d, i) {
//             return colors(i);
//         })
//         .style('opacity', 0.5)
//         .attr('width', '30px')
//         .attr('height', function (d) {
//             return yScale(d.probability);
//         })
//         .attr('x', function (d, i) {
//             return i * (30 + 3);
//         })
//         .attr('y', function (d) {
//             return 150 - yScale(d.probability);
//         })
//         .attr('rx', 3)
//         .attr('ry', 3)
//         .style({
//             'stroke': 'black',
//             'stroke-width': '1px'
//         })
//         .on('mouseenter', function (d) {
//             d3.select(this).transition()
//                 .duration(500)
//                 .style('opacity', 1);
//             tooltip.transition()
//                 .duration(100)
//                 .style('opacity', 0.9);
//             tooltip.html(function () {
//                 //parseFloat((Math.round(d.probability*100 * 100)/100).toFixed(2));
//                 var probability = (d.probability*100).toFixed((2));
//                 var newHtml = "<ui><li>Component Name: " + d.name +"</li>"
//                     + "<li>Probability: " + probability + "%</li></ui>";
//
//                 return newHtml;
//             })
//                 .style('left', (d3.event.pageX) + 'px' )
//                 .style('top', (d3.event.pageY) + 'px' )
//         })
//
//
//         .on('mouseout', function (d) {
//             tooltip.transition()
//                 .style('opacity', 0);
//             d3.select(this).transition().duration(500).style('opacity', 0.5);
//         });
//     // ------> For Text On Each Bar <----------
//
//     // svg.selectAll('text')
//     //     .data(data).enter()
//     //     .append('text')
//     //     .text(function (d) {
//     //         return d.name;
//     //     })
//     //     .attr("text-anchor", "middle")
//     //     .attr("x", function(d, i) {
//     //         return xScale(i) + xScale.rangeBand()/2;
//     //     })
//     //     .attr("y", function(d) {
//     //         return 140 - yScale(d.probability);
//     //     })
//     //     .attr("font-family", "sans-serif")
//     //     .attr("font-size", "11px")
//     //     .attr("fill", "black");
//
//
//     // -----> For Vertical Axis <------
//
//
//     var yAxis = d3.svg.axis()
//         .scale(createYScale(0, 100, newHeight, 0))
//         .orient('right')
//         .ticks(1);
//     var yGuide = svg.append('g');
//     yAxis(yGuide);
//     yGuide.attr('transform', 'translate(0,0)');
//     yGuide.selectAll('path')
//         .style({'fill': 'none', 'stroke': '#000'});
//
//     yGuide.selectAll('.tick text')
//         .attr ('y', function (d, i) {
//             var translate = d3.transform(d3.select(this).attr("transform")).translate;
//             var temp = translate[1] - 10 + 20*i;
//             console.log(temp);
//             return temp;
//         })
//         .attr ('x', '2');
//     yGuide.selectAll('line')
//         .style({'stroke': '#000'});
// }
//
// function loadCharts(associations) {
//     //removing previous chart!
//     d3.select("#chart-div").html("");
//
//     var listOfData = [associations.listOfAllDetectedAction, associations.listOfAllDetectedObject, associations.listOfAllDetectedLocation];
//     var listOfLabels = ['Activity','Object', 'Location'];
//     var listOfColors = [["#a5e6e6","#000eff"],["#d7cdff", "#5e3fdc"], ["#fdc9e9","#c5318c"]];
//     for (var i = 0; i<3; i++) {
//
//         var chartLabels = d3.select("#chart-div-labels")
//             .append('div')
//             .classed("col-md-4 chart-div text-center", true)
//             .style('background', '#428aca')
//             .html(listOfLabels[i]);
//
//         var chartDiv = d3.select("#chart-div");
//         var chartSvg = createChartSvg(chartDiv);
//         var data = listOfData[i];
//
//         if (data == undefined)
//             continue;
//
//         var tooltip = d3.select("body").append('div')
//             .style('position', 'absolute ')
//             .style('padding', '0 10px')
//             .style('background', 'white')
//             .style('opacity', 0);
//
//         var newWidth = parseFloat(d3.select('#chart-div svg').style('width').replace("px", ""), 10),
//             newHeight = parseFloat(d3.select('#chart-div svg').style('height').replace("px", ""), 10);
//
//         var yScale = createYScale(0, 1, 0, newHeight),
//             xScale = createXScale(0, listOfData[i].length, 0, newWidth);
//
//         var colors = d3.scale.linear()
//             .domain([0, 1])
//             .range(listOfColors[i]);
//             // .range([d3.rgb(165, 230, 230), d3.rgb(0, 122, 255)]);
//
//         createBarChart(data, chartSvg, xScale, yScale, colors, tooltip, newHeight);
//     }
// }
var maxWidth = 80, height = "10px";
function loadCharts (associations, color) {
    d3.select("#component-score-div").select(".panel-body").html("");
    // d3.select("#marginal-score").html("");
    var listOfData = [];
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedAction);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedObject);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedLocation);

    listOfData.sort(function(x, y){
        return d3.descending(x.probability, y.probability);
    });

    var parentNode = d3.select("#component-score-div").select(".panel-body");

    parentNode.append("div")
        .classed("col-md-12 component-header vertical-align-center component", true)
        .append("h")
        .classed("component", true)
        .html("Based on Model's Answer and the Input Video ");
    //<div class="col-md-12 component-score" id="marginal-score"></div>

    var marginalScoreDiv = parentNode.append("div")
        .classed("col-md-10 col-md-offset-1 component-score", true)
        .attr("id", "marginal-score");

    var componentScores = marginalScoreDiv.selectAll("div").data(listOfData).enter()
        .append("div")
        .classed("col-md-6", true);
    componentScores.append("h")
        .html(function (d) {
            if (d == undefined)
                return "";
            return d.name;
        })
        .classed ("component col-md-12 score-header", true);
    componentScores.append("svg")
        .classed("score-svg", true)
        .attr("height", function () {
            return height;
        })
        .attr("width", function () {
            return maxWidth;
        })
        .append("rect")
        .attr("height", function () {
            return height;
        })
        .attr("width", function (d) {
            if (d == undefined)
                return 0;
            return d.probability * maxWidth;
        })
        .attr("fill", function () {
            return color;
        });
//     "#850d2a"
}

function loadChartsTemp (associations, color) {
    d3.select("#unconditional-score").html("");
    var listOfData = [];
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedAction);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedObject);
    if (associations.listOfAllDetectedAction !== undefined)
        listOfData = listOfData.concat(associations.listOfAllDetectedLocation);

    var temp = d3.select("#unconditional-score");
    var dummy = temp.selectAll("div").data(listOfData).enter()
        .append("div")
        .classed("col-md-12", true);
    dummy.append("h")
        .html(function (d) {
            if (d == undefined)
                return "";
            return d.name;
        })
        .classed ("component col-md-12 score-header", true);
    dummy.append("svg")
        .classed("score-svg", true)
        .attr("height", function () {
            return height;
        })
        .attr("width", function () {
            return maxWidth;
        })
        .append("rect")
        .attr("height", function () {
            return height;
        })
        .attr("width", function (d) {
            if (d == undefined)
                return 0;
            return d.unconditional_probability * maxWidth;
        })
        .attr("fill", function () {
            return color;
        });
//     "#850d2a"
}