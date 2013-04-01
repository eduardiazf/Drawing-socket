var Draw = {};

Draw.Events = (function (undefined) {
    'use strict';
    var isTouchSupported = 'ontouchstart' in window;

    return {
        startEvent : isTouchSupported ? 'touchstart' : 'mousedown',
        moveEvent  : isTouchSupported ? 'touchmove' : 'mousemove',
        endEvent   : isTouchSupported ? 'touchend' : 'mouseup'
    };
}());

Draw.Drawing = (function (undefined) {
    'use strict';

    var canvas,
        context,
        init,
        assignEvents,
        _beginPaint,
        paint,
        paintEnd,
        socket,
        move,
        clearPaint;

    clearPaint = function () {
        context.clearRect(0,0,500,500);
    };

    move = function (coord) {
        return {
            x : coord.offsetX || coord.pageX,
            y : coord.offsetY || coord.pageY
        };
    };

    paint = function (moveX, moveY) {
        context.beginPath();
        context.arc(moveX, moveY, 4, (Math.PI/180)*0, (Math.PI/180)*360, false);
        context.fill();
        context.closePath();
    };

    assignEvents = function () {
        canvas.addEventListener(Draw.Events.startEvent, function (evt) {
            _beginPaint = true;
            socket.emit('paint', move(evt));
        }, false);

        canvas.addEventListener(Draw.Events.moveEvent, function (evt) {
            if (_beginPaint) {
                socket.emit('paint', move(evt));
            }
        }, false);

        canvas.addEventListener(Draw.Events.endEvent, function (evt) {
            _beginPaint = false;
        }, false);

        document.getElementById('reset').addEventListener('click', function () {
            socket.emit('clearPaint');
            e.preventDefault();
        });
    };

    init = function () {
        canvas      = document.getElementById('drawing');
        context     = canvas.getContext('2d');
        _beginPaint = false;
        socket      = io.connect();

        assignEvents();

        socket.on('paint', function (move) {
            paint(move.x, move.y);
        });

        socket.on('clearPaint', function () {
            clearPaint();
        });
    };

    return {
        init: init
    };

}());

window.addEventListener('load', function () {
        Draw.Drawing.init();
}, false);
