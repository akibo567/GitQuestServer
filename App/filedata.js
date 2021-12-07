class Filedata {
    constructor() {
        this.name = "Filename";
        this.path = "Hogefolder/filename";
        this.sha = "sha";
        this.size = 0;
        this.type = "file";
        this.birthtime = "";
        this.atime = 0;
        this.mtime = 0;
        this.ext = "";
        this.loc = 0;
        this.coc = 0;
        this.foc = 0;
        this.diff_loc = 0;
        this.diff_coc = 0;
        this.diff_foc = 0;
        this.new_created = 0;
        this.code_scale_score = 0;
        this.code_scale_diff_score = 0;
        this.new_loc = 0;
        this.new_coc = 0;
        this.new_foc = 0;
    }
}

module.exports = Filedata;
