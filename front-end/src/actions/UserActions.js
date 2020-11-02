import { USER_PROFILE_REQUEST, USER_PROFILE_SUCCESS_INFO, USER_PROFILE_FAIL_ERROR } from "constants/UserContants";
import { postData } from "service/Common";

//const createHistory = require("history").createHashHistory;
//var history = createHistory();

const getUserProfile = () => async (dispatch) => {
	dispatch({ type: USER_PROFILE_REQUEST, payload: true });
	postData("/api/user/getProfile", {})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_PROFILE_SUCCESS_INFO, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_PROFILE_FAIL_ERROR, payload: error.data });
		});
};

export { getUserProfile };
