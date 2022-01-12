import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import { userReducer } from "./reducers/userReducer";

const rootReducer = combineReducers({
  //   dashboard: userReducer,
  //   appConfig: appReducer,
});

const middlewares = [thunk];

// const devTools =
//   process.env.NODE_ENV !== "production" && window.__REDUX__DEVTOOLS_EXTENSION__
//     ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
//       window.__REDUX_DEVTOOLS_EXTENSION__()
//     : (a) => a;

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares))
);

export default store;
