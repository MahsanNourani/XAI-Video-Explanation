

var listItems;
var listItems1;
var listItems2;
var listItems3;

function createString (explanation) {
    var string = "<mark style=\"background-color: rgba(126, 220, 220, 0.72);\"><b>"
        + explanation.action;

    console.log (string);
    return string;
}

function createString1 (explanation) {
    var string = "<mark style=\"background-color: rgba(75, 0, 255, 0.22);\"><b>"
        + explanation.object;
    console.log (string);
    return string;
}


function createString2 (explanation) {
    var string = "<mark style=\"background-color: rgba(240, 79, 183, 0.32);\"><b>"
         + explanation.location;
    console.log (string);
    return string;
}


function createString3 (explanation) {
    var string =  explanation.accuracy*100 +"%";
    console.log (string);
    return string;
}

// To load explanation data from json files
function loadData(explanationsData, associationData)
{
    console.log(explanationsData);
    console.log(associationData);

    for (var j = 0; j <explanationsData.length; j++) {
        loadExplanation(explanationsData)
    }
    loadCharts(associationData);

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
    d3.selectAll('.list-group-item').remove()

}