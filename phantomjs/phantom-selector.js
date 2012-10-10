var system = require('system');
var webPage = require('webpage').create();
var scriptName = system.args[0];
var url = system.args[1];
var selector = system.args[2];

webPage.open( url, function(status){
    webPage.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js", function(){
        var elementData = webPage.evaluate(function (selector) {
            var $nodes = $(selector);
            return $nodes.map(function(){
                var $node = $(this);
                var coords = $node.offset();
                coords.width = $node.outerWidth();
                coords.height = $node.outerHeight();
                return coords;
            }).get().slice(0, 10);
        }, selector);

        elementData.forEach(function(data, i){
            var file = "selection_" + i + ".png";
            console.log("Rendering:", file);
            webPage.clipRect = data;
            webPage.render(file);
        });

        console.log(elementData.length + " screenshots taken");
        phantom.exit(0);
    });
});