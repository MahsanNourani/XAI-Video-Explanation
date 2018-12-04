$(document).ready(function () {
    var condition = localStorage.getItem("condition");

    if (condition == 3) /*no explanation*/ {
        d3.selectAll(".with-exp").remove();
    }
    else if (condition == 6) /*baseline*/ {
        d3.selectAll(".with-exp").remove();
        d3.selectAll(".without-exp").remove();
    }
});

function continueToLastPage() {
    var responsesPost = {};
    responsesPost.pred = getValueOfSelected("#pred");
    responsesPost.predExp = getValueOfSelected("#pred-exp");
    responsesPost.affect = getValueOfSelected("#affect");
    responsesPost.cmnt = getValueOfSelected("#cmnt");
    responsesPost.agdis = [];
    for (var i = 1; i <= 17; i++ ) {
        var resp = {};
        resp.id = "q"+i;
        resp.resp = getValueOfSelected("#" + resp.id);
        responsesPost.agdis.push(resp);
    }

    localStorage.setItem("post", JSON.stringify(responsesPost));
    location.href = "./index.html";
    // location.href ="./Tutorial.html";
}

function radioChange() {
    var radioAllChecked = true;
    for (var i = 1; i <= 17; i++) {
        if (!isOptionSelected("#q" + i))
            radioAllChecked = false;
    }

    if (radioAllChecked &&
        !isInputEmpty("#affect") &&
        !isInputEmpty("#pred") && !isInputEmpty("#pred-exp"))
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
    if (d3.select(id).empty())
        return false;
    if (d3.select(id).node().value == "") {
        return true;
    }
    return false;
}

function getValueOfSelected(id) {
    var value = -100;
    if (d3.select(id).empty()) {
        return value;
    }
    if (d3.select(id).attr("type") == "number" || d3.select(id).attr("type") == "text" || d3.select(id).node().tagName =="TEXTAREA") {
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