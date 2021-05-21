const initialState = {
  fetching: true,
  todos: null,
  filteredTodos: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_TODOS_START":
      return { ...state, fetching: true };
    case "FETCH_TODOS_END":
      return { ...state, fetching: false };
    case "SET_TODOS":
      return { ...state, todos: action.payload };
    case "MAKE_ACTIVE":
      const todos11 = { ...state.todos };

      const progress = [...todos11.in_progress];
      const donen = [...todos11.done];

      //add to doone todos
      const currentActiveTodo = progress[0];
      currentActiveTodo.isActive = false;
      currentActiveTodo.finishedTime = new Date().toUTCString();
      donen.push(currentActiveTodo);
      todos11.done = donen;

      //find index
      const itemIdx = progress.findIndex((item) => item.id === action.payload);
      if (itemIdx === -1) return state;
      const newActiveTodo = progress[itemIdx];
      newActiveTodo.startTime = new Date().toUTCString();
      newActiveTodo.isActive = true;

      const updatedTodos = progress.splice(0, 1);

      //find item and edite and edite
      const item = { ...progress[itemIdx] };
      updatedTodos.splice(itemIdx, 1, item);
      todos11.in_progress = progress;

      return { ...state, todos: todos11 };

    case "ADD_TODO":
      const todos1 = { ...state.todos };
      const name = action.payload;
      const idx = todos1.in_progress.length
        ? todos1.in_progress[todos1.in_progress.length - 1].id + 1
        : 0;

      const newTodo = {
        id: idx,
        name,
        isActive: false,
      };

      todos1.in_progress.push(newTodo);

      return { ...state, todos: todos1 };
    case "DELETE_TODO_ITEM":
      const id = action.payload;

      const todos2 = { ...state.todos };
      const activeTodo = [...todos2.in_progress];

      const filteredActiveTodos = activeTodo.filter((item) => item.id !== id);
      todos2.in_progress = filteredActiveTodos;

      return { ...state, todos: todos2 };

    case "FILTER_TODO_ITEMS":
      const filterText = action.payload;
      //Реализовал в локальном стейте компонента
      // console.log(filterText);

      return { ...state };
    default:
      return state;
  }
};

export default reducer;
