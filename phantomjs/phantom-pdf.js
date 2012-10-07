/*globals require, phantom, console */
var system = require('system'),
    WebPage = require('webpage'),
    PDFExport;

//main export object for handling command line args and rendering html pages
PDFExport = {
    requiredArgs:[
        'script',
        'url',
        'filename',
        'zoomFactor',
        'headerHeight',
        'footerHeight' ,
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'orientation',
        'format',
        'header',
        'footer'
    ],
    settings:{},
    init: function(args){
        var paperSize;
        this._validateArgs(args);
        this.settings = this._getSettings(args);
        this.webPage = this._getWebPage();
    },
    print:function(){
        var self = this,
            settings = self.settings,
            url = settings.url,
            filename = settings.filename,
            webPage = self.webPage;

        console.log("Loading " + url);
        //open the url and call _onWebPageOpen when it is open
        webPage.open( url, function(status){
            //if the web page opens successfully lets do some exporting
            //otherwise lets exit phantomjs
            if ( status !== 'success') {
                console.log("Unable to load " + url);
                phantom.exit(5);
            }

            if ( self._isErrorPage() ) {
                console.log("Error page loading " + url);
                phantom.exit(6);
            }

            console.log("Successfully loaded " + url);
            console.log("Rendering pdf to " + filename);
            webPage.render(filename);

            //release the memory from the webPage
            webPage.release();
            phantom.exit(0);
        });
    },
    _validateArgs:function(args){
        var requiredArgs,
            len,
            apiMsg,
            i;

        if (args.length !== 14) {
            requiredArgs = this.requiredArgs,
            len = requiredArgs.length;
            console.log("Argument Count: " + args.length);
            apiMsg = "Usage: " + args[0];
            for(i = 1; i < len; i++){
                apiMsg += (" <" + requiredArgs[i] + ">");
            }
            console.log(apiMsg);
            phantom.exit(1);
        }
    },
    _getSettings: function(args){
        var settings = {},
            i = 0,
            requiredArgs = this.requiredArgs,
            len = requiredArgs.length;

        for(; i < len; i++ ){
            console.log(requiredArgs[i] + ": " + args[i]);
            settings[requiredArgs[i]] = args[i];
        }

        if(settings.filename.substring(-4).toLowerCase() !== ".pdf"){
            settings.filename += ".pdf";
        }

        settings.zoomFactor = parseFloat(settings.zoomFactor);

        return settings;
    },
    _getWebPage: function(){
        //setup WebPage instance
        var webPage = WebPage.create();

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
            console.log("WebPage Console: " + msg);
        };

        //set print options
        webPage.paperSize = this._getPaperSize();
        webPage.zoomFactor = this.settings.zoomFactor;
        return webPage;
    },
    _getPaperSize: function(){
        var settings = this.settings;

        return {
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
    },
    _isErrorPage:function(){
        return this.webPage.evaluate(function(){
            var body = document.querySelector("body"),
                bodyID = body.id,
                errorMsg = "errorPage";

            return !!(bodyID && bodyID.substr(bodyID.length - errorMsg.length) === errorMsg);
        });
    }
};

PDFExport.init(system.args);
PDFExport.print();