var fs = require('fs');
var page = require('webpage').create();
page.viewportSize = { width: 1920, height: 1080 };

//##################### DEFAULT VALUE #########################################
// You can modify them if you need/want to.
var url = './index.html'; //URL of the html page where the <svg> tag with id="svg" that we want to record is.
var nb_seconds = 2; // Number of seconds the script will record svg.
var framerate = 48; // The number of svg per second the script will try to record.
var base_directory = "./images" // The directory where the svg files will be written.


//###################### FUNCTIONS ############################################
function pad (str, max) {
  str = str.toString();
  return str.length < max ? pad("0" + str, max) : str;
}

function getSVG()
{
    return page.evaluate(function(){
        var serializer = new XMLSerializer();
        var element = document.getElementById("svg");
        return serializer.serializeToString(element)
    });
}

//##################### MAIN PROGRAM ##########################################


var xml = "";
var frame = "";
page.onInitialized = function() {
    page.onCallback = function(data) {
        // Initial frame
        frame = 0;
        setInterval(function() {
            xml = getSVG();    

            fs.write(base_directory+"/image_"+pad(frame, 3)+".svg"
                    ,"<?xml version=\"1.0\"?>"+xml,
                    "w");

            if(frame >= nb_seconds*framerate)
            {
                phantom.exit();
            }
            frame++;
        }, 1000/framerate);
    };
    page.evaluate(function() {
        document.addEventListener('DOMContentLoaded', function() {
            window.callPhantom();
        }, false);
        console.log("Added listener to wait for page ready");
    });
};

page.open(url , function () {});
