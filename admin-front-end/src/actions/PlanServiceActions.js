import { postData } from "service/Common"
import {
    ADMIN_SYSTEM_SERVICES,
    ADMIN_GET_PLAN_DETAILS,
    ADMIN_GET_PLAN_OPTIONS
} from "constants/PlanServiceContants";

const get_services = () => async (dispatch) => {
    postData("/api/admin/get_services", {}, {method_type : "GET"}).then((response) => {
        var data = response.data;

        dispatch({ type: ADMIN_SYSTEM_SERVICES, payload: data });
    }).catch((error) => {
       
    })
};

const get_plan_details = (plan_id) => async (dispatch) => {
    postData("/api/admin/get_plan_details", {plan_id}).then((response) => {
        var data = response.data;

        dispatch({ type: ADMIN_GET_PLAN_DETAILS, payload: data });
    }).catch((error) => {
       
    })
};

const clean_plan_details = (plan_id) => async (dispatch) => {
    dispatch({ type: ADMIN_GET_PLAN_DETAILS, payload: {} });
};

const get_plan_options = () => async (dispatch) => {
    postData("/api/admin/get_plan_options", {}).then((response) => {
        var data = response.data;

        dispatch({ type: ADMIN_GET_PLAN_OPTIONS, payload: data });
    }).catch((error) => {
       
    })
};


export { get_services, get_plan_details, get_plan_options, clean_plan_details };