
function loadNextImage() {
    console.log("hello!");
    var imageNumber = extractFileName();
    // Next image exists?
    if (fileExists(imageNumber + 1)) {
        d3.select("#image")
            .attr("src", "./assets/images/" + (imageNumber + 1) + ".png");
        console.log("image being shown is: " + (imageNumber + 1));
    }
    // All the images are seen! hence, you can go to the next page!
    if (!fileExists(imageNumber + 2)) {
        d3.select("#next")
            // .classed("disabled", true);
        d3.select("#next-task")
            .style("visibility", "visible");
        //     .html("Continue to the Next Task")
        //     .on ("click", function () {
        //         if (localStorage.getItem("isPredictionTask") == "false")
        //             location.href = localStorage.getItem("conditionLink");
        //         else
        //             location.href = './prediction-task.html';
        //     })

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
            .attr("src", "./assets/images/" + (imageNumber - 1) + ".png");
        console.log("image being shown is: " + (imageNumber - 1));
    }
    if (!fileExists(imageNumber + 1)) {
        d3.select("#next")
            .classed("disabled", false);
        //
        // d3.select("#next")
        //     .html("Next")
        //     .on("click", loadNextImage());
    }
    if (imageNumber == 2)
        d3.select("#prev")
            .classed("disabled", true);
}

function extractFileName() {
    var source = d3.select("#image").attr("src");
    var imageNumber = source.replace(/^.*[\\\/]/, '');
    imageNumber = imageNumber.split('.').slice(0, -1).join('.');
    return parseInt(imageNumber);
}

function fileExists(filename) {
    // console.log(filename);
    var http = new XMLHttpRequest();
    http.open('HEAD', './assets/images/' + filename + '.png', false);
    http.send();
    return http.status!=404;
}

// function loadOtherImage (buttonPressed) {
//     var imageNumber = extractFileName();
//
//     if (fileExists(parseInt(imageNumber) + parseInt(buttonPressed))) {
//         d3.select("#image")
//             .attr("src", "./assets/images/" + (parseInt(imageNumber) + parseInt(buttonPressed)) + ".png");
//         // 1. Next pressed and it was the first image
//         if (imageNumber == "1" && buttonPressed == "1")
//             d3.select("#prev")
//                 .classed("disabled", false);
//         // 2. Prev pressed and it was the second image
//         else if (imageNumber == "2" && buttonPressed == "-1")
//             d3.select("#prev")
//                 .classed("disabled", true);
//         // 3. Next pressed and we are now at the last image
//         else if (!fileExists(parseInt(imageNumber) + 2))
//             d3.select("#next")
//                 .classed("disabled", true);
//         // 4. Prev pressed and we were at the last image
//         else if (!fileExists(parseInt(imageNumber) + 2))
//             d3.select("#next")
//                 .classed("disabled", false);
//     }
// }
