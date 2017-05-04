var express = require('express'),
    path = require('path')
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var db = require('./model/db'),
    event = require('./model/events');

var routes = require('./routes/index'),
    events = require('./routes/events');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/events', events);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        console.error(err.stack);
        res.status(500).send('Something broke!');

    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.error(err.stack);
    res.status(500).send('Something broke!');

});

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    res.status(400);
    res.send('404: File Not Found');
});


module.exports = app;
