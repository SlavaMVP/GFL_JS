export const setTodos = (todoItems) => {
  return {
    type: "SET_TODOS",
    payload: todoItems,
  };
};

export const makeActive = (id) => ({
  type: "MAKE_ACTIVE",
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

//не использовал
/*
export const filterTodos = (payload) => ({
  type: "FILTER_TODO_ITEMS",
  payload,
});
*/
