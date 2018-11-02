// This js is used to load the video and associated data
(function scopeFunction() {

    // var isPredictionTask = false;
    //generate a random ID here!
    var ID;
    var listOfVideos = [],
        listOfPredVideos = [];

    var currentVideoData = [];

    var responses = [],
        predResponses = [];

    var startTime;

    var currentVideo = {},
        nextVideoIndex = 0,
        nextQueryIndex = 0;

    var isFirstVideo = true;

    var file = 'assets/data/video_list_main.json';

    d3.json(file, function(error, data) {
        if (error)
            console.log(error);
        for (var i = 0; i < data.length; i++) {
            listOfVideos.push(data[i]);
        }

        // This is to randomize the videos for each participant!
        listOfVideos = shuffle(listOfVideos);

        //I donno if it should be commented out or not! I guess I should put this every time I change the video!
        // notFirstTime = 0;

        // if (isPredictionTask) {
        if (localStorage.getItem("isPredictionTask") == "true") {
            responses = JSON.parse(localStorage.getItem("responses"));
        }
        loadVideo();
    });

    this.radioChange = function () {
        if ((isOptionSelected("#agree-disagree") && isOptionSelected("#evaluation")) ||
            (isOptionSelected("#agree-disagree") && localStorage.getItem("isPredictionTask") == "true")) {
            console.log("yes!!!");
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

                // I don't know if I'm actually using this?!
                listOfVideos = listOfPredVideos;

                //save the answers and go to the next task (either questionnaire or prediction task
                this.loadNextTask();
            }
            // else if ((nextVideoIndex == listOfVideos.length) && isPredictionTask){
            else if ((nextVideoIndex == listOfVideos.length) && localStorage.getItem("isPredictionTask") == "true"){
                //maybe open the modal and then reload the page!
                console.log("study is done!");
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
        //
        d3.select("#submit").classed("disabled", true);
        // d3.select("#submit").classed("disabled", true);
        d3.select("#next").style("display", "none");
        d3.select("#submit").style("display", "block");
        uncheckAll();
        toggleDisabilityRadioButtons();

    };

    this.submitAndShowCorrectAnswer = function () {
        d3.select("#correct-answer")
            .style("display", "flex");
        d3.select("#correct-answer-header")
            .style("display","flex");

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

        d3.select("#next").style("display", "block");
        d3.select("#submit").style("display", "none");
        // d3.select("#next").classed("disabled", false);
        // d3.select("#submit").classed("disabled", true);
    };

    this.loadNextTask = function () {
        localStorage.setItem("responses", JSON.stringify(responses));
        localStorage.setItem("isPredictionTask", "true");

        // We don't need a survey for the no explanation conditions; hence, directly to the
        if (localStorage.getItem("condition") == "3")
            location.href = './prediction-task.html';
        else
            location.href = './shortq.html';
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
            .classed("col-md-12 component-header vertical-align-center component", true)
            .attr("id", "correct-answer-header")
            .style("margin-top", "0px")
            .append("h")
            .classed("component", true)
            .html("Correct Answer");
        var correctAnswerDiv = queryDiv.append("div")
            .classed("col-md-12 vertical-align-center system-answer", true)
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
