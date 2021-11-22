const express = require('express')
const app = express()
const port = 3000
const Filedata = require('./filedata.js');


// http://localhost:3000/ でresponce.jsonの中身を返す。
app.get("/", (req, res, next) => {
    // アクセスログ
    console.log(req.method, req.url) 
    // jsonを返す
    //res.json(require('./responce.json'))
    res.header('Content-Type', 'application/json; charset=utf-8')
    let res_string = "[";
    res_string += '{ "message": "hello world!" },';
    //res.send('{ "message": "hello world!" }')
    for (let i = 0; i < 9; i++) {
        obj = new Filedata();
        res_string += ",\n"+obj.return_json();
        //rest_string += JSON.stringigy(obj);
    }

    res_string += "]";
    res.send(res_string);

});

app.post('/pst', function(req, res) {
    // リクエストボディを出力
    console.log(req.body);
    // パラメータ名、nameを出力
    console.log(req.body.name);

    res.send('POST request to the homepage');
})

// ポート3000でサーバ起動
app.listen(port, () => console.log(`click http://localhost:${port}/ !`))