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
        let res = "{\n\tname:"+ this.name+ ",\n"
        +"\tpath:" + this.path+ ",\n"
        +"\tsha:" + this.sha+ ",\n"
        +"\tsize:" + this.size+ ",\n"
        +"\ttype:" + this.type+ "\n"
        + "}";

        return res;
    }
}

module.exports = Filedata;


/*
  {
    "name": ".shellcheckrc",
    "path": ".shellcheckrc",
    "sha": "bc119bdcafca653d1f548190f7f6a385ee7d26a5",
    "size": 45,
    "url": "https://api.github.com/repos/acidanthera/OpenCorePkg/contents/.shellcheckrc?ref=master",
    "html_url": "https://github.com/acidanthera/OpenCorePkg/blob/master/.shellcheckrc",
    "git_url": "https://api.github.com/repos/acidanthera/OpenCorePkg/git/blobs/bc119bdcafca653d1f548190f7f6a385ee7d26a5",
    "download_url": "https://raw.githubusercontent.com/acidanthera/OpenCorePkg/master/.shellcheckrc",
    "type": "file",
    "_links": {
      "self": "https://api.github.com/repos/acidanthera/OpenCorePkg/contents/.shellcheckrc?ref=master",
      "git": "https://api.github.com/repos/acidanthera/OpenCorePkg/git/blobs/bc119bdcafca653d1f548190f7f6a385ee7d26a5",
      "html": "https://github.com/acidanthera/OpenCorePkg/blob/master/.shellcheckrc"
    }
  },
  {
    "name": "AppleModels",
    "path": "AppleModels",
    "sha": "5c66789ca13edcce96bb99cb70293613663e13ad",
    "size": 0,
    "url": "https://api.github.com/repos/acidanthera/OpenCorePkg/contents/AppleModels?ref=master",
    "html_url": "https://github.com/acidanthera/OpenCorePkg/tree/master/AppleModels",
    "git_url": "https://api.github.com/repos/acidanthera/OpenCorePkg/git/trees/5c66789ca13edcce96bb99cb70293613663e13ad",
    "download_url": null,
    "type": "dir",
    "_links": {
      "self": "https://api.github.com/repos/acidanthera/OpenCorePkg/contents/AppleModels?ref=master",
      "git": "https://api.github.com/repos/acidanthera/OpenCorePkg/git/trees/5c66789ca13edcce96bb99cb70293613663e13ad",
      "html": "https://github.com/acidanthera/OpenCorePkg/tree/master/AppleModels"
    }
  },
*/
