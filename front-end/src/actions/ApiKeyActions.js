import { USER_GET_API_KEY_REQUEST, USER_GET_API_KEY_SUCCESS, USER_GET_API_KEY_FAIL } from "constants/ApiKeyConstants";
import { postData } from "service/Common";

const getApiKey = () => async (dispatch) => {
	dispatch({ type: USER_GET_API_KEY_REQUEST, payload: {} });

	postData("/api/user/get_api_key", {})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_GET_API_KEY_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_GET_API_KEY_FAIL, payload: error.data });
		});
};

export { getApiKey };
