import actions from "./actions";

const initState = {
    isLoading: false,
    lstDriver: [],
    freeDriver: [],
    isLoading_route: false,
    distance: 0,
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
                freeDriver: action.payload.dataFree,
                isLoading: false

            }
        case actions.type.GET_ROUTE:
            return {
                ...state,
                isLoading_route: true
            }
        case actions.type.GET_ROUTE_DONE:
            return {
                ...state,
                distance: action.payload.data,
                isLoading_route: false

            }

        default:
            return state;
    }
};

export default reducer;
