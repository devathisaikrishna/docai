import { LOGIN_LOCALSTORAGE_TOKEN_KEY, LOGIN_LOCALSTORAGE_USER_INFO_KEY, USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE } from "config/Constants";

export const isLoggedIn = () => {
	return !!localStorage.getItem(LOGIN_LOCALSTORAGE_TOKEN_KEY);
};

export const userInfo = () => {
	return JSON.parse(localStorage.getItem(LOGIN_LOCALSTORAGE_USER_INFO_KEY)) || {};
};

export const login_token = () => {
	return localStorage.getItem(LOGIN_LOCALSTORAGE_TOKEN_KEY);
};

export const clear_auth_token = () => {
	localStorage.removeItem(LOGIN_LOCALSTORAGE_TOKEN_KEY);
	localStorage.removeItem(LOGIN_LOCALSTORAGE_USER_INFO_KEY);
	localStorage.removeItem(USER_LOGIN_LOCALSTORAGE_TOKEN_EXPIRE);
};
