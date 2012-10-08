var system = require('system');
var webPage = require('webpage').create();
var scriptName = system.args[0];

if(system.args.length != 2){
    console.log("Usage: phantomjs " + scriptName + " <url>");
    phantom.exit(1);
}

var testFile = system.args[1];

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

webPage.open( testFile, function(status){

    //if the web page opens successfully lets do some exporting
    //otherwise lets exit phantomjs
    if ( status !== 'success') {
        console.log("Unable to load " + testFile);
        phantom.exit(2);
    }

    setInterval(function() {
        var isComplete = webPage.evaluate(function (e) {
            var bannerClasses = document.getElementById('qunit-banner').className;
            var failed = bannerClasses.indexOf('qunit-fail') !== -1;
            var passed = bannerClasses.indexOf('qunit-pass') !== -1;

            if( !failed && !passed ) return false;
            if(failed) return "failed";
            return "passed";
        });

        if(isComplete){
            if(isComplete === "failed"){
                console.log("Failed. You should probably drink a beer");
                phantom.exit(3);
            }

            console.log("Passed. You should probably drink a beer");
            phantom.exit(0);
        }
    }, 100);
});