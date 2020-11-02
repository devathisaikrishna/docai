import {
    ADMIN_PROFILE_INFO_REQUEST,
    ADMIN_PROFILE_INFO_SUCCESS,
    ADMIN_PROFILE_INFO_FAIL,
    GET_ADMIN_USER_REQUEST,
    GET_ADMIN_USER_INFO_SUCCESS,
    GET_ADMIN_USER_INFO_FAIL
} from "constants/UserConstants";

import { postData } from "service/Common";

// const createHistory = require("history").createHashHistory
// var history = createHistory();



const getProfileData = () => async (dispatch) => {
    dispatch({ type: ADMIN_PROFILE_INFO_REQUEST, payload: {} });
    postData("/api/admin/getprofile", {
    }).then((response) => {
        var data = response.data;

        dispatch({ type: ADMIN_PROFILE_INFO_SUCCESS, payload: data });
        
    }).catch((error) => {
        dispatch({ type: ADMIN_PROFILE_INFO_FAIL, payload: error.data });
    })
};

const getAdminUserbyid = (userid) => async (dispatch) => {
    dispatch({ type: GET_ADMIN_USER_REQUEST, payload: {} });
    postData("/api/admin/get_admin_user", {
        userid
    }).then((response) => {
        var data = response.data;
        if(data.id !== undefined){
            dispatch({ type: GET_ADMIN_USER_INFO_SUCCESS, payload: data });
        }else{
            dispatch({ type: GET_ADMIN_USER_INFO_FAIL, payload: "Data not found." });
        }
    }).catch((error) => {
        dispatch({ type: GET_ADMIN_USER_INFO_FAIL, payload: error.data });
    })
};

export { getProfileData, getAdminUserbyid };