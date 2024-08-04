const fs = require("fs");
const path = require("path");
const { argv } = require("process");
const { promisify } = require("util");

let count = 0;

class FileHandler {
  constructor() {
    this._myOutputImagePath = path.join(__dirname, "../", "./Output/images");
    this._myOutputVideoPath = path.join(__dirname, "../", "./Output/video");
    this._myDefaultInputPath = path.join(__dirname, "../", "./Input");

    this.videoExtentions = {
      ".MOV": true,
      ".mov": true,
      ".VOB": true,
      ".mp4": true,
      ".MP4": true,
    };

    this.imageExtentions = {
      ".JPG": true,
      ".jpg": true,
      ".HEIC": true,
      ".heic": true,
      ".PNG": true,
      ".JPEG": true,
      ".gif": true,
      ".png": true,
    };
  }

  async getDirectoriesAndFiles(baseDir) {
    try {
      const readDir = promisify(fs.readdir);
      const zips = (await readDir(baseDir)).map((v) => `${baseDir}/${v}`);
      return zips;
    } catch (err) {
      const readExt = path.extname(baseDir);
      if (this.imageExtentions[String(readExt)]) {
        // move to images
        const reName = promisify(fs.rename);
        await reName(
          baseDir,
          path.join(this._myOutputImagePath, path.basename(baseDir))
        );
      } else if (this.videoExtentions[[String(readExt)]]) {
        // move to videos
        const reName = promisify(fs.rename);
        await reName(
          baseDir,
          path.join(this._myOutputVideoPath, path.basename(baseDir))
        );
      }
      return [];
    }
  }

  async nestedFileExplorer(arr) {
    if (!arr || !arr.length) {
      return [];
    }
    let levelDir = [];
    for (let i = 0; i < arr.length; i++) {
      levelDir.push(...(await this.getDirectoriesAndFiles(arr[i])));
    }

    this.nestedFileExplorer(levelDir);
    return;
  }

  async runner(arr) {
    await this.nestedFileExplorer(arr);
    console.log(count);
  }
}

(() => {
  const fileArr = [];
  if (argv[2]) {
    fileArr.push(argv[2]);
  } else {
    fileArr.push(this._myDefaultInputPath);
  }
  const fileHandler = new FileHandler();
  fileHandler.runner();
})();
