import {
	USER_GET_CART_REQUEST, USER_GET_CART_SUCCESS, USER_GET_CART_FAIL, 
	USER_CLEAN_CART,
	USER_GET_COUNTRY_OPTION_REQUEST, USER_GET_COUNTRY_OPTION_SUCCESS, USER_GET_COUNTRY_OPTION_FAIL
} from "constants/CartContants";
import { postData } from "service/Common";

const get_cart = (req) => async (dispatch) => {
	dispatch({ type: USER_GET_CART_REQUEST, payload: true });
	postData("/api/user/get_cart", req)
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_GET_CART_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_GET_CART_FAIL, payload: error.data });
		});
};

const get_country_list = () => async (dispatch) => {
	dispatch({ type: USER_GET_COUNTRY_OPTION_REQUEST, payload: true });
	postData("/api/user/get_all_country_option", {}, {method_type: "GET"})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_GET_COUNTRY_OPTION_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_GET_COUNTRY_OPTION_FAIL, payload: error.data });
		});
};

const clean_cart = () => async (dispatch) => {
	dispatch({ type: USER_CLEAN_CART, payload: [] });
};

export { get_cart, get_country_list, clean_cart };