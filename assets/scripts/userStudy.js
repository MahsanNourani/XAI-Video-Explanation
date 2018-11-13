// (function() {
//     console.log("in user study!");
//     localStorage.setItem("id", generateID());
//     console.log(localStorage.getItem("id"));
//     console.log("leaving user study!");
// })();

$(document).ready(function () {
   if (localStorage.getItem("isPredictionTask") == "true") {
       showQuestionnaire();
   }
});

function grantConsentToParticipate() {
    localStorage.clear();
    localStorage.setItem("isPredictionTask", "false");
    localStorage.setItem("id", generateID());
    // var condition = Link();
    localStorage.setItem("condition", generateCondition());
    // localStorage.setItem("conditionLink",condition[1]);
    // location.href = condition[1];
}

function generateID() {
    var text = "";
    //"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    var possible = "abcdefghijklmnopqrstuvwxyz";
    var number = Math.floor(Math.random() * 10000);
    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text+number;
}

// Condition link is useless! remove it
function generateCondition() {
    return Math.floor(Math.random() * 6) + 1;
}

function showQuestionnaire() {
    var instructions = d3.select("#instructions");

    instructions.style("display","block");

    instructions.select("div")
        .style("margin-top","15px");

    d3.select("#main-container")
        .style("height","70%");

    instructions.select("p")
        .html("Your <u>participant id</u> is <b style='color: deeppink; font-style: italic;'>" + localStorage.getItem("id") + "</b>." +
            " You should insert it in the required field below." +
            " After you submitted the form, press Done!");

    var button = d3.select("#instructions-btn")
        .classed("disabled", true)
        .html("Done")
        .on("click", function (e) {
            d3.select("#check")
                .style("visibility", "visible");
            d3.select("#info-text")
                .html("Please insert the number given below after submitting the form and press continue.");
            // d3.select(this).remove();
            d3.select(this).style("display", "none");
            // location.href = localStorage.getItem("conditionLink");
        });

    var checkIfSubmit = instructions.append("div")
        .classed("form-group col-md-8 col-md-offset-2", true)
        .attr("id", "check")
        .style("visibility","hidden");
        // .append("label")
        // .attr("for", "submit-check")
        // .html("Enter the response number from the form: ")
    checkIfSubmit.append("input")
        .classed("form-control", true)
        .attr("type", "text")
        .attr("id", "submit-check")
        .on("input", function () {
            // window.alert(d3.select(this).node().value);
            console.log("yo");
            if (d3.select("#submit-check").node().value == 125 && localStorage.getItem("isPredictionTask") == "false") {
                console.log("here");
                d3.select("#submit").classed("disabled", false);
            }
            else if (d3.select("#submit-check").node().value == 125 && localStorage.getItem("isPredictionTask") == "true") {
                console.log("and here")
                d3.select("#submit").classed("disabled", false);
            }
        });

    checkIfSubmit.append("button")
        .classed("btn btn-warning btn-md col-md-4", true)
        .attr("id","back")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .html("Back")
        .on("click", function () {
            d3.select("#check")
                .style("visibility", "hidden");
            d3.select("#info-text")
                .html("");
            instructions.select("p")
                .html("Your <u>participant id</u> is <b style='color: deeppink; font-style: italic;'>" + localStorage.getItem("id") + "</b>." +
                    " You should insert it in the required field below." +
                    " After you submitted the form, press Done!");
            d3.select("#instructions-btn")
                .style("display","block");
        });

    checkIfSubmit.append("button")
        .classed("btn btn-primary btn-md col-md-8 disabled", true)
        .attr("id","submit")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .html("Continue")
        .on("click", function () {
            // location.href = localStorage.getItem("conditionLink");
            if (localStorage.getItem("isPredictionTask") == "false") {
                localStorage.setItem("backgroundDone", getDateTime());
                location.href = './Tutorial.html';
            }
            else {
                localStorage.setItem("postStudyDone", getDateTime());
                createResultsInterface();
                // window.alert("done");
            }
        });

    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

    mainContainer.append("iframe")
        .attr("src", function () {
            if (localStorage.getItem("isPredictionTask") == "false")
                return "https://docs.google.com/forms/d/e/1FAIpQLSfaQ64PfQuLaLqFkKENT1Sz1pCUCIGw-HO3psT11Gl5sqYy3A/viewform?embedded=true";
            else
                return "https://docs.google.com/forms/d/e/1FAIpQLSd6tEuv6VlsJoCXNRGHELpcsOxC3jJX-C0PiDpK43CwK8U1vw/viewform?embedded=true";
        })
        .attr("width", "100%")
        .attr("height", "600px")
        .attr("frameborder", "0")
        .attr("marginheight", "0")
        .attr("marginwidth", "0")
        .style("margin-top", "40px")
        .html("Loading...")
        .on("load", function () {
            button.classed ("disabled", false);
        });
}

function showConsentForm() {
    var instructions = d3.select("#instructions");

    instructions.style("display","block");

    instructions.select("div")
        .style("margin-top","15px");

    d3.select("#main-container")
        .style("height","70%");

    instructions.select("p")
        .html("This is the consent form for the study which would give you details on the general task, risks, compensation, and contact details of" +
            " the people in case you had any questions. Please read it carefully, make sure you download a copy for yourself, and if you agree to" +
            " participate based on the conditions, click I AGREE TO PARTICIPATE and proceed.");

    d3.select("#instructions-btn")
        .html("I AGREE TO PARTICIPATE")
        .on("click", function (e) {
            // window.alert("THANKS!");
            grantConsentToParticipate();
            showQuestionnaire();
        });

    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

    mainContainer.append("embed")
        .attr("src", "assets/data/InformationSheet.pdf")
        .attr("width", "100%")
        .attr("height", "550px")
        .attr("type", "application/pdf");
}

function createResultsInterface() {
    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

    var textArea = mainContainer.append("div")
        .classed("container", true)
        .append("div")
        .classed("form-group", true);

    textArea.append("textarea")
        .classed("form-control selection", true)
        .attr("rows", "5")
        .html(function () {
            return prepareResults();
        });

    textArea.append("button")
        .classed("btn btn-default btn-block copy", true)
        .attr("type", "submit")
        .html("Copy Results to Clipboard <span><i class='fa fa-copy'></i></span>");

    document.ClipboardApi.setCopyButton('.copy','.selection');

    var instructions = d3.select("#instructions");
    instructions.select("p")
        .html("Thank you for participating in the study. Make sure you copy your results from below " +
            "and paste them in the required field in Amazon Mechanical Turk to receive your compensation." +
            "You can press the button below to automatically copy your results to the clipboard.");
    d3.select("#check").remove();

}

function prepareResults() {

    var results = {};
    results.condition = localStorage.getItem("condition");
    results.userID = localStorage.getItem("id");
    results.backgroundDone = localStorage.getItem("backgroundDone");
    results.reviewTask = JSON.parse(localStorage.getItem("responsesReviewTask"));
    results.predictionTask = JSON.parse(localStorage.getItem("responsesPredictionTask"));
    results.postStudyDone = localStorage.getItem("postStudyDone");
    results.logs = JSON.parse(localStorage.getItem("logs"));

    return JSON.stringify(results);

}

function backToTutorial() {
    location.href = "./Tutorial.html";
}

function continueToNextTask() {
    if (localStorage.getItem("isPredictionTask") == "false")
        location.href = './machine.html';
    else
        location.href = './prediction-task.html';
}

function getDateTime() {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;

}

(function createClipboardAPI(document){
    /**
     * multi browser clipboard copy - ypetya@gmail.com
     * */
    document.ClipboardApi = new ClipboardApi();

    function ClipboardApi() {
        this.setCopyButton= function(selector, copyAreaSelector) {
            var copyBtn = document.querySelector(selector);

            copyBtn.addEventListener('click', function(event) {
                eventDispatcher( copyAreaSelector, 'copy');
            });
        }
    }

    /***
     * This function uses multiple methods for copying data to clipboard
     * 1. document.execCommand('copy') can be supported only for user initiated contexts
     *   - that means we can only determine it on the fly
     *   - d3 eventDispatch is not working this way
     * 2. ClipboardEvent constructor is only defined for Firefox (see MDN)
     *   - for FF, d3 selector uses input's value property instead of selection.text()
     * */
    function eventDispatcher( inputSelector, action) {
        var clipboardEl = document.querySelector(inputSelector);

        // Chrome
        if(document.queryCommandSupported && document.queryCommandSupported(action)) {
            clipboardEl.select();
            document.execCommand(action);
        } else {
            // FF
            var event = new ClipboardEvent(action)
            var text = clipboardEl.value;
            event.clipboardData.setData('text/plain', text);
            event.preventDefault();
            document.dispatchEvent(event);
        }

    };


}(window.document));
