import {
  FETCH_PLANETS_STARTED,
  FETCH_PLANETS_FAILURE,
  FETCH_PLANETS_SUCCESS,
} from "actions/types";

const initialState = {
  planets: null,
  fetchingPlanets: false,
  planetsError: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PLANETS_STARTED: {
      return {
        ...state,
        fetchingPlanets: true,
        planetsError: false,
      };
    }
    case FETCH_PLANETS_FAILURE: {
      return {
        ...state,
        fetchingPlanets: false,
        planetsError: true,
      };
    }
    case FETCH_PLANETS_SUCCESS: {
      return {
        ...state,
        fetchingPlanets: false,
        planets: action.payload,
      };
    }

    default:
      return state;
  }
}
