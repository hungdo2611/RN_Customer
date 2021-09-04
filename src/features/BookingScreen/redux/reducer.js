import actions from "./actions";

const initState = {
    isLoading_crrBooking: false,
    isLoading: false,
    lstDriver: [],
    isLoading_route: false,
    distance: 0,
    currentBooking: null
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.type.GET_CURRENT_BOOKING:
            return {
                ...state,
                isLoading_crrBooking: true
            }
        case actions.type.UPDATE_CURRENT_BOOKING:
            return {
                ...state,
                currentBooking: action.payload.data,
                isLoading_crrBooking: false
            }
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
