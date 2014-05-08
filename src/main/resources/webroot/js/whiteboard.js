function WhiteboardApp(eventBus, uuid) {
    this.size = 8;
    var rint = Math.round(0xffffff * Math.random());
    this.colour = 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';
    this.drawOn = false;
    this.canvas = $("canvas")[0];
    this.eb = eventBus;
    this.uuid = uuid;
}

WhiteboardApp.prototype.draw = function(x, y, size, colour, fromOutside) {
    var context = this.canvas.getContext("2d");
    for (var i = 1; i <= size; i+=2) {
        context.save();
        context.beginPath();
        var alpha = 1.0 - Math.pow(i/size, 2);
        context.globalAlpha = alpha;
        context.strokeStyle = colour;
        context.arc(x, y, i, 0, 2*Math.PI);
        context.stroke();
        context.restore();
    }

    if (!fromOutside) {
        this.publishDraw(x, y, colour);
    }
}

WhiteboardApp.prototype.clear = function(fromOutside) {
    var context = this.canvas.getContext("2d");
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (!fromOutside) {
        this.publishClear();
    }
}

WhiteboardApp.prototype.publishDraw = function (x, y, colour) {
    var address = "whiteboard";
    var data = JSON.stringify({
        uuid: this.uuid,
        type: "draw",
        x: x,
        y: y,
        colour: colour
    });

    this.eb.publish(address, data);
}

WhiteboardApp.prototype.publishClear = function() {
    var address = "whiteboard";
    var data = JSON.stringify({
        uuid: this.uuid,
        type: "clear"
    });

    this.eb.publish(address, data);
}
