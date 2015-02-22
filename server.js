var express = require('express');

var app = express();

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
	console.log('App running on port ' + app.get('port') );
});
