import actions from "./actions";

const initState = {
    isLoading_crrBooking: false,
    currentBooking: null,
    user_info: null
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.type.UPDATE_USER_INFO:
            return {
                ...state,
                user_info: action.payload.data
            }
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

        default:
            return state;
    }
};

export default reducer;
