import { USER_REPORT_OPTION_REQUEST, USER_REPORT_OPTION_SUCCESS_INFO, USER_REPORT_OPTION_FAIL } from "constants/ReportConstants";
import { postData } from "service/Common";

//const createHistory = require("history").createHashHistory;
//var history = createHistory();

const getReporOptiontData = (data) => async (dispatch) => {
	dispatch({ type: USER_REPORT_OPTION_REQUEST, payload: true });
	postData("/api/user/getReportOptionData", {})
		.then((response) => {
			var data = response.data;
			dispatch({ type: USER_REPORT_OPTION_SUCCESS_INFO, payload: data });
		})
		.catch((error) => {
			dispatch({ type: USER_REPORT_OPTION_FAIL, payload: error.data });
		});
};

export { getReporOptiontData };
