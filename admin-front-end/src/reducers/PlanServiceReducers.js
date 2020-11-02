const {
    ADMIN_SYSTEM_SERVICES,
    ADMIN_GET_PLAN_DETAILS,
    ADMIN_GET_PLAN_OPTIONS
} = require("constants/PlanServiceContants");

function PlanServiceReducers(state = {
    app_services : [],
    plan_details : {},
    plans_options : [],
}, action) {
    
    switch (action.type) {
        case ADMIN_SYSTEM_SERVICES:
            return {...state, app_services: action.payload };
        case ADMIN_GET_PLAN_DETAILS:
            return {...state, plan_details: action.payload };
        case ADMIN_GET_PLAN_OPTIONS:
            return {...state, plans_options: action.payload };
        default:
            return state;
    }
}

export { PlanServiceReducers };