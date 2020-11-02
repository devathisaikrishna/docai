const {
    USER_REPORT_OPTION_REQUEST,
    USER_REPORT_OPTION_SUCCESS_INFO,
    USER_REPORT_OPTION_FAIL
} = require("constants/ReportConstants");

function ReportDataReducers(state = {}, action) {
    switch (action.type) {
        case USER_REPORT_OPTION_REQUEST:
            return { loading: true };
        case USER_REPORT_OPTION_SUCCESS_INFO:
            return { loading: false, reporOptiontData: action.payload };
        case USER_REPORT_OPTION_FAIL:
            return { loading: false, reportOptionDataFail: action.payload };
        default:
            return state;
    }
}

export { ReportDataReducers };