import {
	USER_LOGIN_LOCALSTORAGE_TOKEN_KEY,
	USER_LOGIN_LOCALSTORAGE_USER_INFO_KEY,
	USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE,
} from "config/Constants";
import {
	USER_LOGIN_REQUEST,
	USER_LOGIN_SUCCESS,
	USER_LOGIN_FAIL,
	USER_LOGOUT_REQUEST,
	USER_LOGOUT_SUCCESS,
	USER_LOGOUT_FAIL,
	USER_EMAIL_IS_NOT_VERIFIED,
	USER_RESEND_EMAIL_REQUEST,
	USER_RESEND_EMAIL_SUCCESS,
	USER_RESEND_EMAIL_FAIL,
} from "constants/AuthContants";
import { postData } from "service/Common";
import { clear_auth_token } from "service/Authentication";

const createHistory = require("history").createHashHistory;
var history = createHistory();

const login = (email, password) => async (dispatch) => {
	dispatch({ type: USER_LOGIN_REQUEST, payload: { email, password } });

	postData("/api/user/login", {
		email,
		password,
	})
		.then((response) => {
			var data = response.data;

			dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

			localStorage.setItem(USER_LOGIN_LOCALSTORAGE_TOKEN_KEY, data.token);
			localStorage.setItem(USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE, data.expires);
			localStorage.setItem(USER_LOGIN_LOCALSTORAGE_USER_INFO_KEY, JSON.stringify(data.user));

			history.push("/dashboard");
		})
		.catch((error) => {
			if (error.data.email_not_verified) {
				dispatch({ type: USER_EMAIL_IS_NOT_VERIFIED, payload: error.data });
			} else {
				dispatch({ type: USER_LOGIN_FAIL, payload: error.data });
			}
		});
};

const logout = (email, password) => async (dispatch) => {
	dispatch({ type: USER_LOGOUT_REQUEST, payload: { email, password } });

	postData("/api/user/logout", {
		email,
		password,
	})
		.then((response) => {
			var data = response.data;

			clear_auth_token();

			dispatch({ type: USER_LOGOUT_SUCCESS, payload: data });

			history.push("/login");
		})
		.catch((error) => {
			dispatch({ type: USER_LOGOUT_FAIL, payload: error.data });
		});
};

const resendVerificationEmail = (email, password) => async (dispatch) => {
	dispatch({ type: USER_RESEND_EMAIL_REQUEST, payload: { email, password } });

	postData("/api/email/resend", {
		email,
		password,
	})
		.then((response) => {
			var data = response.data;

			dispatch({ type: USER_RESEND_EMAIL_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_RESEND_EMAIL_FAIL, payload: error.data });
		});
};

export { login, logout, resendVerificationEmail };
