class Filedata {
    constructor() {
        this.name = "Filename";
        this.path = "Hogefolder/filename";
        this.sha = "aaaaaaaaa";
        this.size = 810;
        this.type = "file";
        this.birthtime = "";
    }
    return_json() {
        let res = "{\n\tname: "+ this.name+ ",\n"
        +"\tpath: " + this.path+ ",\n"
        //+"\tsha:" + this.sha+ ",\n"
        +"\tsize: " + this.size+ ",\n"
        +"\ttype: " + this.type+ "\n"
        + "}";

        return res;
    }
}

module.exports = Filedata;
