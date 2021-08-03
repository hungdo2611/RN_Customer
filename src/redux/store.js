import { createStore, compose, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./sagas";
import reducer from "./reducers";

const middleWare = [];

let sagaMiddleware = null;
let store = null;



  sagaMiddleware = createSagaMiddleware();
  middleWare.push(sagaMiddleware);

store = createStore(reducer, {}, compose(applyMiddleware(...middleWare)));

rootSaga.map(sagaMiddleware.run);

if (module.hot) {
  module.hot.accept(() => {
    store.replaceReducer(reducer);
  });
}

export default store;
