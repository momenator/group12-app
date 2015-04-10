module.exports = function (imageCollection, tagCollection){
    
    var express = require('express');
    var path = require('path');
    var favicon = require('serve-favicon');
    var logger = require('morgan');
    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var exphbs  = require('express-handlebars');
    var routes = require('./routes/index')(imageCollection, tagCollection);

    var app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));

    app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
    app.set('view engine', 'handlebars');
    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/images/bl-logo.jpg'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));


    app.get('/', routes.getHomePage);
    app.get('/search', routes.getSearchPage);
    app.post('/search', routes.postSearchByTitlePage );
    app.get('/searchTags', routes.getSearchPage );
    app.post('/searchTags', routes.postSearchByTagPage );
    app.get('/searchTags/:query', routes.postSearchByTagPage );
    app.get('/search/:imageid', routes.getImagePage);
    app.get('/search/random', routes.getImagePage);
    app.get('/stats' , routes.getStatsPage);

    // Restful APIs
    app.get('/api/getCoOccuringTags/:tagName', routes.RestAPIgetCoOccurringTags);
    app.get('/api/getImagesByTitle/:title', routes.RestAPIpostSearchByTitle);
    app.get('/api/getImagesByTag/:tag', routes.RestAPIpostSearchByTag);
    app.get('/api/getImagesByID/:imageid', routes.RestAPIpostSearchByTag);
    app.get('/api/getStatistics', routes.RestAPIgetStatistics);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


    return app;
}
