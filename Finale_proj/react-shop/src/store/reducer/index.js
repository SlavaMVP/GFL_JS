const initialState = {
  cart: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_PRODUCT_TO_CART":
      const cart = [...state.cart];
      action.payload.forEach((item) => {
        cart.push(item);
      });

      return { ...state, cart };
    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
};

export default reducer;
