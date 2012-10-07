var system = require('system');
var webPage = require('webpage').create();
var scriptName = system.args[0];


if(system.args.length != 2){
    console.log("Usage: phantomjs " + scriptName + " <url>");
    phantom.exit(1);
}

var testUrl = system.args[1];

//if there is a javascript in the webpage runtime
webPage.onError = function(msg, trace){
    //if there is a run time error in the loaded page, log it
    console.log("Error on the page: " + msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

//echo any of the console logs that happen in the headless browser out to phantomjs
//in order to see the conole messages in the command line
webPage.onConsoleMessage = function(msg){
    console.log(msg);
};


webPage.viewPortSize = {
    width: 980,
    height: 1000
};

webPage.open( url, function(status){

    //if the web page opens successfully lets do some exporting
    //otherwise lets exit phantomjs
    if ( status !== 'success') {
        console.log("Unable to load " + url);
        phantom.exit(2);
    }

    setInterval(function() {
        isComplete = webPage.evaluate(function (e) {
            var bannerClasses = document.getElementById('qunit-banner').className;
            var hasFailedClass = bannerClasses.indexOf('qunit-fail') !== -1;
            var hasPassedClass = bannerClasses.indexOf('qunit-pass') !== -1;

            if( !hasFailedClass && !hasFailedClass ){
                return false;
            }else if(hasFailedClass){
                return "failed";
            } else {
                return "passed";
            }

        });

        if(isComplete){
            if(isComplete === "failed"){
                console.log("Tests failed");
                phantom.exit(3);
            }

            console.log("GGGEEEYYYAAAAAH BOYYY!");
            phantom.exit(0);
        }
    }, 100);
});