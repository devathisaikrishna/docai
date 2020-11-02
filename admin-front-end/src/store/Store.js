import dotenv from "dotenv";
import { combineReducers } from "redux";
import AdminReducers from "reducers";

import { createStore, applyMiddleware, compose } from "redux";
import thunkMiddleware from "redux-thunk";

dotenv.config();

//const store = createStore(rootReducer)

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const checkTokenExpirationMiddleware = (store) => (next) => (action) => {
	// const token = localStorage.getItem("user-token-expire");
	// if (token < Date.now() / 1000) {
	// 	next(action);
	// 	localStorage.clear();
	// }
	next(action);
};

const Store = createStore(
	combineReducers({
		AdminReducers,
	}),
	composeEnhancer(applyMiddleware(thunkMiddleware, checkTokenExpirationMiddleware))
);

export default Store;
