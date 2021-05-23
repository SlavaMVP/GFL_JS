import {
  FETCH_PLANETS_STARTED,
  FETCH_PLANETS_FAILURE,
  FETCH_PLANETS_SUCCESS,
} from "./types";

import planetsApiService from "services/planets";

const loadPlanetsSuccess = (planets) => ({
  type: FETCH_PLANETS_SUCCESS,
  payload: {
    ...planets,
  },
});

const loadPlanetsStarted = () => ({
  type: FETCH_PLANETS_STARTED,
});

const loadPlanetsFailure = () => ({
  type: FETCH_PLANETS_FAILURE,
});

export const loadPlanets =
  (page = 1) =>
  async (dispatch) => {
    dispatch(loadPlanetsStarted());

    try {
      const planets = await planetsApiService
        .getPlanets(page)
        .then((res) => res.json());

      dispatch(loadPlanetsSuccess(planets));
    } catch {
      dispatch(loadPlanetsFailure());
    }
  };
