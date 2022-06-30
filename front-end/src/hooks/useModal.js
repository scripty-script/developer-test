import { useReducer } from "react";

const initialState = {
    visible: false,
    sub: undefined,
    data: undefined
};

export const ACTION = {
    SHOW: 0,
    HIDE: 1
}

function reducer(_, action) {
    switch (action.type) {
        case ACTION.SHOW:
            return {
                sub: action.payload.sub,
                visible: true,
                data: action.payload?.data
            };
        case ACTION.HIDE:
            return initialState
        default:
            throw new Error();
    }
}

export default function useModal() {
    const [state, dispatch] = useReducer(reducer, initialState);

    return { ...state, dispatch }
}