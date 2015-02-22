var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);
 
app.use(function(req,res){
	res.type('text/plain');
	res.status(404);
	res.send('Error 404 - Not Found');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('text/plain');
	res.status(500);
	res.send('Error 505 - Server Error');
});

app.listen(app.get('port'), function(){
	console.log('App running on port ' + app.get('port') );
});
