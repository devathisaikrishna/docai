const {
    ADMIN_LOGIN_REQUEST,
    ADMIN_LOGIN_SUCCESS,
    ADMIN_LOGIN_FAIL,
    ADMIN_LOGOUT_REQUEST,
    ADMIN_LOGOUT_SUCCESS,
    ADMIN_LOGOUT_FAIL,
} = require("constants/AuthContants");

function AuthReducers(state = {}, action) {
    switch (action.type) {
        case ADMIN_LOGIN_REQUEST:
            return { loading: true };
        case ADMIN_LOGIN_SUCCESS:
            return { loading: false, loginSuccess: action.payload };
        case ADMIN_LOGIN_FAIL:
            return { loading: false, loginFailed: action.payload };
        default:
            return state;
    }
}

function LogoutReducers(state = {}, action) {
    switch (action.type) {
        case ADMIN_LOGOUT_REQUEST:
            return { loading: true };
        case ADMIN_LOGOUT_SUCCESS:
            return { loading: false, logoutSuccess: action.payload };
        case ADMIN_LOGOUT_FAIL:
            return { loading: false, logoutFailed: action.payload };
        default:
            return state;
    }
}

export { AuthReducers, LogoutReducers };