import {
    USER_GET_CART_REQUEST, USER_GET_CART_SUCCESS, USER_GET_CART_FAIL,
    USER_CLEAN_CART,
    USER_GET_COUNTRY_OPTION_REQUEST, USER_GET_COUNTRY_OPTION_SUCCESS, USER_GET_COUNTRY_OPTION_FAIL
} from "constants/CartContants";

function CartReducers(state = {
    plan: {},
    sub_total : 0,
    gst : 0,
    total : 0,
    coupon : {},
    countries : []
}, action) {

    switch (action.type) {
        case USER_GET_CART_REQUEST:
            return { ...state, cart_loading: true };
        case USER_GET_CART_SUCCESS:
            return { ...state, cart_loading: false, ...action.payload };
        case USER_GET_CART_FAIL:
            return { ...state, cart_loading: false, cartFailed: action.payload };

        case USER_CLEAN_CART:
            return { ...state, plan: {}, sub_total: 0, gst : 0, total : 0, coupon : {}};

        case USER_GET_COUNTRY_OPTION_REQUEST:
            return { ...state, country_loading: true };
        case USER_GET_COUNTRY_OPTION_SUCCESS:
            return { ...state, country_loading: false, countries : action.payload };
        case USER_GET_COUNTRY_OPTION_FAIL:
            return { ...state, country_loading: false, cartFailed: action.payload };

        default:
            return state;
    }
}

export { CartReducers };