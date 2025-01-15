import { combineReducers } from "redux";
import { ChangeState } from "./reducers";
const appReducer = combineReducers({
  ChangeState,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    window.sessionStorage.removeItem("persist:root");
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
export default rootReducer;
