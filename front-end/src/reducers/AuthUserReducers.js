const {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_EMAIL_IS_NOT_VERIFIED,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAIL,
    USER_RESEND_EMAIL_REQUEST,
    USER_RESEND_EMAIL_SUCCESS,
    USER_RESEND_EMAIL_FAIL,
} = require("constants/AuthContants");
const {USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS_INFO,
    USER_PROFILE_FAIL_ERROR
} = require("constants/UserContants");

function AuthUserReducers(state = {}, action) {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true, logingUserEMailIsNotVerified: false };
        case USER_LOGIN_SUCCESS:
            return { loading: false, loginSuccess: action.payload };
        case USER_LOGIN_FAIL:
            return { loading: false, loginFailed: action.payload };
            
        case USER_EMAIL_IS_NOT_VERIFIED:
            return { loading: false, logingUserEMailIsNotVerified: true };

        case USER_RESEND_EMAIL_REQUEST:
            return { loading_sending_email: true, logingUserEMailIsNotVerified: false, mailSended: false };
        case USER_RESEND_EMAIL_SUCCESS:
            return { loading_sending_email: false, verificationEMailSended: action.payload };
        case USER_RESEND_EMAIL_FAIL:
            return { loading_sending_email: false, verificationEMailFailed: action.payload };

        default:
            return state;
    }
}

function LogoutUserReducers(state = {}, action) {
    switch (action.type) {
        case USER_LOGOUT_REQUEST:
            return { loading: true };
        case USER_LOGOUT_SUCCESS:
            return { loading: false, logoutSuccess: action.payload };
        case USER_LOGOUT_FAIL:
            return { loading: false, logoutFailed: action.payload };
        default:
            return state;
    }
}

function UserProfileReducers(state = {}, action) {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { loading: true };
        case USER_PROFILE_SUCCESS_INFO:
            return { loading: false, userProfileInfo: action.payload };
        case USER_PROFILE_FAIL_ERROR:
            return { loading: false, userProfileInfoEmpty: action.payload };
        default:
            return state;
    }
}

export { AuthUserReducers, LogoutUserReducers, UserProfileReducers };