const path = require("path");
const fs = require("fs");

const FsModel = require("../models/fsModel");

const ROOT_FOLDER = require("../utils/path");
const PUBLIC_FOLDER = path.join(ROOT_FOLDER, "data/user_f");
//const USER_FOLDER = path.join(ROOT_FOLDER, "data", "user_id1");

const userFolderData = new FsModel();

exports.showFs = (req, res, next) => {
  const USER_F_NAME = res.userFolder;
  const USER_F_PATH = path.join(ROOT_FOLDER, USER_F_NAME);

  userFolderData.getFolderItems(USER_F_PATH); //USER_FOLDER

  function parseObj(obj) {
    let result = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key].isDir) {
        if (obj[key].items) {
          let folder = parseObj(obj[key].items);
          result[key] = folder;
        } else {
          result[key] = { status: false };
        }
      }
    });
    return result;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  let curF = [];
  let fPath = "";

  function renderFolders(obj) {
    let fsNavTemplate = "<ul>";

    Object.keys(obj).forEach((key) => {
      if (JSON.stringify(obj[key]) !== "{}") {
        if (curF[0] !== fPath.split("/")[0]) {
          curF.push(key);
        } else {
          curF[curF.length] = key;
        }
        fPath = curF.join("/");
        fsNavTemplate += `<li class='fs__folder' data-folder=${key} data-path="${fPath}">${key} ${renderFolders(
          obj[key]
        )}</li>`;
        curF.length = 0;
        fPath = "";
      } else {
        curF.push(key);
        fPath = curF.join("/");
        fsNavTemplate += `<li class='fs__folder'  data-folder=${key} data-path="${fPath}">${key}</li>`;
        curF.length = curF.length - 1;
      }
    });
    fsNavTemplate += "</ul>";
    return fsNavTemplate;
  }

  const { fs } = userFolderData;

  const folderSizeKB = FsModel.getFolderSize(fs) / 1024;
  const folderSizeMB = (FsModel.getFolderSize(fs) / 1024000).toFixed(2);

  const spaceUsed = Math.round(
    (folderSizeKB / (userFolderData.maxSpaceAvailableKB / 100)) * 100
  );

  let folders = renderFolders(parseObj(fs));

  res.render("index", { folders, spaceUsed, folderSizeKB, folderSizeMB });
};

exports.addFolder = (req, res, next) => {
  const currentFolder = req.body.currentFolder;
  const USER_F_NAME = res.userFolder;
  const USER_F_PATH = path.join(ROOT_FOLDER, USER_F_NAME);

  const folderName = req.body.folder;

  if (currentFolder === "root" || currentFolder === undefined) {
    savePath = `${USER_F_PATH}/${folderName}`;
  } else {
    savePath = `${USER_F_PATH}/${currentFolder}/${folderName}`;
  }

  fs.mkdir(savePath, { recursive: true }, (e) => {
    if (e) {
      console.error(e);
    } else {
      console.log("Success");
    }
  });

  res.redirect("/fs-manager/");
};

exports.uploadFile = (req, res, next) => {
  const currentFolder = req.body.currentFolder;
  const USER_F_NAME = res.userFolder;
  const USER_F_PATH = path.join(ROOT_FOLDER, USER_F_NAME, currentFolder);

  try {
    if (!req.files) {
      console.log("File wasnt choosen");
    } else {
      let data = [];

      const filesList = Object.values(req.files);

      filesList.forEach((file, i) => {
        let savePath;

        if (currentFolder === "root") {
          savePath = `${path.join(ROOT_FOLDER, USER_F_NAME)}/` + file.name;
        } else {
          savePath = `${USER_F_PATH}/` + file.name;
        }

        // console.log("Save path:", savePath);

        file.mv(savePath, (err) => {
          const result = {
            name: file.name,
            mimetype: file.mimetype,
            size: file.size,
            xtatus: true,
          };

          if (err) {
            result.status = false;
          }

          data.push(result);

          if (data.length === filesList.length) {
            res.redirect("/fs-manager/");
          }
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.showFilesOfFolder = (req, res, next) => {
  //const { folder } = req.params;
  const USER_F_NAME = res.userFolder;
  const folderPath = req.query.folderPath;

  const USER_F_PATH = path.join(ROOT_FOLDER, USER_F_NAME, folderPath);

  //can pass folder path in query throu data-path
  if (req.params.folder === "root") {
    userFolderData.getFiles(path.resolve(path.join(ROOT_FOLDER, USER_F_NAME)));
  } else if (req.params.folder !== "") {
    userFolderData.getFiles(path.resolve(USER_F_PATH));
  }

  function parseObj(obj) {
    let result = {};
    Object.keys(obj).forEach((key) => {
      result[key] = obj[key];
    });
    return result;
  }

  function renderFilesOfFolder(obj) {
    let a = `
    <thead>
        <td class="name">Name</td>
        <td class="type">Type</td>
        <td class="size">Size</td>
        <td class="modified">Modified</td>
        <td class="created">Created</td>
    </thead>`;
    Object.keys(obj).forEach((key) => {
      ////////////////////////////////////////////////////////////////////////////////////////
      if (obj[key].basename !== key) {
        a += ` <tr data-file="${key}" class="file-list__row js-file"> 
        <td class="name"><span class="file-img--${
          obj[key].basename
        }"></span> ${key}</td>
        <td class="type">${obj[key].basename}</td>
        <td class="size">${obj[key].size / 1000} KB</td>
        <td class="modified">${new Date(
          obj[key].modified
        ).toLocaleDateString()}</td>
        <td class="created">${new Date(
          obj[key].birthtime
        ).toLocaleDateString()}</td>
    </tr>`;
      } else {
        obj[key].dir;
        a += ` <tr data-path="${key}" data-folder="${key}" class="file-list__row js-folder">
       
        <td class="name"><span class="file-img--folder"></span> 
       ${key} </td>
        <td class="type">folder</td>
        <td class="size"></td>
        <td class="modified">${new Date(
          obj[key].modified
        ).toLocaleDateString()}</td>
        <td class="created">${new Date(
          obj[key].birthtime
        ).toLocaleDateString()}</td>
      
    </tr>`;
      }
    });

    return a;
  }

  const { currentFolder } = userFolderData;

  let files = renderFilesOfFolder(parseObj(currentFolder));

  res.send(files);
};

exports.showFileInfo = (req, res, next) => {
  const { folder, file } = req.params;
  const fileInfo = FsModel.getFileinfo(file);
  res.send({ folder, file });
};

exports.downloadFile = (req, res, next) => {
  const { filePath } = req.query;
  const USER_FOLDER = path.join(ROOT_FOLDER, res.userFolder);

  //console.log(filepath);

  res.download(path.join(PUBLIC_FOLDER, `${filePath}`));
};
