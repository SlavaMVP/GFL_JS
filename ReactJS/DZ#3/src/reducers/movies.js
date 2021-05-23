import {
  FETCH_MOVIES_STARTED,
  FETCH_MOVIES_FAILURE,
  FETCH_MOVIES_SUCCESS,
} from "actions/types";

const initialState = {
  movies: null,
  fetchingMovies: false,
  moviesError: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MOVIES_STARTED: {
      return {
        ...state,
        fetchingMovies: true,
        moviesError: false,
      };
    }
    case FETCH_MOVIES_FAILURE: {
      return {
        ...state,
        fetchingMovies: false,
        moviesError: true,
      };
    }
    case FETCH_MOVIES_SUCCESS: {
      return {
        ...state,
        fetchingMovies: false,
        movies: action.payload,
      };
    }

    default:
      return state;
  }
}
