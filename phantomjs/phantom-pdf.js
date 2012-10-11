/*globals require, phantom, console */
var system = require('system');
var webPage = require('webpage').create();

//main export object for handling command line args and rendering html pages
var requiredArgs = [
    'script', 'url', 'filename', 'zoomFactor', 'headerHeight',
    'footerHeight' , 'marginTop', 'marginRight','marginBottom',
    'marginLeft', 'orientation', 'format', 'header', 'footer'
];

if(system.args.length !== requiredArgs.length){
    var msgs = requiredArgs.map(function(arg){
        return "<" + arg + ">";
    });

    msgs[0] = system.args[0];
    console.log("Usage: " + msgs.join(" "));
    phantom.exit(1);
}

var settings = {};

requiredArgs.forEach(function(value, i){
    settings[requiredArgs[i]] = system.args[i];
});

//set print options
webPage.paperSize = {
    header: {
        height: settings.headerHeight,
        contents: phantom.callback(function(pageNum, numPages) {
            var header = settings.header.replace("#pageNum#", pageNum);
            return header.replace("#numPages#", numPages);
        })
    },
    footer: {
        height: settings.footerHeight,
        contents: phantom.callback(function(pageNum, numPages) {
            var footer = settings.footer.replace("#pageNum#", pageNum);
            return footer.replace("#numPages#", numPages);
        })
    },
    margin: {
        top: settings.marginTop,
        right: settings.marginRight,
        bottom: settings.marginBottom,
        left: settings.marginLeft
    },
    orientation: settings.orientation,
    format: settings.format
};

webPage.zoomFactor = parseFloat(settings.zoomFactor);

webPage.open( settings.url, function(status){
    //if the web page opens successfully lets do some exporting
    //otherwise lets exit phantomjs
    if ( status !== 'success') {
        console.log("Unable to load " + settings.url);
        phantom.exit(5);
    }

    if(settings.filename.substring(-4).toLowerCase() !== ".pdf"){
        settings.filename += ".pdf";
    }

    webPage.render(settings.filename);
    phantom.exit(0);
});