import actions from "./actions";

const initState = {
    isLoading: false,
    lstDriver: [],
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.type.GET_LIST_DRIVER:
            return {
                ...state,
                isLoading: true
            }
        case actions.type.GET_LIST_DRIVER_DONE:
            return {
                ...state,
                lstDriver: action.payload.data,
                isLoading: false

            }

        default:
            return state;
    }
};

export default reducer;
