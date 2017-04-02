import * as types from './actionTypes';

export function setStops(payload) {
  return {
    type: types.SET_STOPS,
    payload
  };
}
