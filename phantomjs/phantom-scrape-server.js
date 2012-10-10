var server = require('webserver').create();
var WebPage = require('webpage');

service = server.listen(8080, function (request, response) {

    var querySplit = request.url.split("?");
    var queryString = querySplit[1];
    var url = unescape(queryString.split("=")[1]);
    var webPage = WebPage.create();

    webPage.open(url, function(status){

       var imgData = webPage.evaluate(function(){
            var imgs = document.querySelectorAll("img");

            imgs = Array.prototype.slice.call(imgs,0);

            return imgs.map(function(img){
                return{
                    src: img.src,
                    alt: img.alt,
                    title: img.title
                };
            });
        });

        webPage.release();
        response.statusCode = 200;
        response.headers = {
            'Content-Type': "text/javascript"
        };
        response.write(JSON.stringify(imgData, null, 4));
        response.close();
    });
});