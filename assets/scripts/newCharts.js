
var maxWidth = 80, height = "10px";
function loadCharts (associations, color) {
    d3.select("#marginal-score").html("");
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
    var temp = d3.select("#marginal-score");
    var dummy = temp.selectAll("div").data(listOfData).enter()
        .append("div")
        .classed("col-md-12", true);
    dummy.append("h")
        .html(function (d) {
            if (d == undefined)
                return "";
            var string = d.name.replace(/-/g, " ");
            return string;
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