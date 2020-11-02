const {
    ADMIN_PROFILE_INFO_REQUEST,
    ADMIN_PROFILE_INFO_SUCCESS,
    ADMIN_PROFILE_INFO_FAIL,
    GET_ADMIN_USER_REQUEST,
    GET_ADMIN_USER_INFO_SUCCESS,
    GET_ADMIN_USER_INFO_FAIL
} = require("constants/UserConstants");

function AdminProfileReducers(state = {}, action) {
    switch (action.type) {
        case ADMIN_PROFILE_INFO_REQUEST:
            return { loading: true };
        case ADMIN_PROFILE_INFO_SUCCESS:
            return { loading: false, getUserProfile: action.payload };
        case ADMIN_PROFILE_INFO_FAIL:
            return { loading: false, getUserProfileFail: action.payload };
        default:
            return state;
    }
}

function AdminUserReducers(state = {}, action) {
    switch (action.type) {
        case GET_ADMIN_USER_REQUEST:
            return { loading: true };
        case GET_ADMIN_USER_INFO_SUCCESS:
            return { loading: false, getUserInfo: action.payload };
        case GET_ADMIN_USER_INFO_FAIL:
            return { loading: false, getUserInfoFail: action.payload };
        default:
            return state;
    }
}
export { AdminProfileReducers, AdminUserReducers };