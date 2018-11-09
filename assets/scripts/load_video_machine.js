$(document).ready(function () {
    var condition = localStorage.getItem("condition");

    if (condition == "4") /* This is when video segments are not shown!*/
        d3.select("#segment").style("visibility", "hidden");
    else if (condition == "5") /* This is when component explanations are not shown!*/ {
        d3.select("#explanation-box")
            .style("visibility", "hidden");
        d3.select("#component-score-div")
            .style("visibility", "hidden");
    }
});

// This js is used to load the video and associated data
(function scopeFunction() {

    var listOfVideos = [];

    var currentVideoData = [];

    var responses = [];

    var startTime;

    var currentVideo = {},
        nextVideoIndex = 0,
        nextQueryIndex = 0;

    var isFirstVideo = true;

    var file = 'assets/data/video_list_main.json';

    d3.json(file, function(error, data) {
        if (error)
            console.log(error);

        var videos;
        // To know which set of videos to load
        if (localStorage.getItem("isPredictionTask") == "false")
            videos = data.reviewTask;
        else
            videos = data.predictionTask;

        for (var i = 0; i < videos.length; i++) {
            listOfVideos.push(videos[i]);
        }

        // This is to randomize the videos for each participant!
        listOfVideos = shuffle(listOfVideos);

        loadVideo();
    });

    this.radioChange = function () {
        if ((isOptionSelected("#agree-disagree") && isOptionSelected("#evaluation")) ||
            (isOptionSelected("#agree-disagree") && localStorage.getItem("isPredictionTask") == "true") ||
            (isOptionSelected("#agree-disagree") && localStorage.getItem("condition") == "3")) {
            d3.select("#submit").classed("disabled", false);
        }
    };

    function loadVideo() {
        var vid = document.getElementById("media-video");
        if (!isFirstVideo)
            document.getElementById("modal-btn").click();

        currentVideo = listOfVideos[nextVideoIndex++];
        nextQueryIndex = 0;
        console.log("changed the video! " + currentVideo.videoName);
        var sourceVideo = 'assets/videos/' + currentVideo.videoName;
        vid.src = sourceVideo;
        vid.load();
        vid.currentTime = 0;
        isFirstVideo = false;
    }

    this.onVideoLoaded = function() {
        file = 'assets/data/video_new.json';
        d3.json(file, function(error, data){
            if (error)
                console.log(error);
            for (var i = 0; i<data.length; i++){
                if (data[i].videoName == currentVideo.videoName) {
                    currentVideoData = data[i].listOfQuestions;

                    // shuffle the list of questions for each each video.
                    currentVideoData = shuffle(currentVideoData);

                    break;
                }
            }
            // if (!isPredictionTask)
            if (localStorage.getItem("isPredictionTask") == "false")
                loadQuestion();
            else
                loadQuestionPrediction();
        });
    }

    function loadQuestion() {
        var currentQuestion =  currentVideoData[nextQueryIndex++];
        console.log(currentQuestion);
    //    1 . show the question and respond on the page. (D3)
        showQuery(currentQuestion);
        showResponse(currentQuestion);
    //    2 . show the explanations
        showExplanations(currentQuestion);
    //    3. record current time
        startTime = new Date().getTime();
        // console.log("this is the time " + startTime);
    }

    function loadQuestionPrediction() {
        var currentQuestion =  currentVideoData[nextQueryIndex++];
        showQuery(currentQuestion);
        startTime = new Date().getTime();
    }

    this.loadNextQuery = function () {
        if (nextQueryIndex == currentVideo.queryCount) {

            if ((nextVideoIndex == listOfVideos.length) && localStorage.getItem("isPredictionTask") == "false") {
                localStorage.setItem("isPredictionTask", "true");

                //save the answers and go to the next task (either questionnaire or prediction task
                this.loadTaskAfterReview();
            }
            else if ((nextVideoIndex == listOfVideos.length) && localStorage.getItem("isPredictionTask") == "true"){
                // 1. Open the modal to say thanks all videos are done.

                // 2. go to the post-study questionnaire
                console.log("study is done!");
                loadTaskAfterPrediction();
                return;
            }
            else {
                loadVideo();
            }
        }

        else {
            if (localStorage.getItem("isPredictionTask") == "false")
                loadQuestion();
            else
                loadQuestionPrediction();
        }
        d3.select("#submit").classed("disabled", true);
        d3.select("#next").style("display", "none");
        d3.select("#submit").style("display", "block");
        uncheckAll();
        toggleDisabilityRadioButtons();
        var clickLocation = (localStorage.getItem("isPredictionTask")) == "false"?"performanceTask":"predictionTask";
        createClickLog("loadNextQuery", clickLocation);
    };

    this.submitAndShowCorrectAnswer = function () {
        d3.select("#correct-answer")
            // .style("visibility", "visible");
            .classed ("correct-answer-visible", true)
            .classed ("correct-answer-hidden", false);
        d3.select("#correct-answer-header")
        // .style("visibility", "visible");
            .classed ("correct-answer-visible", true)
            .classed ("correct-answer-hidden", false);

        // So to avoid misunderstanding of the user when they select confirmed the selection.
        // I want the user to not be able to change their respond in order to compare their answer with the correct answer.

        toggleDisabilityRadioButtons();

        var agreeDisagree = getValueOfSelected("#agree-disagree");
        var evaluation = getValueOfSelected("#evaluation");
        console.log(currentVideoData[nextQueryIndex-1]);
        var respondObject = {};
            respondObject.videoName = currentVideo.videoName;
            respondObject.queryId = currentVideoData[nextQueryIndex-1].questionId;
            respondObject.agreeDisagree = agreeDisagree;
            respondObject.evaluation = evaluation;
        recordResults (respondObject, responses);
        console.log(respondObject.agreeDisagree + " " + respondObject.evaluation);

        var clickLocation = (localStorage.getItem("isPredictionTask")) == "false"?"performanceTask":"predictionTask";
        createClickLog("submitAnswer", clickLocation);

        d3.select("#next").style("display", "block");
        d3.select("#submit").style("display", "none");
    };

    this.loadTaskAfterReview = function () {
        localStorage.setItem("responsesReviewTask", JSON.stringify(responses));
        localStorage.setItem("isPredictionTask", "true");

        // We don't need a survey for the no explanation conditions; hence, directly to the prediction task
        if (localStorage.getItem("condition") == "3")
            location.href = './prediction-task.html';
        else
            location.href = './shortq.html';
    };

    function loadTaskAfterPrediction () {
        localStorage.setItem("responsesPredictionTask", JSON.stringify(responses));
        location.href = './index.html';
    };

    function recordResults(recordObject, array) {
        recordObject.startQueryTime = startTime;
        recordObject.userID = localStorage.getItem("id");
        array.push(recordObject);
    }

    function getValueOfSelected(id) {
        var value = -100;
        d3.select(id)
            .selectAll("input")
            .each(function (d) {
                if (d3.select(this).node().checked) {
                    value = d3.select(this).attr("value");
                }
            });
        return value;
    }

    function uncheckAll(){
        d3.selectAll('input')
            .each(function (d) {
                d3.select(this).node().checked = false;
            });
        d3.selectAll('label').classed("active", false);
    }

    function toggleDisabilityRadioButtons() {
        d3.selectAll("label")
            .each(function (d) {
                if (d3.select(this).classed("disabled")) {
                    d3.select(this).classed("disabled", false);
                }
                else
                    d3.select(this).classed("disabled", true);
            });
    }

    function isOptionSelected(id) {
        var isChecked = false;
        d3.select(id)
            .selectAll("input").each(function (d) {
                if (d3.select(this).node().checked == true)
                    isChecked = true;
            });
        return isChecked;
    }

    function showQuery(currentQuestion) {
        var queryDiv = d3.select("#query-section");
        queryDiv.html("");
        //header
        queryDiv.append("div")
            .classed("col-md-12 panel-heading", true)
            .attr("id", "question-section-header")
            .append("h")
            .classed("component", true)
            .html("Query from the Video");
        //query
        queryDiv.append("div")
            .attr("id","query")
            .classed("col-md-12 vertical-align-center", true)
            .append("h")
            .html(function () {
                return currentQuestion.questionText;
            });
    }

    function showResponse(currentQuestion) {

        var queryDiv = d3.select("#query-section");
        //system's answer
        var responseDiv = queryDiv.append("div")
            .classed("col-md-12 vertical-align-center system-answer", true);
        responseDiv.append("h")
            .style("color", "#428bca")
            .html("System's Answer:&nbsp;");
        responseDiv.append("h")
            .html(function () {
                return currentQuestion.computerAnswer;
            });
        queryDiv.append("div")
            .classed("col-md-12 component-header vertical-align-center component correct-answer-hidden", true)
            .attr("id", "correct-answer-header")
            .style("margin-top", "0px")
            .append("h")
            .classed("component", true)
            .html("Correct Answer");
        var correctAnswerDiv = queryDiv.append("div")
            .classed("col-md-12 vertical-align-center system-answer correct-answer-hidden", true)
            .attr("id","correct-answer");
        correctAnswerDiv.append("h")
            .style("color", "#428bca")
            .html("Correct Answer:&nbsp;");
        correctAnswerDiv.append("h")
            .html(function () {
                return currentQuestion.correctAnswer;
            });
    }

    function showExplanations(currentQuestion) {
        // var listOfFrames = currentQuestion.listOfKeyFrames;
        var length = currentQuestion.listOfKeyFrames.length;
        var startTimes = [],
            endTimes = [],
            explanations = [],
            associations = [];
        for (var i = 0; i< length; i++) {
            startTimes.push(currentQuestion.listOfKeyFrames[i].startTime);
            endTimes.push(currentQuestion.listOfKeyFrames[i].endTime);
            explanations.push(currentQuestion.listOfKeyFrames[i].textExplanations);
            associations.push(currentQuestion.listOfKeyFrames[i].associatedFeatures);
        }

        // This will make sure the video's metadata is load before plotting the segments
        clear_list();
        clear_segment();
        segment_buttons(startTimes, endTimes, explanations, associations);
    }

    this.createClickLog = function (clickInstrument, clickLocation) {
        var logObject = {};
            logObject.video = currentVideo.videoName;
            logObject.question = currentVideoData[nextQueryIndex-1].questionId;
            logObject.clickInstrument = clickInstrument;
            logObject.clickLocation = clickLocation;
            logObject.time = new Date().getTime();

        var allTheLogs = JSON.parse(localStorage.getItem("logs"));
        allTheLogs.push(logObject);
        localStorage.setItem("logs", JSON.stringify(allTheLogs));
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
})();
