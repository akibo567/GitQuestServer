// ルーティングモジュールを呼び出し
var router = require("express").Router();


const fs = require('fs');
const path = require('path');
const { ifError } = require('assert');

const dir_path = "./Localrepo";
const gdata_path = "./Gamedata";

const Filedata = require('./filedata.js');


var obj_list = [];

// routerに関わらず、アクセス日時を出力するミドルウェア
/*router.use((req, res, next) => {
    ///console.log((new Date()).toISOString());
    //next();
});*/


router.get("/", (req, res, next) => {
    let mode = req.query.mode;
    let proj_name = req.query.repo;
    let proj_name2 = req.query.repo2;
    let proj_path = (req.query.path && req.query.path != "/") ? req.query.path + "/" : "";

    if(mode == "l_r_diff"){
        res.json(require('../Gamedata/'+proj_name+ '+' + proj_name2 + '/' + proj_path + 'index.json'))
    }else{
        res.json(require('../Gamedata/'+proj_name+ '/' + proj_path + 'index.json'))
    }
});

router.get("/repo_data", (req, res, next) => {
    let mode = req.query.mode;
    let proj_name = req.query.repo;
    let proj_name2 = req.query.repo2;

    if(mode == "l_r_diff"){
        res.json(require('../Gamedata/'+proj_name+ '+' + proj_name2 + '/repo_data.json'))
    }else{
        res.json(require('../Gamedata/'+proj_name+ '/repo_data.json'))
    }
});




module.exports = router;