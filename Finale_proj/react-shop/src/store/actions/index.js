export const addToCart = (cartItem) => {
  return {
    type: "ADD_PRODUCT_TO_CART",
    payload: cartItem,
  };
};

export const clearCart = () => {
  return {
    type: "CLEAR_CART",
  };
};

/*
export const makeActive = (id) => ({
  type: "MAKE_ACTIVE",
  payload: id,
});

export const makeDone = (id) => ({
  type: "MAKE_DONE",
  payload: id,
});

export const startLoad = () => ({
  type: "FETCH_TODOS_START",
});

export const endLoad = () => ({
  type: "FETCH_TODOS_END",
});

export const addTodo = (name) => ({
  type: "ADD_TODO",
  payload: name,
});

export const deleteTodo = (id) => ({
  type: "DELETE_TODO_ITEM",
  payload: id,
});
*/
