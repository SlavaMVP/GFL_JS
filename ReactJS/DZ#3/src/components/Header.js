import React from "react";
import { Link, NavLink } from "react-router-dom";

import LinkItem from "./LinkItem";

export default function Header() {
  return (
    <nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <Link className="navbar-brand" to="/">
            StarWars
          </Link>
        </div>

        <ul className="nav navbar-nav">
          <NavLink to="/planets" component={LinkItem}>
            Planets
          </NavLink>
          <NavLink to="/characters" component={LinkItem}>
            Characters
          </NavLink>
          <NavLink to="/films" component={LinkItem}>
            Films
          </NavLink>
          <NavLink to="/startships" component={LinkItem}>
            Starships
          </NavLink>
          <NavLink to="/characters" component={LinkItem}>
            Species
          </NavLink>
        </ul>
      </div>
    </nav>
  );
}
