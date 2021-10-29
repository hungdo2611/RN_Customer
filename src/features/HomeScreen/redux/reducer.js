import actions from "./actions";
import { instance_history } from '../../HistoryScreen'
const initState = {
    isLoading_crrBooking: false,
    currentBooking: null,
    user_info: null,
    isLoadingPre: false,
    lst_coupon: [],
    total_coupon: 0
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case actions.type.UPDATE_LST_COUPON:
            return {
                ...state,
                lst_coupon: action.payload.coupon,
                total_coupon: action.payload.total
            }
        case actions.type.UPDATE_ISLOADING_PRE:
            return {
                ...state,
                isLoadingPre: action.payload.isloading
            }
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
            if (instance_history) {
                instance_history.updateData(action.payload.data);
            }
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
