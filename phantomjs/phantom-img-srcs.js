//phantom js provides us with a system module and webpage module
var system = require('system');
var webPage = require('webpage').create();

//input from the command line is passed
//to the system module
var scriptName = system.args[0];
var url = system.args[1];

//make a request for the url
webPage.open( url, function(status){

    // a response has been received and the status is either
    // 'success' or 'fail'

    //let's start page scraping
    var imgSrcs = webPage.evaluate(function () {

        var imgs = document.querySelectorAll('img');

        //Convert NodeList to Array
        imgs = Array.prototype.slice.call(imgs, 0);

        return imgs.map(function(img){
            return img.src;
        });
    });

    imgSrcs.forEach(function(src){
        //calling this will output to our console
        console.log(src);
    });

    //exit the script with a status of 0
    phantom.exit(0);
});