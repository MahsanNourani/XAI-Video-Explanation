var listItems;
var listItems1;
var listItems2;
var listItems3;

// To load explanation data from json files
function loadData(explanationsData, associationData) {
    console.log("data is loaded!");
    d3.select('#list').append("div")
            .classed("explanation-options explanation-options-header vertical-align-center", true)
            .html("Activity")
        .style("font-size","medium");

    d3.select('#list1').append("div")
        .classed("explanation-options explanation-options-header vertical-align-center", true)
        .html("Object")
        .style("font-size","medium");

    d3.select('#list2').append("div")
        .classed("explanation-options explanation-options-header vertical-align-center", true)
        .html("Location")
        .style("font-size","medium");

    d3.select('#list3').append("div")
        .classed("explanation-options explanation-options-header vertical-align-center", true)
        .html("Rank")
        .style("font-size","medium");
    // console.log("before rendering the explanations")
    // for (var j = 0; j <explanationsData.length; j++) {
    //     console.log("this is j: " + j);
    //     loadExplanation(explanationsData);
    // }
    // Mahsan: I'm not sure about this!
    loadExplanation(explanationsData);
    loadCharts(associationData, "#4dcee4");
}



//to show explanations in panel 2

function loadExplanation (data) {
    listItems = d3.select("#list").selectAll("a")
        .data(data).enter();

    listItems1 = d3.select("#list1").selectAll("a")
        .data(data).enter();

    listItems2 = d3.select("#list2").selectAll("a")
        .data(data).enter();

    listItems3 = d3.select("#list3").selectAll("a")
        .data(data).enter();

    listItems.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            return "<b>"
                + d.activity;
        });

    listItems1.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            return "<b>"
                + d.object;
        });


    listItems2.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            return "<b>"
                + d.location;
        });

    listItems3.append("a")
        .classed("list-group-item list3", true)
        .style({
            "background-color": "#0686da",
            /*border: 1px solid #428aca24;*/
            "color": "white"
        })
        .append("p")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            return d.approximation;
        });



}

//to clear the prevous list before loading new list dor each question
function clear_list() {
    //listItems.remove();
    // d3.selectAll('g.button').remove();
    d3.selectAll('.list-group-item').remove();
    d3.select("#component-score-div").select(".panel-body").html("");
    d3.selectAll('.explanation-options').remove();
}

