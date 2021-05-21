const initialState = {
  fetching: true,
  todos: null,
  // filteredTodos: [],
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
      const todos = { ...state.todos };

      const todosInProgress = [...todos.in_progress];
      const todosDode = [...todos.done];

      //add todo that was active into the done todo list
      const finishedTodo = todosInProgress[0];
      finishedTodo.isActive = false;
      finishedTodo.finishedTime = new Date().toUTCString();
      todosDode.push(finishedTodo);

      //find index of clicked todo by it's id
      const itemIdx = todosInProgress.findIndex(
        (item) => item.id === action.payload
      );
      if (itemIdx === -1) return state;

      //make clicked todo active
      const nextActiveTodo = todosInProgress[itemIdx];
      nextActiveTodo.startTime = new Date().toUTCString();
      nextActiveTodo.isActive = true;

      const updatedTodos = todosInProgress.splice(0, 1);

      //find item and edite and edite
      const item = { ...todosInProgress[itemIdx] };
      updatedTodos.splice(itemIdx, 1, item);

      //put it back to copied state
      todos.done = todosDode;
      todos.in_progress = todosInProgress;

      return { ...state, todos };

    case "ADD_TODO":
      const todoLists = { ...state.todos };
      const activeList = [...todoLists.in_progress];
      const name = action.payload;
      const idx = activeList.length
        ? activeList[activeList.length - 1].id + 1
        : 0;

      const newTodo = {
        id: idx,
        name,
        isActive: false,
      };

      activeList.push(newTodo);
      todoLists.in_progress = activeList;

      return { ...state, todos: todoLists };
    case "DELETE_TODO_ITEM":
      const todosList = { ...state.todos };
      const activeTodo = [...todosList.in_progress];
      const id = action.payload;

      const filteredActiveTodos = activeTodo.filter((item) => item.id !== id);
      todosList.in_progress = filteredActiveTodos;

      return { ...state, todos: todosList };

    case "MAKE_DONE":
      const todoListItems = { ...state.todos };

      const inProg = [...todoListItems.in_progress];
      const finished = [...todoListItems.done];

      //add to doone todos
      const aTodo = inProg[0];
      aTodo.isActive = false;
      aTodo.finishedTime = new Date().toUTCString();
      finished.push(aTodo);
      todoListItems.done = finished;

      //delete from in_progress
      const clearedTodos = [];

      todoListItems.in_progress = clearedTodos;

      return { ...state, todos: todoListItems };

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
