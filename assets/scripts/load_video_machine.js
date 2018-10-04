// This js is used to load the video and associated data

//To load video file from directory
 var vid;

(function localFileVideoPlayer() {
    'use strict'
  var URL = window.URL || window.webkitURL;
  // var displayMessage = function (message, isError) {
  //   var element = document.querySelector('#message')
  //   element.innerHTML = message
  //   element.className = isError ? 'error' : 'info'
  // }
  var playSelectedFile = function (event) {
    var file = this.files[0];
    var videoNode = document.querySelector('video');

    var fileURL = URL.createObjectURL(file)
    videoNode.src = fileURL;
    load_question(file.name);
      $("#panel-body-question").show("slow");
  };
  var inputNode = document.querySelector('input');
  inputNode.addEventListener('change', playSelectedFile, false)

})()

d3.select("#video_selector").on("input", function () {
    d3.select("#mySelect").html("");
    // d3.select("#chart-div-labels").html("");
    // d3.select("#chart-div").html("");
    // d3.select("#component-score-div").select(".panel-body").html("");
    d3.select("#component-score").html("");
    d3.select("#answer").html("");
    d3.selectAll('.list-group-item').remove();
    d3.selectAll('.explanation-options').remove();
});

d3.select("#mySelect").on("input", function () {
    d3.select("#chart-div-labels").html("");
    d3.select("#chart-div").html("");
    d3.select("#answer").html("")
    d3.selectAll('.list-group-item').remove();
    d3.selectAll('.explanation-options').remove();
})

//to load the video specific data,questions and answers
var flag_que=0;
function load_question(vid){
    var x = document.getElementById("mySelect");
    var time=[];
    var explanations=[];
    var associations = [];
    var all_start=[];
    var all_end=[];

    var querySelect = d3.select("#mySelect");
    // CLICK TO SEE THE RESULTS OF THE QUESTIONS AS WELL AS THE EXPLANATIONS
    querySelect.on("change",function(d){

        $("#explanation-div").show("slow");

        var x = document.getElementById("mySelect");
        var div= document.getElementById("answer");

        div.innerHTML=x.options[x.selectedIndex].value;

        console.log(all_start)

        d3.select("#chart-div-labels").html("");
        console.log("jhbfj")
        console.log(explanations[x.selectedIndex])
        segment_buttons(all_start[x.selectedIndex],all_end[x.selectedIndex],explanations[x.selectedIndex],associations[x.selectedIndex],flag_que);
        
        if(flag_que>0){

        clear_list(flag_que);
        clear_segment();
      }

      flag_que++;

    });

    var questions;

    var file='assets/data/video_new.json';

    //FILLING EXPLANATIONS AND ASSOCIATIONS FOR ALL THE QUESTIONS RELATED TO THIS VIDEO
    d3.json(file, function(data){
      for(var i=0;i<data.length;i++)
      {
        if(data[i].videoName==vid)
        {
           var len=data[i].listOfQuestions.length;

           var exp=[];
           var assc=[];

           for(var j=0;j<len;j++)
           {
               var currentQuestion=data[i].listOfQuestions[j];
               var option = document.createElement("option");
               var ans = currentQuestion.computerAnswer.toLowerCase();
               ans = ans.charAt(0).toUpperCase() + ans.slice(1);

               option.text = currentQuestion.questionText;
               option.value= ans;
               x.add(option);

               var len3=currentQuestion.listOfKeyFrames.length;

               var start=[];
               var end=[];
               var temp3=[];
               var temp4=[];

               for(var f=0;f<len3;f++)
              {

               time[j]=currentQuestion.listOfKeyFrames.startTime;

               var len2=currentQuestion.listOfKeyFrames[f].textExplanations.length;
               var temp2=[];
               var listOfProbabilities = [];
               for(var k=0; k<len2;k++)
               {
                 var temp={};

                 // explanations data
                 temp.action=data[i].listOfQuestions[j].listOfKeyFrames[f].textExplanations[k].activity;
                 temp.object=data[i].listOfQuestions[j].listOfKeyFrames[f].textExplanations[k].object;
                 temp.location=data[i].listOfQuestions[j].listOfKeyFrames[f].textExplanations[k].location;
                 temp.accuracy=data[i].listOfQuestions[j].listOfKeyFrames[f].textExplanations[k].approximation;

                 temp2.push(temp);

               }

                 start.push(data[i].listOfQuestions[j].listOfKeyFrames[f].startTime);
                 end.push(data[i].listOfQuestions[j].listOfKeyFrames[f].endTime)

               temp3.push(temp2);
               temp4.push(currentQuestion.listOfKeyFrames[f].associatedFeatures);

          }

               all_start.push(start);
               all_end.push(end);
               explanations.push(temp3);
               associations.push(temp4);

  
        }
 
        }
      }
    });
}

// function change_video_time(time)
// {
                 

// var vid=document.getElementById("video");
// console.log(video.currentTime);

// video.currentTime=time*100;

// }