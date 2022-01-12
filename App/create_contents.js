// ルーティングモジュールを呼び出し
var router = require("express").Router();


const fs = require('fs');
const path = require('path');
const { ifError } = require('assert');

const dir_path = "./Localrepo";
const gdata_path = "./Gamedata";

const Filedata = require('./filedata.js');


var obj_list = [];
var next_dir_list = [];

var proj_name;
var proj_name2;
var proj_dir_name;

var proj_file_number = 0;
var proj_big_metrix_list = {};

var CollectOnlyProgramFile = false;
var IgnoreDotFile = false;


var mode;

// routerに関わらず、アクセス日時を出力するミドルウェア
/*router.use((req, res, next) => {
    ///console.log((new Date()).toISOString());
    //next();
});*/



router.post("/", (req, res, next) => {
    // アクセスログ
    console.log(req.method, req.url) 
    console.log(req.body) 


    //ヘッダ
    res.header('Content-Type', 'application/json; charset=utf-8')

    obj_list =[];

    mode = req.body.mode;
    proj_name = req.body.repo;
    proj_name2 = req.body.repo2;
    CollectOnlyProgramFile = req.body.CollectOnlyProgramFile;
    IgnoreDotFile = req.body.IgnoreDotFile;


    let proj_path = req.body.path ? req.body.path + "/" : "";


    if(mode == "l_r_diff"){
        proj_dir_name = proj_name + "+" + proj_name2;
    }else{
        proj_dir_name = proj_name;
    }

    console.log("Cleaning old "+proj_dir_name + "...");
    try{
        fs.rmSync(gdata_path + "/" + proj_dir_name, { recursive: true }, (err) => {
            //if (err) throw err;
        });
    }catch(e){

    }
    
    console.log("Done");
    console.log("Generating new "+proj_dir_name + "...");

    CreateGameDataJson(proj_path);

    console.log("Done");

    res.statusCode = 200;
    res.send("Done");
});

//あるディレクトリのファイルメトリクスの取得
function get_File_Metrix(proj_name,proj_path,comp_mode = 0){
    let temp_obj_list =[];

    if(!fs.existsSync(dir_path + "/" + proj_name + "/"+ proj_path)){
        return temp_obj_list;
    }

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

        proj_file_number++;

        if(obj.name.charAt(0) == "." && IgnoreDotFile){
            return;
        }

        if(stats.isDirectory()){ // フォルダの場合
            //getFiles(fullPath); // getFilesを再帰的に呼び出し
            obj.type = "dir";
            next_dir_list[file_name] = 1;
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
                var Reserved_word = [
                    'auto','break','case','char','const','continue',
                    'default','do','double','else','enum','extern',
                    'float','for','goto','if','int','long','register',
                    'return','signed','sizeof','short','static','struct',
                    'switch','typedef','union','unsigned','void',
                    'volatile','while'];
                obj.coc = 0;
            }else if(obj.ext == "cpp"){
                var Reserved_word = [
                    'auto','break','case','char','const','continue',
                    'default','do','double','else','enum','extern',
                    'float','for','goto','if','int','long','register',
                    'return','signed','sizeof','short','static','struct',
                    'switch','typedef','union','unsigned','void',
                    'volatile','while','this','template','wchar_t',
                    'typeid','bool','true','false','dynamic_cast',
                    'reinterpret_cast','const_cast','static_cast',
                    'mutable','throw','try','catch','explicit','using',
                    'export','new','delete','namespace','inline',
                    'class','public','friend','protected','private',
                    'virtual','operator',];
                    var class_line = file_text.match(/class +[a-zA-Z0-9]+[ a-zA-Z0-9]*[\t\r\n]*\{/gi);
                    if(class_line){
                        obj.coc = class_line.length;
                    }
            }else if(obj.ext == "java"){
                var Reserved_word = ['abstract','continue','for','new','switch',
                    'assert','default','if','package','synchronized',
                    'boolean','do','goto','private','this',
                    'break','double','implements','protected','throw',
                    'byte','else','import','public','throws',
                    'case','enum','instanceof','return','transient',
                    'catch','extends','int','short','try',
                    'char','final','interface','static','void',
                    'class','finally','long','strictfp','volatile',
                    'const','float','native','super','while'];
                var class_line = file_text.match(/class +[a-zA-Z0-9]+[ a-zA-Z0-9]*[\t\r\n]*\{/gi);
                if(class_line){
                    obj.coc = class_line.length;
                }
            }

            if(obj.ext == "java" || obj.ext == "c" || obj.ext == "cpp"){
                //todo 予約語を除外する
                obj.foc = 0;
                obj.func_fields = [];
                var func_line = file_text.match(/[a-zA-Z0-9]+[ \t\r\n]+[a-zA-Z0-9]+[ \t\r\n]*\([a-zA-z0-9 \t\r\n,*=&?:<>@]*\)[ \t\r\n]*\{/gi);
                if(func_line){
                    func_line.forEach(function(line){
                        let not_rword = true; 
                        func_name = line.match(/[a-zA-Z0-9]+[ \t\r\n]*\(/i);
                        func_name = func_name[0].match(/[a-zA-Z0-9]+/i);
                        Reserved_word.forEach(function(rword){ 
                            if(rword.toLowerCase() == func_name[0].toLowerCase()){
                                not_rword = false;
                            }
                        });
                        if(not_rword){
                            obj.foc++;
                            obj.func_fields.push(func_name[0].toLowerCase());
                        }
                    });
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
                    old_scale_k = get_code_scale_score_k(old_obj.loc,old_obj.foc,old_obj.coc);
                    new_scale_k = get_code_scale_score_k(obj.loc,obj.foc,obj.coc);

                    if(old_scale_k == new_scale_k){
                        old_obj.new_created = 0;
                    }else if(new_scale_k < old_scale_k){
                        old_obj.new_created = -1;
                    }else{
                        old_obj.new_created = 1;
                    }
                    old_obj.code_scale_diff_score = get_code_scale_score(Math.abs(old_obj.diff_loc),Math.abs(old_obj.diff_foc),Math.abs(old_obj.diff_coc));
                    if(obj.ext == "java" || obj.ext == "c" || obj.ext == "cpp" || !(CollectOnlyProgramFile)){
                        proj_big_metrix_list[obj.path] = get_code_scale_score_k(Math.abs(old_obj.diff_loc),Math.abs(old_obj.diff_foc),Math.abs(old_obj.diff_coc));
                    }
                }
            });
            if(!match){
                obj.code_scale_diff_score = get_code_scale_score(obj.loc,obj.foc,obj.coc);
                if(obj.ext == "java" || obj.ext == "c" || obj.ext == "cpp" || !(CollectOnlyProgramFile)){
                    proj_big_metrix_list[obj.path] = get_code_scale_score_k(obj.loc,obj.foc,obj.coc);
                }
                obj.new_created = 2;
                obj_list.push(obj);
            }
        }else{
            if(!stats.isDirectory()){
                if(obj.ext == "java" || obj.ext == "c" || obj.ext == "cpp" || !(CollectOnlyProgramFile)){
                    proj_big_metrix_list[obj.path] = get_code_scale_score_k(obj.loc,obj.foc,obj.coc);
                }
            }
            obj.code_scale_diff_score = get_code_scale_score(obj.loc,obj.foc,obj.coc);
            obj.new_created = -2;
            temp_obj_list.push(obj);
        }
    });
    return temp_obj_list;
}

//K値を計算する
function get_code_scale_score_k(loc,foc,coc){
        return 1 + loc + foc * 10 + coc * 20;
}

//コードの大きさのスコアを計算する
function get_code_scale_score(loc,foc,coc){
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
        k = get_code_scale_score_k(loc,foc,coc);
        kk = Math.floor(2 * Math.log10(k));
        if(kk > 8)kk = 8;
        return kk;
    }
}

//指定ディレクトリのファイルを作成する（再帰的に）
function CreateGameDataJson(current_path){
    if(current_path == "" || current_path == "/"){
        proj_file_number = 0;
        proj_big_metrix_list = {};
    }
    fs.mkdirSync(gdata_path + "/" + proj_dir_name + "/" +current_path, (err) => {
        if (err) { throw err; }
    });
    
    next_dir_list = [];

    obj_list = get_File_Metrix(proj_name,current_path +'/',0)

    if(mode == "l_r_diff"){
        get_File_Metrix(proj_name2,current_path + '/',1)
    }
    
    let current_next_dir_list = next_dir_list;

    // 書き込み
    fs.writeFileSync(gdata_path + "/" + proj_dir_name + "/" +current_path + "/index.json", JSON.stringify(obj_list, null, '\t'), (err) => {
        if (err) throw err;
    });


    for (let dir_name in current_next_dir_list) {
        if(current_next_dir_list[dir_name] == 1){
            CreateGameDataJson((current_path != "") ? current_path + "/" + dir_name : dir_name)
        }
    }

    //リポジトリ全体のメトリクスを書き込み
    if(current_path == "" || current_path == "/"){
        //console.log(proj_big_metrix_list);
        sort_proj_big_metrix_list = Object.keys(proj_big_metrix_list).map((k)=>({ key: k, score: proj_big_metrix_list[k] }));

        //値段順
        sort_proj_big_metrix_list.sort((a, b) => b.score - a.score);

        //配列⇒オブジェクト　で元に戻す
        proj_big_metrix_list = Object.assign({}, ...sort_proj_big_metrix_list.map((item) => ({
            [item.key]: item.score,
        })));

        repo_data = {file_number : proj_file_number,big_metrix_list : sort_proj_big_metrix_list}
            // 書き込み
        fs.writeFileSync(gdata_path + "/" + proj_dir_name  + "/repo_data.json", JSON.stringify(repo_data, null, '\t'), (err) => {
            if (err) throw err;
        });
    }
}

module.exports = router;