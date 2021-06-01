{
  const fsNavigation = document.querySelector(".js-fs");
  const searchInputEl = document.querySelector("#search-input");
  const addBtn = document.querySelector(".js-add");
  const addMenu = document.querySelector(".js-show-menu");
  const forms = document.querySelector(".fs-manager__forms");
  const activeFolderInputs = forms.querySelectorAll("#curent-folder");
  const addFolderForm = forms.querySelector(".add-folder-form");
  const addFileForm = forms.querySelector(".add-file-form");
  const uploadFileForm = forms.querySelector(".upload-file-form");
  const overlay = document.querySelector(".forms__overlay");
  const formActions = document.querySelectorAll(".form-actions");
  const contentTable = document.querySelector("#content-table");
  const fileInfoEl = document.querySelector(".js-details");
  const fileInfoDetailsEl = fileInfoEl.querySelector(".js-info-table");
  //const filePreviewEl = fileInfoEl.querySelector(".js-preview");
  const fileDownloadBtnEl = fileInfoEl.querySelector(".js-download");
  const fileInformationBtnEl = fileInfoEl.querySelector(".js-info");

  //? later it will be used inside a couple of functions as global vars
  let activeFolder = "root";
  let activeFolderPath = "root";

  //? initial folder files preview
  document.addEventListener(
    "onContentLoaded",
    showFilesOfSelectedFolder("root")
  );

  //? ////////////////////////////////////////////////////////////////////////////////// filter input
  searchInputEl.addEventListener("keyup", filterHandler);

  //? ////////////////////////////////////////////////////////////////////////////////// adding folder,file,upload managing

  //1. on btn "+ Add" show options menu (where we can choose action we want to make)
  addBtn.addEventListener("click", () => {
    addBtn.classList.toggle("btn--add-active");
    addMenu.classList.toggle("hide");
  });

  //2. add event listeners for btns (for hiding ui els)
  [...formActions].forEach((el) => {
    el.querySelector(".cancel--btn").addEventListener("click", (e) => {
      e.preventDefault();
      closeOperation();
    });
    el.querySelector(".save--btn").addEventListener("click", (e) => {
      closeOperation();
    });
  });

  //3. add event listeners for overlay (for hiding ui els)
  overlay.addEventListener("click", () => {
    closeOperation();
  });

  addMenu.addEventListener("click", selectFolderActionHandler);

  //? ////////////////////////////////////////////////////////////////////////////////// adding folder,file,upload managing end

  fsNavigation.addEventListener("click", fsNavigationHandler);

  //? ////////////////////////////////////////////////////////////////////////////////// fetching files of selected folder

  function showFilesOfSelectedFolder(folder, queryParams = null) {
    if (queryParams === null) {
      queryParams = `${activeFolderPath}/${folder}`;
    }
    console.log("query", folder, queryParams);

    fetch(
      `http://localhost:3055/fs-manager/files/${folder}?folderPath=${queryParams}`
    )
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        //1. add files of selected folder into DOM
        renderFiles(data);
      })
      .then(() => {
        //add listeners for files of selectedfolder (to show file info)
        fileManageHandler();
      })
      .catch((er) => console.log(er));
  }

  //? ////////////////////////////////////////////////////////////////////////////////// fetching files of selected folder end

  function fileManageHandler() {
    const tableRows = contentTable.querySelectorAll(".js-file");
    const folderEl = contentTable.querySelectorAll(".js-folder");

    filesSelectHandler(tableRows, folderEl);
  }

  function filesSelectHandler(filesEl, folderEl) {
    [...folderEl].forEach((element) => {
      element.addEventListener("dblclick", selectFolderHandler);
    });

    [...filesEl].forEach((element) => {
      element.addEventListener("click", selectedFileHandler);
    });
  }

  //filePath intended to be used for download link
  function renderFileInfo(
    fileName,
    fileSize,
    fileModified,
    fileCreated,
    filePath
  ) {
    fileInfoDetailsEl.innerText = "";

    let template = `
    <img src="../doc.svg"  class="file__preview js-preview" alt="preview"></img>
    <tr>
    <td class="row_name">Name</td>
    <td class="row_data">${fileName}</td>
</tr>
<tr>
    <td class="row_name">Size</td>
    <td class="row_data">${fileSize}</td>
</tr>
<tr>
    <td class="row_name">Modified</td>
    <td class="row_data">${fileModified}</td>
</tr>
<tr>
    <td class="row_name">Created</td>
    <td class="row_data">${fileCreated}</td>
</tr>`;
    //TODO /////////////////////////////////////////////////////////

    fileInfoDetailsEl.insertAdjacentHTML("afterbegin", template);
  }

  fileDownloadBtnEl.addEventListener("click", () => {
    fileDownloadBtnEl.classList.add("details__btn--active");
    fileInformationBtnEl.classList.remove("details__btn--active");

    console.log("download...");
    fetch(`http://localhost:3055/fs-manager/download`)
      .then((response) => {
        return response.blob();
      })
      .then((blob) => {
        var file = window.URL.createObjectURL(blob);
        window.location.assign(file); //! ////////////////////////////////////////////////////////////////////////////////////download
      })
      .catch((err) => console.log(err));
  });

  fileInfoDetailsEl.addEventListener("click", () => {
    fileDownloadBtnEl.classList.remove("details__btn--active");
    fileInformationBtnEl.classList.add("details__btn--active");
  });

  function setCurFolder() {
    [...activeFolderInputs].forEach((el) => {
      el.value = activeFolderPath;
    });
  }

  function choseForm(form) {
    addBtn.classList.remove("btn--add-active");
    addMenu.classList.add("hide");
    forms.classList.remove("hide");
    overlay.classList.remove("hide");
    setCurFolder();

    form.classList.remove("hide");
    form.classList.add("show");
  }

  //! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VIEW

  function renderFiles(data) {
    contentTable.innerHTML = "";

    //! 214 is length of thead el (214 is a magic number :))
    if (data.length > 214) {
      contentTable.insertAdjacentHTML("afterbegin", data);
    } else {
      contentTable.insertAdjacentHTML(
        "afterbegin",
        "<p>There is no files in folder yet!</p>"
      );
    }
  }

  //! ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Handlers

  function fsNavigationHandler(evt) {
    // set our global active folder and its path
    activeFolder = evt.target.dataset.folder;
    activeFolderPath = evt.target.dataset.path;

    showFilesOfSelectedFolder(activeFolder, activeFolderPath);
  }

  function filterHandler(evt) {
    const filterText = evt.target.value;
    const filesEls = contentTable.querySelectorAll(".file-list__row");

    const newEls = [...filesEls].filter((el) => {
      //1. make all table rows bg transparent and put it into DOM
      const row = el;
      row.style.backgroundColor = "transparent";
      contentTable.appendChild(row);

      //2. filter files by filter text
      if (filterText.trim()) {
        const fileName = el.querySelector(".name").innerText.toLowerCase();
        return fileName.includes(filterText.toLowerCase());
      }
    });

    //3. Styling filtered and putting it back into DOM (to the top of other files)
    [...newEls].forEach((el) => {
      const newRowEl = el;
      newRowEl.style.backgroundColor = "yellow";
      return contentTable.prepend(newRowEl);
    });
  }

  function selectFolderActionHandler(evt) {
    const action = evt.target.dataset.action;

    switch (action) {
      case "add-folder":
        choseForm(addFolderForm);
        break;
      case "add-file":
        choseForm(addFileForm);
        break;
      case "upload-file":
        choseForm(uploadFileForm);
        break;

      default:
        closeOperation();
    }
  }

  function selectFolderHandler(evt) {
    evt.preventDefault();

    const folderSelected = evt.target.closest("TR").dataset.folder;

    activeFolder = folderSelected;

    if (activeFolderPath === undefined || activeFolderPath === "root") {
      activeFolderPath = "";
    }
    showFilesOfSelectedFolder(folderSelected);
    activeFolderPath = `${activeFolderPath}/${activeFolder}`;
  }

  function selectedFileHandler(evt) {
    let selectedRow = evt.target.closest("TR");

    const filePath = selectedRow.dataset.filePath;
    const fileName = selectedRow.querySelector(".name").innerText;
    const fileType = selectedRow.querySelector(".type").innerText;
    const fileSize = selectedRow.querySelector(".size").innerText;
    const fileModified = selectedRow.querySelector(".modified").innerText;
    const fileCreated = selectedRow.querySelector(".created").innerText;

    renderFileInfo(fileName, fileSize, fileModified, fileCreated, filePath);
  }

  function closeOperation() {
    addFolderForm.classList.add("hide");
    addFileForm.classList.add("hide");
    uploadFileForm.classList.add("hide");
    addFolderForm.classList.remove("show");
    addFileForm.classList.remove("show");
    uploadFileForm.classList.remove("show");
    overlay.classList.add("hide");
    forms.classList.add("hide");
  }
}
