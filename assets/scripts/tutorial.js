$(document).ready(function () {
    imageIdentity = "A";
    var condition = localStorage.getItem("condition");
    if (localStorage.getItem("isPredictionTask") == "true")
        imageIdentity = "P";
    else if (condition == "3")
        imageIdentity = "B";
    else if (condition == "4")
        imageIdentity = "C";
    else if (condition == "5")
        imageIdentity = "D";
    else if (condition == "6")
        imageIdentity = "E";

});
function loadNextImage() {
    console.log("hello!");
    var imageNumber = extractFileName();
    if (fileExists(imageNumber + 1)) {
        d3.select("#image")
            .attr("src", "./assets/images/" + imageIdentity + (imageNumber + 1) + ".png");
    }
    // All the images are seen! hence, you can go to the next page!
    if (!fileExists(imageNumber + 2)) {
        d3.select("#next")
            // .classed("disabled", true);
        d3.select("#next-task")
            .style("visibility", "visible");
    }
    if (imageNumber == 1)
        d3.select("#prev")
            .classed("disabled", false);
}
function loadPreviousImage() {
    var imageNumber = extractFileName();
    // Prev image exists?e
    if (fileExists(imageNumber - 1)) {
        d3.select("#image")
            .attr("src", "./assets/images/" + imageIdentity + (imageNumber - 1) + ".png");
    }
    if (!fileExists(imageNumber + 1)) {
        d3.select("#next")
            .classed("disabled", false);
    }
    if (imageNumber == 2)
        d3.select("#prev")
            .classed("disabled", true);
}

function extractFileName() {
    var source = d3.select("#image").attr("src");
    var imageNumber = source.replace(/^.*[\\\/]/, '');
    if (imageNumber == "start.png")
        return 0;
    imageNumber = imageNumber.split('.').slice(0, -1).join('.');
    return parseInt(imageNumber.substr(1));
}

function fileExists(filename) {
    var http = new XMLHttpRequest();
    http.open('HEAD', './assets/images/' + imageIdentity + filename + '.png', false);
    http.send();
    return http.status!=404;
}
