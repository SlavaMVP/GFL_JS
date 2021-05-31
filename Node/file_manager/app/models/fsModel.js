const path = require("path");
const fs = require("fs");

const ROOT_FOLDER = require("../utils/path");

module.exports = class FsModel {
  fs = {};
  maxSpaceAvailableKB = 2000000;
  currentFolder = {};
  size = 0;

  getFolderItems = (pathName) => {
    const res = {};

    try {
      const dirItems = fs.readdirSync(pathName);
      dirItems.forEach((item) => {
        try {
          const { dir } = path.parse(path.join(pathName, item));
          const stats = fs.statSync(path.join(pathName, item));

          if (stats.isFile()) {
            res[item] = {
              basename: item.split(".")[1],
              dir: pathName,
              size: stats.size,
              birthtime: stats.birthtime,
              modified: stats.mtime,
              isFile: stats.isFile(),
              isDir: stats.isDirectory(),
            };
          } else {
            res[item] = {
              basename: "folder",
              dir,
              size: stats.size,
              birthtime: stats.birthtime,
              isFile: stats.isFile(),
              isDir: stats.isDirectory(),
              items: this.getFolderItems(path.join(pathName, item)),
            };
          }
        } catch (err) {
          console.log(err);
        }
      });

      return (this.fs = res);
    } catch (err) {
      console.log("ERROR", err);
      return res;
    }
  };

  getFiles(pathName) {
    const res = {};

    try {
      const dirItems = fs.readdirSync(pathName);
      dirItems.forEach((item) => {
        try {
          const { dir } = path.parse(path.join(pathName, item));
          const stats = fs.statSync(path.join(pathName, item));

          res[item] = {
            basename: item.split(".")[item.split(".").length - 1],
            dir,
            size: stats.size,
            birthtime: stats.birthtime,
            modified: stats.mtime,
            isFile: stats.isFile(),
            isDir: stats.isDirectory(),
          };
        } catch (err) {
          console.log(err);
        }
      });

      return (this.currentFolder = res);
    } catch (err) {
      console.log("ERROR", err);
      return res;
    }
  }

  static getFolderSize = (dirTree) => {
    const dirItems = Object.keys(dirTree);
    let size = 0;

    dirItems.forEach((item) => {
      const itemObj = dirTree[item];

      size += itemObj.isFile ? itemObj.size : this.getFolderSize(itemObj.items);
      itemObj.isDir && (itemObj.size = size);
    });

    return size;
  };

  static createUserFolder = (userEmail) => {
    const curentFolder = path.resolve(ROOT_FOLDER, "data");
    console.log(curentFolder);

    let pathname = `${curentFolder}/user_${userEmail}`;

    fs.mkdir(pathname, { recursive: true }, (e) => {
      if (e) {
        console.error(e);
      } else {
        console.log("Success");
      }
    });
  };

  static getFileinfo = (file) => {
    console.log(file);
  };
};
