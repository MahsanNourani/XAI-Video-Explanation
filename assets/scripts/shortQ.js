$(document).ready(function () {
    var condition = localStorage.getItem("condition");

    if (condition == 4) /*no video segment*/ {
        d3.select("#video-segment-eval").style("display", "none");
        d3.select("#video-segment-eval-header").style("display", "none");
    }
    else if (condition == 5) /*no component scores*/ {
        d3.select("#combination-eval").style("display", "none");
        d3.select("#combination-eval-header").style("display", "none");
        d3.select("#component-score-eval").style("display", "none");
        d3.select("#component-score-eval-header").style("display", "none");
    }
});

function continueToPredictionTask() {
    var responsesShortQ = {};
        responsesShortQ.gen_eval = getValueOfSelected("#general-eval");
        responsesShortQ.segment_eval = getValueOfSelected("#video-segment-eval");
        responsesShortQ.comb_eval = getValueOfSelected("#combination-eval");
        responsesShortQ.score_eval = getValueOfSelected("#component-score-eval");
    localStorage.setItem("shortQ", JSON.stringify(responsesShortQ));
    location.href = "./prediction-task.html";
}

function radioChange() {
    if (isOptionSelected("#general-eval") && isOptionSelected("#video-segment-eval") &&
        isOptionSelected("#combination-eval") && isOptionSelected("#component-score-eval"))
        d3.select("#next")
            .classed("disabled", false);
}

function isOptionSelected(id) {
    var isChecked = false;
    if (d3.select(id).style("display") == 'none')
        return true;
    d3.select(id)
        .selectAll("input").each(function (d) {
        if (d3.select(this).node().checked == true)
            isChecked = true;
    });
    return isChecked;
}

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).style("display") == 'none')
        return value;
    d3.select(id)
        .selectAll("input")
        .each(function (d) {
            if (d3.select(this).node().checked) {
                value = d3.select(this).attr("value");
            }
        });
    return value;
}