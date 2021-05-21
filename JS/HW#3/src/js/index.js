(function () {
  const usersListEl = document.querySelector(".js-list");
  const errMsgEl = document.querySelector(".js-err-msg");
  const todoActionsEl = document.querySelector(".js-actions");

  const USERS_LINK = "https://jsonplaceholder.typicode.com/users";
  let usersList = [],
    message = "";

  todoActionsEl.addEventListener("click", (evt) => {
    const action = evt.target.dataset.action;

    switch (action) {
      case "fetch":
        fetchUsersList(USERS_LINK);
        //to make some debounce effect
        disableBtn();
        break;
      case "cache":
        cacheUsersList(); //TODO
        break;
      default:
        console.log("There is no such action");
    }
  });

  function fetchUsersList(link) {
    message = `There are accured some problems. We are working on it!`;
    //check if there fetch method in window
    if (window.fetch) {
      fetch(link)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          usersList = response;
        })
        .then(() => {
          usersListEl.innerHTML = "";
          usersList.forEach((e) => renderUser(e));
        })
        .catch((err) => {
          showErrMessage(message);
          console.log(err.message);
        });
    } else {
      customFetch(link)
        .then((response) => {
          usersListEl.innerHTML = "";
          usersList = response;
          usersList.forEach((e) => renderUser(e));
        })
        .catch((err) => {
          showErrMessage(message);
          console.log(err.message);
        });
    }
  }

  function showErrMessage(message) {
    errMsgEl.style.display = "block";
    errMsgEl.innerText = message;

    setTimeout(debounce, 5000);

    function debounce() {
      errMsgEl.style.display = "none";
    }
  }

  //то что этот способ создания Dom елементов один из самых прожорливых ЗНАЮ!! (обычно добавляю через template или ``)
  function renderUser(user) {
    const userLi = document.createElement("LI");
    userLi.setAttribute("class", "users-list__item");
    userLi.innerText = user.name;

    const subList = document.createElement("UL");
    const subListLi1 = document.createElement("LI");
    const subListLi2 = document.createElement("LI");
    const subListLi3 = document.createElement("LI");
    subListLi1.innerText = `USER_ID: ${user.id}`;
    subListLi2.innerText = `USER_NAME: ${user.username}`;
    subListLi3.innerText = `USER_EMAIL: ${user.email}`;

    subList.appendChild(subListLi1);
    subList.appendChild(subListLi2);
    subList.appendChild(subListLi3);
    userLi.appendChild(subList);
    usersListEl.appendChild(userLi);
  }

  function disableBtn() {
    const fetchBtn = todoActionsEl.querySelector("button[data-action='fetch']");
    fetchBtn.disabled = true;

    setTimeout(debounce, 5000);

    function debounce() {
      fetchBtn.disabled = false;
    }
  }

  function cacheUsersList() {
    message = `We are working on that;)`;
    showErrMessage(message);
    console.log("Not ready yet!!!");
  }

  //used as polyfill for old browsers and ie
  //in ie Promise woun't work nether thou;)
  function customFetch(url, settings = {}) {
    settings = Object.assign(
      {
        method: "GET",
        async: true,
        type: "json",
        body: {},
      },
      settings
    );

    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open(settings.method, url, settings.async);
      xhr.responseType = settings.type;
      xhr.withCredentials = true;
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");

      if (settings.method !== "GET") {
        xhr.send(JSON.stringify(settings.body));
      } else {
        xhr.send();
      }

      xhr.onload = () => {
        if (xhr.status < 400) {
          resolve(xhr.response, xhr);
        } else {
          reject(xhr.response, xhr);
        }
      };

      xhr.onerror = () => {
        reject(xhr.response, xhr);
      };
    });
  }
})();
