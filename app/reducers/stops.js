import * as types from '../actions/actionTypes';

const initialState = [];

export default function counter(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_STOPS:
      return action.payload
    default:
      return state;
  }
}
