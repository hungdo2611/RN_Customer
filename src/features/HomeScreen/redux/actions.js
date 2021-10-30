const prefix = 'SELECT/HOME';

const type = {

    UPDATE_CURRENT_BOOKING: prefix + "UPDATE_CURRENT_BOOKING",
    GET_CURRENT_BOOKING: prefix + "GET_CURRENT_BOOKING",
    UPDATE_USER_INFO: prefix + "UPDATE_USER_INFO",
    UPDATE_ISLOADING_PRE: prefix + "UPDATE_ISLOADING_PRE",
    UPDATE_LST_COUPON: prefix + "UPDATE_LST_COUPON",
    UPDATE_CURRENT_COUPON: prefix + 'UPDATE_CURRENT_COUPON'

};

const action = {
    updateCurrentCoupon: (coupon) => {
        return {
            type: type.UPDATE_CURRENT_COUPON,
            payload: { coupon }

        }
    },
    updateListCoupon: (coupon, total) => {
        return {
            type: type.UPDATE_LST_COUPON,
            payload: { coupon, total }

        }
    },
    updateIsloadingPre: (isloading) => {
        return {
            type: type.UPDATE_ISLOADING_PRE,
            payload: { isloading }

        }
    },
    updateUserInfo: (data) => {
        return {
            type: type.UPDATE_USER_INFO,
            payload: { data }

        }
    },
    getCurrentBooking: (_id) => {
        return {
            type: type.GET_CURRENT_BOOKING,
            payload: { _id }

        }
    },
    updateCurrentBooking: (data) => {
        return {
            type: type.UPDATE_CURRENT_BOOKING,
            payload: { data }

        }
    },



}

export default {
    type,
    action
}
