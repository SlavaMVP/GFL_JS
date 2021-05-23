import { combineReducers } from "redux";

import planetsReducer from "./planets";
import moviesReducer from "./movies";

export default combineReducers({
  planets: planetsReducer,
  movies: moviesReducer,
});
