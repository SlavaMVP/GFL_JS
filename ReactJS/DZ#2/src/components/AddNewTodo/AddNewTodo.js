import React, { useRef } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as actions from "../../store/actions";

const AddNewTodo = (props) => {
  const { addTodo } = props;

  const addInputRef = useRef();

  const addHandler = () => {
    const value = addInputRef.current.value.trim();
    if (value) {
      addTodo(value);
      addInputRef.current.value = "";
    }
  };
  return (
    <div className="col-xs-12">
      <form>
        <div className="form-group">
          <label htmlFor="addInput">New Todo Item: </label>
          <input
            ref={addInputRef}
            id="addInput"
            type="text"
            className="form-control"
            placeholder="New todo name"
          />
        </div>
        <button
          type="button"
          className="btn btn-success pull-right"
          onClick={addHandler}
        >
          Add New Item
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  fetching: state.fetching,
  todos: state.todos,
});

const mapDispatchToProps = (dispatch) => {
  const { addTodo } = bindActionCreators(actions, dispatch);

  return {
    addTodo: (name) => addTodo(name),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewTodo);
