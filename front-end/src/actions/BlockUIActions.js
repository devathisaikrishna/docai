import {
	BLOCK_UI, 
} from "constants/CartContants";

const blockUI = (status) => async (dispatch) => {
	dispatch({ type: BLOCK_UI, payload: status });
};

export { blockUI };