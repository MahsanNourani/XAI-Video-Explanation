(function scopeFunction() {

    var file = "assets/data/videoList.json";
    var fileNames = [];
    var currentVideo = {};
    var currentVideoData = [];
    d3.json(file, function(data){
       for (var i = 0; i< data.names.length; i++) {
           fileNames.push(data.names[i]);
       }

        var videoSelector = d3.select("#video-select")
            .append("div")
            .classed("col-md-12 selector-main-div", true);
            // .attr("id", "selector-main-div");
        var videoSegment = d3.select("#media-video");

        videoSelector.selectAll("div")
            .data(fileNames).enter()
            .append("div")
                .style("padding", "3px")
                .classed("col-md-6 video-select-div", true)
            .append("a")
                .classed("col-md-12 video-item", true)
                .on("click", function (d,i) {
                    videoSegment.attr("src",function () {
                        return "assets/videos/" + d;
                    });
                    currentVideo.videoName = d;
                    d3.selectAll(".video-select-div > a").classed("video-item-select", false);
                    d3.select(this).classed("video-item-select", true);
                    d3.select("#video-select").node().scrollTop = 0;
                })
                .html(function (d) {
                    return d;
                });
    });

    // Read all the questions from file and show them on the interface
    this.onVideoLoaded = function () {

        document.getElementById('media-video').currentTime = 0;
        var file = "assets/data/video_new.json";

        d3.json(file, function (data) {

            for(var i=0;i<data.length;i++) {
                if(data[i].videoName==currentVideo.videoName) {
                    currentVideoData = data[i].listOfQuestions;
                    createQuestionInterface();
                }

            }
        });
    };

    function createQuestionInterface() {
        d3.select("#queries").html("");
        d3.select("#main-query").html("");
        clear_list();
        clear_segment();
        clear_explanation_sets();
        var allTheQuestions = d3.select("#queries").append("div").classed("col-md-12 selector-main-div", true);
        var mainQuery = d3.select("#main-query").append("div").classed("col-md-12 vertical-align-center", true);

        // var selectedRow = mainQuery.append("div");
            // .classed("row", true).attr("id","selected-query-main-div");

        mainQuery.append("div")
            .classed("col-md-8", true)
            .attr("id", "selected-query-main")
            .html("Select one of the questions below to see more details.");

        var responseDiv = mainQuery.append("div")
            .classed("col-md-4", true)
            .style("padding", "28px");
        // responseDiv.append("div")
        //     .classed("col-md-12 response-title", true)
        //     .html("Computer Answer");
        responseDiv.append("div")
            .classed("col-md-12", true)
            .attr("id", "computer-response")
            .html("");

        // var allTheQuestions = querySection.append("div").classed("row", true);

        // allTheQuestions.style("background-color", "pink");

        allTheQuestions.selectAll("div")
            .data(currentVideoData).enter()
            .append("div")
                .style("padding", "3px")
                // .attr("id", "query-select-div")
                .classed("col-md-6 query-select-div", true)
            .append("a")
                .classed("col-md-12 query-item", true)
                .on("click", function (d,i) {
                    d3.selectAll(".query-select-div > a").classed("selected-query", false);
                    d3.select(this).classed("selected-query", true);
                    d3.select("#queries").node().scrollTop = 0;
                    loadSelectedQuestion(d);
                })
                .html(function (d) {
                    return d.questionText;
                });

    }
    // Show query on click
    function loadSelectedQuestion(question) {
        // console.log(question);
        showQuery(question);
        showResponse(question);
        showExplanations(question);
    }

    function showQuery(currentQuestion) {
        d3.select("#selected-query-main")
            .html(function () {
                return currentQuestion.questionText;
            });
    }

    function showResponse(currentQuestion) {
        d3.select("#computer-response")
            .html(function () {
                return currentQuestion.computerAnswer;
            })
    }

    function showExplanations(currentQuestion) {
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

})();