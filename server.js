var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app),
    io      = require('socket.io').listen(server),
    path    = require('path');

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', function (req, res) {
    res.render('index.jade', {layout: false});
});

io.on('connection', function (client) {

    client.on('paint', function (position) {
        io.sockets.emit('paint', position);
    });

    client.on('clearPaint', function () {
        io.sockets.emit('clearPaint');
    });
});

server.listen(app.get('port'), function () {
    console.log('Server startup on port ->', app.get('port'));
});