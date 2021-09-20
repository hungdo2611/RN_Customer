const prefix = 'SELECT/HOME';

const type = {

    UPDATE_CURRENT_BOOKING: prefix + "UPDATE_CURRENT_BOOKING",
    GET_CURRENT_BOOKING: prefix + "GET_CURRENT_BOOKING",

};

const action = {
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
