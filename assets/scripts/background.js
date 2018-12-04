// $(document).ready(function () {
//     var condition = localStorage.getItem("condition");
//
//     if (condition == 4) /*no video segment*/ {
//         // d3.select("#video-segment").style("display", "none");
//         d3.select("#video-segment").remove();
//     }
//     else if (condition == 5) /*no component scores*/ {
//         // d3.select("#detected-combinations").style("display", "none");
//         // d3.select("#component-scores").style("display", "none");
//
//         d3.select("#detected-combinations").remove();
//         d3.select("#component-scores").remove();
//     }
// });

function continueToPredictionTask() {
    var responsesBackground = {};
        responsesBackground.age = getValueOfSelected("#age");
        responsesBackground.occupation = getValueOfSelected(("#occupation"));
        responsesBackground.gender = getValueOfSelected("#gender");
        responsesBackground.degree = getValueOfSelected(("#degree"));
        responsesBackground.blind = getValueOfSelected("#c-blind");
        responsesBackground.mlExp = getValueOfSelected("#ml-exp");

    localStorage.setItem("bgQ", JSON.stringify(responsesBackground));
    // location.href = "./prediction-task.html";
    location.href ="./Tutorial.html";
}

function radioChange() {
    if (isOptionSelected("#ml-exp") && isOptionSelected("#c-blind") &&
        isOptionSelected("#degree") && isOptionSelected("#gender") &&
        !isInputEmpty("#age") && !isInputEmpty("#occupation"))
        d3.select("#next")
            .classed("disabled", false);
}

function isOptionSelected(id) {
    var isChecked = false;
    if (d3.select(id).empty())
        return true;
    d3.select(id)
        .selectAll("input").each(function (d) {
        if (d3.select(this).node().checked == true)
            isChecked = true;
    });
    return isChecked;
}

function isInputEmpty(id) {
    if (d3.select(id).node().value == "") {
        return true;
    }
    return false;
}

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).empty())
        return value;
    if (d3.select(id).attr("type") == "number" || d3.select(id).attr("type") == "text") {
        // window.alert("hello" + d3.select(id).attr("type"));
        return d3.select(id).node().value;
    }
    d3.select(id)
        .selectAll("input")
        .each(function (d) {
            if (d3.select(this).node().checked) {
                value = d3.select(this).attr("value");
            }
        });
    return value;
}