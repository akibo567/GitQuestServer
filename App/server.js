const express = require('express')
const cors = require('cors');
const { execSync } = require('child_process')
const path = require('path');
const app = express()
const port = 3000



const Filedata = require('./filedata.js');
const fs = require('fs');
const dir_path = "./Localrepo";



app.use(cors({
    origin: 'http://localhost:8080', //アクセス許可するオリジン
    credentials: true, //レスポンスヘッダーにAccess-Control-Allow-Credentials追加
    optionsSuccessStatus: 200 //レスポンスstatusを200に設定
}));


app.get("/contents", (req, res, next) => {
    // アクセスログ
    console.log(req.method, req.url) 

    //ヘッダ
    res.header('Content-Type', 'application/json; charset=utf-8')

    let obj_list =[];

    let proj_name = req.query.repo;
    let proj_path = req.query.path ? req.query.path + "/" : "";




    files = fs.readdirSync(dir_path + "/" + proj_name + "/"+ proj_path);
    files.forEach(function(file_name){ 
        let obj = new Filedata();
        let fullPath = dir_path + '/'+ proj_name+ "/"+ proj_path +file_name; // フルパスを取得
        let stats = fs.statSync(fullPath) // ファイル（またはフォルダ）の情報を取得
        let line_list = [];
        let file_text ="";
        obj.name = file_name;
        obj.path = proj_path +file_name;
        obj.size = stats.size;
        obj.atime = stats.atime;
        obj.mtime = stats.mtime;


        if(stats.isDirectory()){ // フォルダの場合
            //getFiles(fullPath); // getFilesを再帰的に呼び出し
            obj.type = "dir";
        }else{ // ファイルの場合
            // ファイル情報を取得
            /*text = file_name // ファイル名
                + ',' + stats.size // ファイルサイズ：単位バイト
                + ',' + stats.birthtime.getFullYear() + '/' // ファイル作成日：年
                + ('0' + (stats.birthtime.getMonth() + 1)).slice(-2) + '/' // ファイル作成日：月
                + ('0' + stats.birthtime.getDate()).slice(-2) // ファイル作成日；日
                + '\n'; 
            console.log(text);*/
            let file_data = fs.readFileSync(fullPath);

            obj.type = "file";
            obj.ext = path.extname(file_name).slice(1);

            file_text = file_data.toString();
            line_list = file_text.split('\n');
            obj.loc = line_list.length;
            if(obj.ext == "c"){
                obj.coc = 10;
            }else if(obj.ext == "java"){
                var class_line = file_text.match(/class +[a-zA-Z0-9]+[ a-zA-Z0-9]*[\t\r\n]*\{/gi);
                if(class_line){
                    obj.coc = class_line.length;
                }
                var func_line = file_text.match(/[a-zA-Z0-9]+ +[a-zA-Z0-9]+\([a-zA-z0-9 ,]*\)[ \t\r\n]*\{/gi);
                if(func_line){
                    obj.foc = func_line.length;
                }
            }
            //split('\n').length
        }
        obj_list.push(obj);
    });

    res.send(obj_list);
});

app.get("/json_test", (req, res, next) => {
    res.json(require('../responce.json'))
});

app.get("/command_test", (req, res, next) => {
    stdout = execSync('ls -a')
    console.log(`stdout: ${stdout.toString()}`)
    res.send(`stdout: ${stdout.toString()}`)
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