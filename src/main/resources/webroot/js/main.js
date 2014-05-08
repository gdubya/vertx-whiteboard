function init(){
    var eb = new vertx.EventBus('http://localhost:8181/bus');
    var uuid = Math.random().toString(36).slice(2).substring(0, 6);

    eb.onopen = function() {
        window.app = new WhiteboardApp(eb, uuid);

        eb.registerHandler('whiteboard', function(message) {
            var msg = JSON.parse(message);
            var fromOutside = msg.uuid !== uuid;
            if (fromOutside) {
                if (msg.type === 'clear') {
                    window.app.clear(fromOutside);
                } else if (msg.type === 'draw') {
                    window.app.draw(msg.x, msg.y, 8, msg.colour, fromOutside);
                } else {
                    console.log("Unknown type: " + msg.type);
                }
            }
        });

    }
    $("#whiteboard").on("vmousemove", function(event) {
        if (window.app.drawOn) {
            var x = event.pageX;
            var y = event.pageY - $("canvas").offset().top;
            window.app.draw(x, y, window.app.size, window.app.colour);
        }
        event.preventDefault();
    });
    $("#whiteboard").on("vmousedown", function(event) {
        var x = event.pageX;
        var y = event.pageY - $("canvas").offset().top;
        window.app.draw(x, y, window.app.size, window.app.colour);
        window.app.drawOn = true;
    });
    $("#whiteboard").on("vmouseup", function(event) {
        window.app.drawOn = false;
    });
    $("#whiteboard").bind("tap", function(event) {
        event.preventDefault();
    });
    $(window).resize(function() { resize(); });
    resize();
}

var resize = function() {
    var winSize = {
        width: window.innerWidth || document.body.clientWidth,
        height: window.innerHeight || document.body.clientHeight
    };
// make canvas fill space under header
    $("canvas").css("top", $("#header").innerHeight() + "px");
    $("canvas")[0].width = winSize.width;
    $("canvas")[0].height = winSize.height - $("#header").innerHeight();
}