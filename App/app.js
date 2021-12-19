var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const cors = require('cors');


var port = process.env.PORT || 3000;

/*var router = require('./routes/v1/');
app.use('/api/v1/', router);*/
//app.use('/api/v1/', router);*/
app.use(cors({
    origin: 'http://localhost:8080', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}));

app.use("/contents", require("./contents.js"))
app.use("/create_contents", require("./create_contents.js"))




//サーバ起動
app.listen(port);
console.log('listen on port ' + port);