// (function() {
//     console.log("in user study!");
//     localStorage.setItem("id", generateID());
//     console.log(localStorage.getItem("id"));
//     console.log("leaving user study!");
// })();

function grantConsentToParticipate() {
    localStorage.setItem("id", generateID());
    var condition = generateConditionLink();
    localStorage.setItem("condition", condition[0]);
    localStorage.setItem("conditionLink",condition[1]);
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

function generateConditionLink() {
    var conditionRandomCode = Math.floor(Math.random() * 5) + 1;
    var conditionLink = "";
    switch (conditionRandomCode) {
        case 1:
            // XAI - Good exp
            conditionLink = "./machine.html";
            break;
        case 2:
            // XAI - Bad exp
            conditionLink = "./machine.html";
            break;
        case 3:
            // XAI - no exp
            conditionLink = "./no.html";
            break;
        case 4:
            // XAI - no segment exp
            conditionLink = "./machine.html";
            break;
        case 5:
            // XAI - no component exp
            conditionLink = "./machine.html";
            break;
    }
    return [conditionRandomCode, conditionLink];
}

function showBackgroundQuestionnaire() {
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
                .html("Please insert the number given below after submitting the form and press continue.")
            d3.select(this).remove();
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
            if (d3.select("#submit-check").node().value == 125)
                d3.select("#submit").classed("disabled", false);
        });

    checkIfSubmit.append("button")
        .classed("btn btn-primary btn-large btn-block disabled", true)
        .attr("id","submit")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .html("Continue")
        .on("click", function () {
            location.href = localStorage.getItem("conditionLink");
        });

    //
    // instructions.append("input")
    //     .classed("form-control", true)
    //     .attr("type", "text")
    //     .attr("id", "submit-check")
    //     .style("visibility", "hidden")
    //     .style("margin-top", "20px");

    var mainContainer = d3.select("#main-container");
    mainContainer.html("");


    // <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSfaQ64PfQuLaLqFkKENT1Sz1pCUCIGw-HO3psT11Gl5sqYy3A/viewform?embedded=true"
    // width="640" height="799" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>
    mainContainer.append("iframe")
        .attr("src", "https://docs.google.com/forms/d/e/1FAIpQLSfaQ64PfQuLaLqFkKENT1Sz1pCUCIGw-HO3psT11Gl5sqYy3A/viewform?embedded=true")
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
            showBackgroundQuestionnaire();
        });

    var mainContainer = d3.select("#main-container");
    mainContainer.html("");

    mainContainer.append("embed")
        .attr("src", "assets/data/InformationSheet.pdf")
        .attr("width", "100%")
        .attr("height", "550px")
        .attr("type", "application/pdf");
}