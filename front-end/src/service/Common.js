import axios from "axios";
import React from "react";
import { login_token, clear_auth_token } from "service/Authentication";
const createHistory = require("history").createHashHistory;
var history = createHistory();

export const postData = (
	url,
	data,
	options = {
		without_base_url: false,
		method_type: "post",
	}
) => {
	var BASE_URL = process.env.REACT_APP_API_BASE_URL;
	var request_url = BASE_URL + url;

	if (options.without_base_url) {
		request_url = url;
	}

	return new Promise((resolve, reject) => {
		axios({
			method: options.method_type,
			url: request_url,
			data: data,
			headers: {
				Authorization: "Bearer " + login_token(),
			},
		})
			.then(function (response) {
				resolve(response);
			})
			.catch(function (error) {
				if (error.response) {
					if (error.response.status === 401 && error.response.data.hasOwnProperty('unauthenticated')) {
						clear_auth_token();
						history.push("/login");
					}
					reject(error.response);
				} else {
					reject({ data: { error: 'Network Error' } });
				}
			});
	});
};