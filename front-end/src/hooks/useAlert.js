import { useReducer } from "react";

const initialState = {
    message: undefined,
    type: undefined
};

export const ALERT_TYPE = {
    INFO: 0,
    SUCCESS: 1,
    WARNING: 2,
    ERROR: 3,
    RESET: 4
}

function reducer(_ , action) {
    switch (action.type) {
        case ALERT_TYPE.SUCCESS: case ALERT_TYPE.ERROR:
            return {
                message: action.payload.message,
                type: action.type,
                visible: true
            };
        case ALERT_TYPE.RESET:
            return initialState
        default:
            throw new Error();
    }
}

export default function useAlert() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return {
        message: state.message,
        type: state.type,
        dispatch
    }
}