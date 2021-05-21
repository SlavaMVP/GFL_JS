import React from "react";

export default function Filter({ refInput, filterFn }) {
  return (
    <div className="row">
      <div className="col-xs-12">
        <form>
          <div className="form-group">
            <label htmlFor="addInput">Filter todos: </label>
            <input
              ref={refInput}
              id="filterInput"
              type="text"
              className="form-control"
              placeholder="Find todo"
              onChange={filterFn}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
