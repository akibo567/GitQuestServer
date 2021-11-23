const express = require('express')
const app = express()
const port = 3000



const Filedata = require('./filedata.js');
const fs = require('fs');
const dir_path = "./Localrepo";
const proj_name = "OpenCorePkg";

var res_string = "[";


app.get("/", (req, res, next) => {
    // アクセスログ
    console.log(req.method, req.url) 
    // jsonを返す
    //res.json(require('./responce.json'))
    res.header('Content-Type', 'application/json; charset=utf-8')

    var obj_list =[];
    res_string = "[";


    files = fs.readdirSync(dir_path + "/" + proj_name);
    files.forEach(function(file_name){ 
        let obj = new Filedata();
        var fullPath = dir_path + '/'+ proj_name+ '/'+ file_name; // フルパスを取得
        var stats = fs.statSync(fullPath) // ファイル（またはフォルダ）の情報を取得
        obj.name = file_name;
        obj.path = fullPath;

        if(stats.isDirectory()){ // フォルダの場合
            //getFiles(fullPath); // getFilesを再帰的に呼び出し
        }else{ // ファイルの場合
            // ファイル情報を取得
            text = file_name // ファイル名
                + ',' + stats.size // ファイルサイズ：単位バイト
                + ',' + stats.birthtime.getFullYear() + '/' // ファイル作成日：年
                + ('0' + (stats.birthtime.getMonth() + 1)).slice(-2) + '/' // ファイル作成日：月
                + ('0' + stats.birthtime.getDate()).slice(-2) // ファイル作成日；日
                + '\n'; 
            console.log(text);
            obj.size = stats.size;
        }
        obj_list.push(obj);
    });

    //console.log(flst);
    obj_list.forEach(function(obj){
        res_string += "\n"+obj.return_json() + ",";
    });


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