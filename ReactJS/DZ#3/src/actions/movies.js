import {
  FETCH_MOVIES_STARTED,
  FETCH_MOVIES_FAILURE,
  FETCH_MOVIES_SUCCESS,
} from "./types";

import moviesApiService from "services/movies";

const loadMoviesSuccess = (movies) => ({
  type: FETCH_MOVIES_SUCCESS,
  payload: {
    ...movies,
  },
});

const loadMoviesStarted = () => ({
  type: FETCH_MOVIES_STARTED,
});

const loadMoviesFailure = () => ({
  type: FETCH_MOVIES_FAILURE,
});

export const loadMovies =
  (page = 1) =>
  async (dispatch) => {
    dispatch(loadMoviesStarted());

    try {
      const movies = await moviesApiService
        .getMovies(page)
        .then((res) => res.json());

      dispatch(loadMoviesSuccess(movies));
    } catch {
      dispatch(loadMoviesFailure());
    }
  };
