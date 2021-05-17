import React, { Component } from "react";

const todos = [
  { id: 1, name: "Learn React" },
  { id: 2, name: "Make awesome website" },
  { id: 3, name: "Find good job" },
  { id: 4, name: "Well Done" },
];

const getTodos = async () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(todos);
    }, 500);
  });

const ListItem = ({ id, text, clickHandler }) => {
  return (
    <li>
      {text} <button onClick={() => clickHandler(id)}>del</button>
    </li>
  );
};

const List = ({ items, filterText, clickHandler }) => {
  return (
    <>
      {items
        .filter((item) => {
          if (filterText == "" || filterText.length < 3) {
            return item;
          } else if (
            item.name.toLowerCase().includes(filterText.toLowerCase())
          ) {
            return item;
          }
        })
        .map(({ id, name }) => (
          <ListItem key={id} id={id} text={name} clickHandler={clickHandler} />
        ))}
    </>
  );
};

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      todos: null,
      hasError: false,
      filterText: "",
    };
  }

  componentDidMount() {
    console.log("mount");
    getTodos()
      .then((todos) => {
        console.log(todos);

        this.setState({
          todos,
        });
      })
      .catch((error) => {
        console.log("eer");
        this.setState({
          hasError: true,
        });
      });
  }

  addHandler = () => {
    const { todos } = this.state;
    const txt = document.getElementById("newTodo");

    if (txt.value !== "") {
      const newId = todos[todos.length - 1].id + 1;
      this.setState({
        todos: [
          ...todos,
          {
            id: newId,
            name: txt.value,
          },
        ],
      });
      txt.value = "";
    }
  };

  deleteHandler = (id) => {
    const newTodos = this.state.todos.filter(({ id: itemId }) => id !== itemId);

    this.setState({
      todos: newTodos,
    });
  };

  filterHandler = (e) => {
    const value = e.target.value;

    this.setState({
      filterText: value,
    });
  };

  //TODO:
  // 1. ADD filter for todo items (start filtering when search key length >= 3)

  render() {
    const { deleteHandler, addHandler, filterHandler } = this;
    const { todos, filterText, hasError } = this.state;

    if (hasError && todos === null) return <p>Server ERROR</p>;
    if (todos === null) return <p>Loading...</p>;

    return (
      <div>
        Find todo:
        <input id="filterTodo" type="text" onChange={filterHandler} />
        <h1>Todo LIST</h1>
        <List
          items={todos}
          filterText={filterText}
          clickHandler={deleteHandler}
        />
        <br />
        Enter new todo:
        <input id="newTodo" type="text" />
        <button onClick={addHandler}>Add</button>
      </div>
    );
  }
}
