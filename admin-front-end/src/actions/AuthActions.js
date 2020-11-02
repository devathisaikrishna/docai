import { LOGIN_LOCALSTORAGE_TOKEN_KEY, LOGIN_LOCALSTORAGE_USER_INFO_KEY, USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE } from "config/Constants";
import {
	ADMIN_LOGIN_REQUEST,
	ADMIN_LOGIN_SUCCESS,
	ADMIN_LOGIN_FAIL,
	ADMIN_LOGOUT_REQUEST,
	ADMIN_LOGOUT_SUCCESS,
	ADMIN_LOGOUT_FAIL,
} from "constants/AuthContants";
import { postData } from "service/Common";
import { ToastMessage } from "service/ToastMessage";

const createHistory = require("history").createHashHistory;
var history = createHistory();

const login = (email, password) => async (dispatch) => {
	dispatch({ type: ADMIN_LOGIN_REQUEST, payload: { email, password } });

	postData("/api/admin/login", {
		email,
		password,
	})
		.then((response) => {
			var data = response.data;
			ToastMessage(data.message, "s");
			dispatch({ type: ADMIN_LOGIN_SUCCESS, payload: data });

			localStorage.setItem(LOGIN_LOCALSTORAGE_TOKEN_KEY, data.token);
			localStorage.setItem(USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE, data.expires);
			localStorage.setItem(LOGIN_LOCALSTORAGE_USER_INFO_KEY, JSON.stringify(data.user));

			setTimeout(() => {
				history.push("/dashboard");
			}, 1000);
		})
		.catch((error) => {
			ToastMessage(error.data.error, "e");
			dispatch({ type: ADMIN_LOGIN_FAIL, payload: error.data });
		});
};

const logout = (email, password) => async (dispatch) => {
	dispatch({ type: ADMIN_LOGOUT_REQUEST, payload: { email, password } });

	postData("/api/admin/logout", {
		email,
		password,
	})
		.then((response) => {
			var data = response.data;

			localStorage.removeItem(LOGIN_LOCALSTORAGE_TOKEN_KEY);
			localStorage.removeItem(LOGIN_LOCALSTORAGE_USER_INFO_KEY);
			localStorage.removeItem(USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE);

			dispatch({ type: ADMIN_LOGOUT_SUCCESS, payload: data });

			history.push("/");
		})
		.catch((error) => {
			dispatch({ type: ADMIN_LOGOUT_FAIL, payload: error.data });
		});
};

export { login, logout };
