import {
	USER_GET_CURRENT_PLAN_REQUEST, USER_GET_CURRENT_PLAN_SUCCESS, USER_GET_CURRENT_PLAN_FAIL, USER_GET_CURRENT_PLAN_CLEAR_DATA,
	USER_GET_ALL_PLAN_REQUEST, USER_GET_ALL_PLAN_SUCCESS, USER_GET_ALL_PLAN_PLAN_FAIL, CLEAR_USER_GET_ALL_PLAN_DATA
} from "constants/CurrentPlanConstants";
import { postData } from "service/Common";

const get_current_plan = () => async (dispatch) => {
	dispatch({ type: USER_GET_CURRENT_PLAN_REQUEST, payload: true });
	postData("/api/user/get_current_plan", {})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_GET_CURRENT_PLAN_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_GET_CURRENT_PLAN_FAIL, payload: error.data });
		});
};

const clear_current_plan = () => async (dispatch) => {
	dispatch({ type: USER_GET_CURRENT_PLAN_CLEAR_DATA, payload: true });
};

const get_all_user_plan = () => async (dispatch) => {
	dispatch({ type: USER_GET_ALL_PLAN_REQUEST, payload: true });
	postData("/api/get_all_plans", {})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_GET_ALL_PLAN_SUCCESS, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_GET_ALL_PLAN_PLAN_FAIL, payload: error.data });
		});
};

const clear_all_user_plan = () => async (dispatch) => {
	dispatch({ type: CLEAR_USER_GET_ALL_PLAN_DATA, payload: true });
};
export { get_current_plan, get_all_user_plan, clear_current_plan, clear_all_user_plan };