import axios from "axios";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  //GET_ERRORS,
  CLER_CURRENT_PROFILE
} from "./types";

// get current profiles
export const getCurrentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

//Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

//clear Profile
export const clearCurrentProfile = () => {
  return {
    type: CLER_CURRENT_PROFILE
  };
};
