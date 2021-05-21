import React from "react";

import ListItem from "./ListItem/ListItem";
import Button from "../UI/Button";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../../store/actions";

function List(props) {
  let listType;

  const renderDoneItem = ({ name, finishedTime }) => (
    <>
      <span className="badge">
        {new Date(finishedTime).toLocaleTimeString()}
      </span>
      {name}
    </>
  );

  const { todoList, type, todos, deleteTodo, makeActive, makeDone } = props;
  const makeActiveHandler = (id) => {
    makeActive(id);
  };
  const deleteHandler = (id) => {
    deleteTodo(id);
  };

  const makeDoneHandler = (id) => {
    makeDone(id);
  };

  const renderInProgressItem = ({ name, id, isActive }) => {
    let nextTodoId = todos.in_progress[1]?.id;
    let numberOfTodos = todos.in_progress.length;
    let buttons = null;
    if (isActive && numberOfTodos === 1) {
      buttons = (
        <Button
          name="Complete"
          type="start"
          action={makeDoneHandler.bind(null, id)}
        />
      );
    } else if (isActive) {
      buttons = null;
    } else if (id !== null && id === nextTodoId) {
      buttons = (
        <>
          <Button
            name="Start"
            type="start"
            action={makeActiveHandler.bind(null, id)}
          />
          <Button
            name="Del"
            type="delete"
            action={deleteHandler.bind(null, id)}
          />
        </>
      );
    } else {
      buttons = (
        <Button
          name="Del"
          type="delete"
          action={deleteHandler.bind(null, id)}
        />
      );
    }
    return (
      <>
        {name}
        {buttons}
      </>
    );
  };

  if (type === "active") {
    if (todoList.length === 0) {
      return (listType = <p>There is no active todos.Add one!</p>);
    }
    listType = todoList.map((item) => {
      const { id } = item;
      return <ListItem key={id} item={item} render={renderInProgressItem} />;
    });
  } else {
    if (todos.done.length === 0) {
      return (listType = <p>You did nothing at this point!!</p>);
    }
    listType = todos.done.map((item) => {
      const { id } = item;

      return <ListItem key={id} item={item} render={renderDoneItem} />;
    });
  }

  return <ul>{listType}</ul>;
}

const mapStateToProps = (state) => ({
  fetching: state.fetching,
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) => {
  const { deleteTodo, makeActive, makeDone } = bindActionCreators(
    actions,
    dispatch
  );

  return {
    deleteTodo: (id) => deleteTodo(id),
    makeActive: (id) => makeActive(id),
    makeDone: (id) => makeDone(id),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
