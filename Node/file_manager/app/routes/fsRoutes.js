const path = require("path");

const express = require("express");

const FsController = require("../controllers/fsController");

const router = express.Router();

router.get("/", FsController.showFs);

router.get("/download", FsController.downloadFile);
router.get("/files/:folder", FsController.showFilesOfFolder);
router.get("/files/:folder/:file", FsController.showFileInfo);

router.post("/add-folder", FsController.addFolder);
router.post("/add-file", FsController.addFolder);
router.post("/upload-file", FsController.uploadFile);

module.exports = router;
