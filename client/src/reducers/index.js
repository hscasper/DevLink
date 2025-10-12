import { combineReducers } from 'redux';
import alert from './alert.js';
// Temporary placeholder reducer until you add real reducers
const placeholderReducer = (state = {}, action) => {
  return state;
};

export default combineReducers({
  alert,
  placeholder: placeholderReducer,
});
