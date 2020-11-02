import {
    BLOCK_UI,
} from "constants/BlockUIConstants";

function BlockUIReducers(state = {
    loading: false
}, action) {

    switch (action.type) {

        case BLOCK_UI:
            return {...state, loading: action.payload };

        default:
            return state;
    }
}

export { BlockUIReducers };