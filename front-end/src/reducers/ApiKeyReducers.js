import {
    USER_GET_API_KEY_REQUEST,
    USER_GET_API_KEY_SUCCESS,
    USER_GET_API_KEY_FAIL,
} from "constants/ApiKeyConstants";

function ApiKeyReducers(state = {}, action) {

    switch (action.type) {
        case USER_GET_API_KEY_REQUEST:
            return { loading: true };
        case USER_GET_API_KEY_SUCCESS:

            return { loading: false, ...action.payload };
        case USER_GET_API_KEY_FAIL:
            return { loading: false, getApiKeyFailed: action.payload };

        default:
            return state;
    }
}

export { ApiKeyReducers };