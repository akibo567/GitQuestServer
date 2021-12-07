const express = require('express')
const cors = require('cors');
const { execSync } = require('child_process')
const path = require('path');
const app = express()
const port = 3000



const Filedata = require('./filedata.js');
const fs = require('fs');
const { ifError } = require('assert');
const dir_path = "./Localrepo";


 var obj_list = [];
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

    obj_list =[];

    let mode = req.query.mode;
    let proj_name = req.query.repo;
    let proj_name2 = req.query.repo2;

    let proj_path = req.query.path ? req.query.path + "/" : "";

    obj_list = get_File_Metrix(proj_name,proj_path,0)

    if(mode == "l_r_diff"){
        get_File_Metrix(proj_name2,proj_path,1)
    }
 
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

//あるディレクトリのファイルメトリクスの取得
function get_File_Metrix(proj_name,proj_path,comp_mode = 0){
    let temp_obj_list =[];

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
                obj.coc = 0;
                var func_line = file_text.match(/[a-zA-Z0-9]+[ \t\r\n]+[a-zA-Z0-9]+[ \t\r\n]*\([a-zA-z0-9 \t\r\n,]*\)[ \t\r\n]*\{/gi);
                if(func_line){
                    obj.foc = func_line.length;
                }else{
                    obj.foc = 0;
                }
            }else if(obj.ext == "cpp"){
                var class_line = file_text.match(/class +[a-zA-Z0-9]+[ a-zA-Z0-9]*[\t\r\n]*\{/gi);
                if(class_line){
                    obj.coc = class_line.length;
                }
                var func_line = file_text.match(/[a-zA-Z0-9]+[ \t\r\n]+[a-zA-Z0-9]+[ \t\r\n]*\([a-zA-z0-9 \t\r\n,]*\)[ \t\r\n]*\{/gi);
                if(func_line){
                    obj.foc = func_line.length;
                }else{
                    obj.foc = 0;
                }
            }else if(obj.ext == "java"){
                var class_line = file_text.match(/class +[a-zA-Z0-9]+[ a-zA-Z0-9]*[\t\r\n]*\{/gi);
                if(class_line){
                    obj.coc = class_line.length;
                }
                //todo 予約語を除外する
                var func_line = file_text.match(/[a-zA-Z0-9]+[ \t\r\n]+[a-zA-Z0-9]+[ \t\r\n]*\([a-zA-z0-9 \t\r\n,]*\)[ \t\r\n]*\{/gi);
                    if(func_line){
                        obj.foc = func_line.length;
                    }else{
                        obj.foc = 0;
                    }
            }
            //split('\n').length
        }
        if(comp_mode == 1){
            match = false;
            obj_list.forEach(function(old_obj){ 
                if(obj.name == old_obj.name){
                    match = true;
                    old_obj.diff_loc = obj.loc - old_obj.loc;
                    old_obj.diff_coc = obj.coc - old_obj.coc;
                    old_obj.diff_foc = obj.foc - old_obj.foc;
                    old_obj.new_loc = obj.loc;
                    old_obj.new_coc = obj.coc;
                    old_obj.new_foc = obj.foc;
                    old_scale_k = get_code_scale_score_k(old_obj.loc,old_obj.foc);
                    new_scale_k = get_code_scale_score_k(obj.loc,obj.foc);

                    if(old_scale_k == new_scale_k){
                        old_obj.new_created = 0;
                    }else if(new_scale_k < old_scale_k){
                        old_obj.new_created = -1;
                    }else{
                        old_obj.new_created = 1;
                    }
                    old_obj.code_scale_diff_score = get_code_scale_score(Math.abs(old_obj.diff_loc),Math.abs(old_obj.diff_foc));
                }
            });
            if(!match){
                obj.code_scale_diff_score = get_code_scale_score(obj.loc,obj.foc);
                obj.new_created = 2;
                obj_list.push(obj);
            }
        }else{
            obj.new_created = -2;
            temp_obj_list.push(obj);
        }
    });
    return temp_obj_list;
}

//K値を計算する
function get_code_scale_score_k(loc,foc){
        return 1 + loc + foc * 10;
}

//コードの大きさのスコアを計算する
function get_code_scale_score(loc,foc){
    if(!(foc > 0)){
        if(loc > 2000){
            return 8;
        }else if(loc >= 1000){
            return 7;
        }else if(loc >= 300){
            return 6;
        }else if(loc >= 100){
            return 5;
        }else if(loc >= 30){
            return 4;
        }else if(loc >= 11){
            return 3;
        }else if(loc >= 4){
            return 2;
        }else if(loc >=1){
            return 1;
        }else{
            return 0;
        }
    } else{
        k = get_code_scale_score_k(loc,foc);
        kk = Math.floor(2 * Math.log10(k));
        if(kk > 8)kk = 8;
        return kk;
    }
}