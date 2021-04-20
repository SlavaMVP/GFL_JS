(function () {
  const PRODUCTS_LINK = "https://jsonbox.io/box_778eabc2fa9ee6c909ce";
  const appEl = document.getElementById("app");
  const productItemTemplate = document.getElementById("product-item-template");
  const cartItemTemplate = document.getElementById("cart-item-template");

  const productsListEl = appEl.querySelector(".js-products-list");
  const appMessageEl = appEl.querySelector(".js-message");
  const cartListEl = appEl.querySelector(".js-cart-items");
  const cartHeaderEl = appEl.querySelector(".js-cart-header");
  const cartMessageEl = appEl.querySelector(".js-cart-message");
  const cartSummaryInfoEl = appEl.querySelector(".js-summary");
  const cartSummaryPriceEl = cartSummaryInfoEl.querySelector(".js-total");

  productsListEl.addEventListener("click", addToCartHandler);

  let productsList = getDataFromLS("products") || [];
  let cartItems = getDataFromLS("cartData") || [];
  let statistics = {}; //later we wil add here cart items' total price, and number of items in it

  //! //////////////////////////////////////////////////////////////////////////////////////! Controllers
  function initApp() {
    if (productsList.length === 0) {
      //if we open app for the first time(REST Api)
      fetchUsersList(PRODUCTS_LINK);
    } else {
      //if we have opened app once (LS)
      renderApp();
    }
  }

  function renderApp() {
    //for productivity splitted app into two components (to use specific render if needed)
    renderProducts();
    renderCart();
  }

  function renderProducts() {
    productsListEl.innerHTML = "";
    productsList.forEach((item) => renderProduct(item));
  }

  function renderCart() {
    sortArray(cartItems);
    countStatistics(); //recalculates statistics(total);
    renderCartInfo();
    cartListEl.innerHTML = "";
    if (isCartNotEmpty()) {
      cartItems.forEach((item) => renderCartItem(item));
    }

    //now as we have it in DOM we can get it and assign event Listener on it
    const cartBtns = cartListEl.querySelectorAll(".js-cart-btns");
    [...cartBtns].forEach((el) =>
      el.addEventListener("click", cartItemsHandler)
    );
  }

  function addToCartHandler(evt) {
    if (evt.target.nodeName === "BUTTON") {
      const productId = evt.target.dataset.productId;
      const currentProduct = getItemFromProducts(productId);

      let product = {
        id: currentProduct.id,
        productName: currentProduct.name,
        quantity: 0,
        price: currentProduct.price,
      };

      if (isProductInCart(productId)) {
        //? We have here same functional as in Cart's button '+'
        if (!isProductAwailable(productId)) {
          const currentProduct = getItemFromCart(productId);
          deleteItemFromCart(productId);
          manageItemInCart(currentProduct);
        } else {
          showMessage("We can't offer more!", "info");
        }
      } else {
        showMessage("New item add to cart!", "info");
        manageItemInCart(product);
      }

      saveDataToLS("cartData", cartItems);
      renderCart();
    }
  }

  function cartItemsHandler(evt) {
    if (evt.target.nodeName === "BUTTON") {
      const productId = evt.target.closest("DIV").dataset.productId;
      const action = evt.target.dataset.action;
      const cartItem = getItemFromCart(productId);
      const productItem = getItemFromProducts(productId);

      if (
        cartItem &&
        cartItem.quantity === productItem.available &&
        action === "add"
      ) {
        showMessage("There is no more left!!", "info");
      } else if (cartItem && cartItem.quantity == 1 && action === "subtract") {
        deleteItemFromCart(productId);
        showMessage("Product deleted from Cart!!", "info");
      } else if (cartItem) {
        deleteItemFromCart(productId);
        manageItemInCart(cartItem, action);
      }
    }
    saveDataToLS("cartData", cartItems);
    renderCart();
  }

  //! //////////////////////////////////////////////////////////////////////////////////////! View
  function renderProduct(product) {
    const newProductItem = productItemTemplate.content.cloneNode(true);
    newProductItem.querySelector(".product__header").innerText = product.name;
    newProductItem.querySelector(
      ".product__price"
    ).innerText = `$${product.price.toFixed(2)}`;
    newProductItem.querySelector(".product__description").innerText = `You ${
      product.available ? "can" : "can't"
    } buy ${product.name} in our shop. We have ${
      product.available ? product.available : "none"
    } available!!`;

    let addBtn = newProductItem.querySelector(".js-add-btn");
    addBtn.dataset.productId = product.id;
    product.available ? (addBtn.disabled = false) : (addBtn.disabled = true);
    !product.available
      ? (addBtn.title = "We have none left!")
      : (addBtn.title = "Add product in cart?");

    productsListEl.appendChild(newProductItem);
  }

  function renderCartItem(item) {
    const newCartItem = cartItemTemplate.content.cloneNode(true);
    newCartItem.querySelector(".item__header").innerText = item.productName;
    newCartItem.querySelector(".item__quantity").innerText = item.quantity;
    newCartItem.querySelector(".item__total-price").innerText = `$${(
      item.price * item.quantity
    ).toFixed(2)}`;
    newCartItem.querySelector(".js-cart-btns").dataset.productId = item.id;

    cartListEl.appendChild(newCartItem);
  }

  function renderCartInfo() {
    isCartNotEmpty()
      ? (cartMessageEl.classList.add("hide"),
        cartSummaryInfoEl.classList.remove("hide"))
      : (cartMessageEl.classList.remove("hide"),
        cartSummaryInfoEl.classList.add("hide"));
    cartHeaderEl.innerText = isCartNotEmpty()
      ? `Cart (${statistics.totalQuantity})`
      : "Cart (0)";
    cartSummaryPriceEl.innerText = isCartNotEmpty()
      ? `$${statistics.totalPrice.toFixed(2)}`
      : "";
  }
  //! ///////////////////////////////////////////////////////////////////////////////////////////! Model

  function fetchUsersList(link) {
    message = `There are accured some problems. We are working on it!`;
    //check if there fetch method support
    if (window.fetch) {
      fetch(link)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          productsList = response;
          saveDataToLS("products", productsList);
        })
        .then(() => {
          renderApp();
        })
        .catch((err) => {
          showMessage(message, "error"); //for user
          console.log(err.message); //for developer
        });
    } else {
      customFetch(link)
        .then((response) => {
          productsList = response;
          saveDataToLS("products", productsList);
        })
        .then(() => {
          renderApp();
        })
        .catch((err) => {
          showMessage(message, "error"); //for user
          console.log(err.message); //for developer
        });
    }
  }

  //////////////////////////////////////////////////////////////////////////////////! Auxiliary functions

  function saveDataToLS(key, products) {
    const jsonStr = JSON.stringify(products);
    localStorage[key] = jsonStr;
  }

  function getDataFromLS(key) {
    if (localStorage[key]) {
      const products = JSON.parse(localStorage[key]);
      return products;
    }
  }

  function isProductAwailable(id) {
    let [cartItem] = cartItems.filter((el) => el.id == id);
    let [productItem] = productsList.filter((el) => el.id == id);

    return cartItem.quantity === productItem.available;
  }

  function getItemFromProducts(id) {
    return productsList.filter((el) => el.id == id)[0];
  }

  function deleteItemFromCart(id) {
    cartItems = cartItems.filter((el) => el.id != id);
  }

  function manageItemInCart(product, action = null) {
    switch (action) {
      case "add":
      case null:
        cartItems.push({
          ...product,
          quantity: ++product.quantity,
        });
        break;
      case "subtract":
        cartItems.push({
          ...product,
          quantity: --product.quantity,
        });
        break;
      default:
        console.log("there is no such action!!");
    }
  }

  function getItemFromCart(id) {
    return cartItems.filter((el) => el.id == id)[0];
  }

  function isProductInCart(id) {
    return !!cartItems.find((el) => el.id == id);
  }

  function isCartNotEmpty() {
    return !!cartItems.length;
  }

  function sortArray(arr) {
    const sortedArr = arr.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
    return sortedArr;
  }

  function countStatistics() {
    //reset old statistics
    statistics.totalQuantity = 0;
    statistics.totalPrice = 0;

    cartItems.reduce((_, el) => {
      statistics.totalQuantity += el.quantity;
      statistics.totalPrice += el.price * el.quantity;
    }, statistics);
  }

  function showMessage(message, type) {
    let isMessageOn = false;

    function createMessage(messageType) {
      isMessageOn = true;
      appMessageEl.innerText = message;
      if (isMessageOn) {
        messageType === "error"
          ? appMessageEl.classList.add("app__message--error")
          : appMessageEl.classList.add("app__message--info");
        setTimeout(hideMessage, 2000);
      }
    }

    function hideMessage() {
      appMessageEl.classList.remove("app__message--info");
      appMessageEl.classList.remove("app__message--error");
      isMessageOn = false;
    }

    createMessage(type);
  }

  //? POLyFILL -kind of...
  //used as polyfill for old browsers and ie //in ie Promises woun't work nether thou;)
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

  //! //////////////////////////////////////////////////////////////////////////////! init App
  initApp();

  //Listen for changes in localStore and updates parallel opened window
  window.addEventListener("storage", (evt) => {
    if (evt.key === "cartData") {
      cartItems = getDataFromLS("cartData") || [];
      renderCart();
    }
  });
})();
