const prefix = 'SELECT/HOME';

const type = {

    UPDATE_CURRENT_BOOKING: prefix + "UPDATE_CURRENT_BOOKING",
    GET_CURRENT_BOOKING: prefix + "GET_CURRENT_BOOKING",
    UPDATE_USER_INFO: prefix + "UPDATE_USER_INFO"

};

const action = {
    updateUserInfo: (data) => {
        return {
            type: type.UPDATE_USER_INFO,
            payload: { data }

        }
    },
    getCurrentBooking: () => {
        return {
            type: type.GET_CURRENT_BOOKING,
            payload: {}

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
