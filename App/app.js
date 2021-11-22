var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

/*var router = require('./routes/v1/');
app.use('/api/v1/', router);*/
//app.use('/api/v1/', router);*/


//サーバ起動
app.listen(port);
console.log('listen on port ' + port);