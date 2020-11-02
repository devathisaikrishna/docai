import {
    USER_GET_CURRENT_PLAN_REQUEST, USER_GET_CURRENT_PLAN_SUCCESS, USER_GET_CURRENT_PLAN_FAIL, USER_GET_CURRENT_PLAN_CLEAR_DATA,
    USER_GET_ALL_PLAN_REQUEST, USER_GET_ALL_PLAN_SUCCESS, USER_GET_ALL_PLAN_PLAN_FAIL, CLEAR_USER_GET_ALL_PLAN_DATA
} from "constants/CurrentPlanConstants";

function PlanReducers(state = {
    current_plan_loading : true,
    current_plan: { no_plan: true },
    subscription: { no_subscription: true },
    next_payment: {},

    get_all_loading : true,
    all_plans: [],
    any_active_plan: false,
    _current_plan_id: null,
    subscription_pending : false,
}, action) {

    switch (action.type) {
        case USER_GET_CURRENT_PLAN_REQUEST:
            return { ...state, current_plan_loading: true };
        case USER_GET_CURRENT_PLAN_SUCCESS:
            return { ...state, current_plan_loading: false, ...action.payload };
        case USER_GET_CURRENT_PLAN_FAIL:
            return { ...state, current_plan_loading: false, getApiKeyFailed: action.payload };

        case USER_GET_CURRENT_PLAN_CLEAR_DATA:
            return {
                ...state,
                current_plan_loading: true,
                current_plan: { no_plan: true },
                subscription: { no_subscription: true },
                next_payment: {},
            };

        case USER_GET_ALL_PLAN_REQUEST:
            return { ...state, get_all_loading: true };
        case USER_GET_ALL_PLAN_SUCCESS:
            return {
                ...state,
                get_all_loading: false,
                all_plans: action.payload.plans,
                any_active_plan: action.payload.any_active_plan,
                _current_plan_id: action.payload._current_plan_id,
                subscription_pending: action.payload.subscription_pending
            };

        case CLEAR_USER_GET_ALL_PLAN_DATA:
            return {
                ...state,
                get_all_loading: true,
                all_plans: [],
                any_active_plan: false,
                _current_plan_id: null,
                subscription_pending: false,
            };
        case USER_GET_ALL_PLAN_PLAN_FAIL:
            return { ...state, get_all_loading: false, getApiKeyFailed: action.payload };

        default:
            return state;
    }
}

export { PlanReducers };