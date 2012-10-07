//phantom js provides us with a system module and webpage module

//the system module acts as a
var system = require('system');
var webPage = require('webpage').create();

//input from the command line is passed
//to the system module
scriptName = system.args[0];
url = system.args[1];

//make a request for the url
webPage.open( url, function(status){

    // a response has been received and the status is either
    // 'success' or 'fail'

    //let's start page scraping
    var imgSrcs = webPage.evaluate(function () {

        //we are now sandboxed and operating on the dom of the url
        //that was requested

        //Use the new Selectors API! Thanks webkit!
        var imgs = document.querySelectorAll('img');

        //Convert NodeList to Array
        imgs = Array.prototype.slice.call(this, 0);

        //Javascript 1.6 ahh that was easy
        return imgs.map(function(img){
            return img.src;
        });
    });

    // Use Javascript 1.6! webkit
    imgSrcs.forEach(function(src){
        //calling this will output to our console
        console.log(src);
    });

    //exit the script with a status of 0
    phantom.exit(0);
});