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
  const filePreviewEl = fileInfoEl.querySelector(".js-preview");
  const fileDownloadBtnEl = fileInfoEl.querySelector(".js-download");
  const fileInformationBtnEl = fileInfoEl.querySelector(".js-info");

  let activeFolder = "root";
  let activeFolderPath;

  //initial folder files preview
  document.addEventListener("onContentLoaded", manageSelectedFolder("root"));

  //? //////////////////////////////////////////////////////////////////////////filter input

  searchInputEl.addEventListener("keyup", (evt) => {
    const inputValue = evt.target.value;
    const filesEls = contentTable.querySelectorAll(".file-list__row");

    const newEls = [...filesEls].filter((el) => {
      const row = el;
      row.style.backgroundColor = "transparent";
      contentTable.appendChild(row);
      if (inputValue.trim()) {
        const rowEl = el.querySelector(".name").innerText.toLowerCase();
        return rowEl.includes(inputValue.toLowerCase());
      }
    });

    [...newEls].forEach((el) => {
      const newRowEl = el;
      newRowEl.style.backgroundColor = "yellow";
      return contentTable.prepend(newRowEl);
    });
  });

  ///////////////////////////////////////////////////////////////////////////////////

  [...formActions].forEach((el) => {
    el.querySelector(".cancel--btn").addEventListener("click", (e) => {
      e.preventDefault();
      closeOperation();
    });
    el.querySelector(".save--btn").addEventListener("click", (e) => {
      //e.preventDefault();
      closeOperation();
      console.log("save");
    });
  });

  addBtn.addEventListener("click", () => {
    addBtn.classList.toggle("btn--add-active");
    addMenu.classList.toggle("hide");
  });

  fsNavigation.addEventListener("click", (evt) => {
    evt.preventDefault();
    const chosenFolder = evt.target.dataset.folder;
    const chosenFolderPath = evt.target.dataset.path;
    activeFolder = chosenFolder;
    activeFolderPath = chosenFolderPath;

    //console.log(evt.target.dataset);
    manageSelectedFolder(activeFolder, activeFolderPath);
  });

  function manageSelectedFolder(folder, queryParams = null) {
    fetch(
      `http://localhost:3055/fs-manager/files/${folder}?folderPath=${queryParams}`
    ) //files/${activeFolder}
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        renderFiles(data);
      })
      .then(() => {
        //add listeners to folder's files
        fileManageHandler();
      })
      .catch((er) => console.log(er));
  }

  function renderFiles(data) {
    contentTable.innerHTML = "";
    contentTable.innerHTML = data;
  }

  function fileManageHandler() {
    const tableRows = contentTable.querySelectorAll("tr");
    const folderEl = contentTable.querySelectorAll(".js-folder");

    filesSelectHandler(tableRows, folderEl);
  }

  function filesSelectHandler(filesEl, folderEl) {
    [...filesEl].forEach((element) => {
      element.addEventListener("click", (evt) => evt.preventDefault());
    });

    [...filesEl].forEach((element) => {
      element.addEventListener("click", (evt) => {
        let selectedRow = evt.target.closest("TR");

        const filePath = selectedRow.dataset.filePath;
        const fileName = selectedRow.querySelector(".name").innerText;
        const fileType = selectedRow.querySelector(".type").innerText;
        const fileSize = selectedRow.querySelector(".size").innerText;
        const fileModified = selectedRow.querySelector(".modified").innerText;
        const fileCreated = selectedRow.querySelector(".created").innerText;

        if (fileType === "folder") {
          console.log(fileName);
          manageSelectedFolder(fileName);
        }

        renderFileInfo(
          //selectedRow,
          fileName,
          fileSize,
          fileModified,
          fileCreated,
          filePath
        );
      });
    });
  }

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

    // filePreviewEl.insertAdjacentHTML("afterbegin", template);
    fileInfoDetailsEl.insertAdjacentHTML("afterbegin", template);
  }

  fileDownloadBtnEl.addEventListener("click", () => {
    fileDownloadBtnEl.classList.add("details__btn--active");
    fileInformationBtnEl.classList.remove("details__btn--active");

    console.log("download");
    fetch(`http://localhost:3055/fs-manager/download`) //files/${activeFolder} //?filepath=22
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

  addMenu.addEventListener("click", (evt) => {
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
  });

  overlay.addEventListener("click", () => {
    closeOperation();
  });

  function setCurFolder() {
    [...activeFolderInputs].forEach((el) => {
      el.value = activeFolder;
    });
    //console.log(activeFolder);
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
