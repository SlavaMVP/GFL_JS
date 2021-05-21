import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import List from "./components/List/List";
import Filter from "./components/Filter/Filter";
import Loader from "./components/UI/Loader";
import AddNewTodo from "./components/AddNewTodo/AddNewTodo";

import * as actions from "./store/actions";

const App = (props) => {
  //фильтрованный масив решил хранить в локальном стейте
  const [filteredList, setFilteredList] = useState([]);

  const { setTodos, todos, startLoad, fetching, endLoad } = props;

  const filterInputRef = useRef();

  useEffect(() => {
    (async () => {
      startLoad();
      const { in_progress, done } = await fetch("/todos.json").then((res) =>
        res.json()
      );

      setTodos({
        in_progress,
        done,
      });
      endLoad();
      console.log("app init");
    })();

    return () => {};
  }, []);

  const filterHandler = () => {
    const filterText = filterInputRef.current.value.trim();
    let filteredArr = [];
    if (filterText.length >= 3) {
      filteredArr = todos.in_progress.filter((item) => {
        if (item.name.toLowerCase().includes(filterText.toLowerCase())) {
          return item;
        }
      });
    }
    if (filteredList.length !== filteredArr.length) {
      setFilteredList(filteredArr);
    }
  };

  const todoData = filteredList.length ? filteredList : todos?.in_progress;

  return (
    <div className="container">
      <h1>Todo React APP</h1>
      <div className="row">
        <AddNewTodo />
      </div>
      <hr />
      <div className="row">
        <div className="col-xs-12 col-sm-6">
          <h3>Todos in progress</h3>
          {fetching ? <Loader /> : <List todoList={todoData} type="active" />}

          <p>Things to do: {todos?.in_progress.length}</p>
        </div>
        <div className="col-xs-12 col-sm-6">
          <h3>Done</h3>

          {fetching ? <Loader /> : <List type="done"></List>}

          <p>Done: {todos?.done.length}</p>
        </div>
      </div>
      <Filter refInput={filterInputRef} filterFn={filterHandler} />
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetching: state.fetching,
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) => {
  const { startLoad, setTodos, endLoad } = bindActionCreators(
    actions,
    dispatch
  );

  return {
    startLoad,
    endLoad,
    setTodos: (list) => setTodos(list),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
