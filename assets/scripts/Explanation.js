var listItems;
var listItems1;
var listItems2;
var listItems3;

function createString (explanation) {
    var string = "<b>"
        + explanation.action;

    console.log (string);
    return string;
}

function createString1 (explanation) {
    var string = "<b>"
        + explanation.object;
    console.log (string);
    return string;
}


function createString2 (explanation) {
    var string = "<b>"
        + explanation.location;
    console.log (string);
    return string;
}


function createString3 (explanation) {
    // var string =  (explanation.accuracy*100).toFixed(2) +"%";
    // console.log (string);
    // return string;
    return explanation.accuracy;
}

// To load explanation data from json files
function loadData(explanationsData, associationData)
{
    console.log(explanationsData);
    console.log(associationData);

    var header=d3.select('#list').append("div")
            .classed("explanation-options vertical-align-center", true)
            .html(function(d) {
                var str="Acitvity";
                return str;
             })
        .style("font-size","medium");

        d3.select('#list1').append("div")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            var str="Object";
            return str;
        })
        .style("font-size","medium");

        d3.select('#list2').append("div")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            var str="Location";
            return str;
        })
        .style("font-size","medium");

        d3.select('#list3').append("div")
        .classed("explanation-options vertical-align-center", true)
        .html(function(d) {
            var str="Rank";
            return str;
        })
        .style("font-size","medium");

    for (var j = 0; j <explanationsData.length; j++) {
        loadExplanation(explanationsData)
    }
    loadCharts(associationData, "#850d2a");
    loadChartsTemp(associationData, "#008185");

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

    console.log("here");

    listItems.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options", true)
        .html(function(d) {
            return createString(d);
        });

    listItems1.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options", true)
        .html(function(d) {
            return createString1(d);
        });


    listItems2.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options", true)
        .html(function(d) {
            return createString2(d);
        });

    listItems3.append("a")
        .classed("list-group-item", true)
        .append("p")
        .classed("explanation-options", true)
        .html(function(d) {
            return createString3(d);
        });



}

//to clear the prevous list before loading new list dor each question
function clear_list(flag){

    //listItems.remove();
    d3.selectAll('.list-group-item').remove();

    d3.selectAll('.explanation-options').remove();

}

