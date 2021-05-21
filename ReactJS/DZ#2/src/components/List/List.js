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

  const { todoList, type, todos, deleteTodo, makeActive } = props;
  //console.log(todos);
  const makeActiveHandler = (id) => {
    makeActive(id);
  };
  const deleteHandler = (id) => {
    deleteTodo(id);
  };

  const renderInProgressItem = ({ name, id, isActive }) => {
    let nextTodoId = todos.in_progress[1]?.id;
    let buttons = null;
    if (isActive) {
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
    listType = todoList.map((item) => {
      const { id } = item;

      return <ListItem key={id} item={item} render={renderInProgressItem} />;
    });
  } else {
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
  const { deleteTodo, makeActive } = bindActionCreators(actions, dispatch);

  return {
    deleteTodo: (id) => deleteTodo(id),
    makeActive: (id) => makeActive(id),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(List);
