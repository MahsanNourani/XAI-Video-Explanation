// This js is used to load the video and associated data
(function scopeFunction() {
    var listOfVideos = [];
    var currentVideoData = [];
    var responses = [];
    var startTime;
    var currentVideo = {},
        nextVideoIndex = 0,
        nextQueryIndex = 0;
    var notFirstTime = 0;
    var file = 'assets/data/video_list_main.json';
    d3.json(file, function(error, data) {
        if (error)
            console.log(error);
        for (var i = 0; i < data.length; i++) {
            listOfVideos.push(data[i]);
        }
        loadVideo();
    });

    // console.log(currentVideoData[0]);

    function loadVideo() {
        var vid = document.getElementById("media-video");
        currentVideo = listOfVideos[nextVideoIndex++];
        nextQueryIndex = 0;
        console.log("changed the video! " + currentVideo.videoName);
        var sourceVideo = 'assets/videos/' + currentVideo.videoName;
        vid.src = sourceVideo;
        vid.load();

        file = 'assets/data/video_new.json';
        d3.json(file, function(error, data){
            if (error)
                console.log(error);
            for (var i = 0; i<data.length; i++){
                if (data[i].videoName == currentVideo.videoName) {
                    currentVideoData = data[i].listOfQuestions;
                    break;
                }
                // console.log(video[0]);
            }
            loadQuestion();
        });
    }
    
    function loadQuestion() {
        var currentQuestion =  currentVideoData[nextQueryIndex++];
        console.log(currentQuestion);
        
    //    1 . show the question and respond on the page. (D3)
        showQueryAndResponse(currentQuestion);
    //    2 . show the explanations 
        showExplanations(currentQuestion);
    //    3. record current time
        startTime = new Date().getTime();
        console.log("this is the time " + startTime);
    }

    this.loadNextQuery = function () {
        if (nextQueryIndex == currentVideo.queryCount) {
            if (nextVideoIndex == listOfVideos.length) {
                console.log("study is done!");
                return;
            }
            loadVideo();
        }
        else {
            loadQuestion();
        }

    };

    this.submitAndShowCorrectAnswer = function () {
        d3.select("#correct-answer")
            .style("display", "flex");
        d3.select("#correct-answer-header")
            .style("display","flex");

        var agreeDisagree = getValueOfSelected("#agree-disagree");
        var evaluation = getValueOfSelected("#evaluation");
        var respondObject = {};
            respondObject.agreeDisagree = agreeDisagree;
            respondObject.evaluation = evaluation;
        recordResults (respondObject);
        console.log(respondObject.agreeDisagree + " " + respondObject.evaluation);
        uncheckAll();
    };

    function recordResults(recordObject) {
        recordObject.startQueryTime = startTime;
        responses.push(recordObject);
        console.log(responses);
    }

    function getValueOfSelected(id) {
        var agreeDisagree = -100;
        d3.select(id)
            .selectAll("input")
            .each(function (d) {
                if (d3.select(this).node().checked) {
                    agreeDisagree = d3.select(this).attr("value");
                }
            });
        return agreeDisagree;
    }

    function uncheckAll(){
        d3.selectAll('input')
            .each(function (d) {
                d3.select(this).node().checked = false;
            });
        d3.selectAll('label').classed("active", false);
    }
    
    function showQueryAndResponse(currentQuestion) {
        var queryDiv = d3.select("#query-section");
        queryDiv.html("");
        //header
        queryDiv.append("div")
            .classed("col-md-12 panel-heading", true)
            .attr("id", "question-section-header")
            .append("h")
            .classed("component", true)
            .html("Query from the Video and the System's Response");
        //query
        queryDiv.append("div")
            .attr("id","query")
            .classed("col-md-12 vertical-align-center", true)
            .append("h")
            .html(function () {
                return currentQuestion.questionText;
            });
        //system's answer
        queryDiv.append("div")
            .classed("col-md-12 vertical-align-center system-answer", true)
            .append("h")
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
        queryDiv.append("div")
            .classed("col-md-12 vertical-align-center system-answer", true)
            .attr("id","correct-answer")
            .append("h")
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

        segment_buttons(startTimes, endTimes, explanations, associations, notFirstTime);
        if (notFirstTime) {
            clear_list(notFirstTime);
            clear_segment();
        }
        notFirstTime +=1;
    }
})();
