import React from "react";

export default function Button({ name, type, action }) {
  return (
    <button
      type="button"
      className={type === "start" ? "btn btn-primary" : "btn btn-danger"}
      onClick={action}
    >
      {name}
    </button>
  );
}
