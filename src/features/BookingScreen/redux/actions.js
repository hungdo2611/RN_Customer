const prefix = 'SELECT/ORIGIN';

const type = {
    GET_LIST_DRIVER: prefix + "GET_LIST_DRIVER",
    GET_LIST_DRIVER_DONE: prefix + "GET_LIST_DRIVER_DONE",
    GET_ROUTE: prefix + "GET_ROUTE",
    GET_ROUTE_DONE: prefix + "GET_ROUTE_DONE",
    UPDATE_CURRENT_BOOKING: prefix + "UPDATE_CURRENT_BOOKING",
};

const action = {
    updateCurrentBooking: (data) => {
        return {
            type: type.UPDATE_CURRENT_BOOKING,
            payload: { data }

        }
    },
    getListDriver: () => {
        return {
            type: type.GET_LIST_DRIVER,
            payload: {}

        }
    },
    getListDriverDone: (data) => {
        return {
            type: type.GET_LIST_DRIVER_DONE,
            payload: { data }

        }
    },
    getRoute: () => {
        return {
            type: type.GET_ROUTE,
            payload: {}

        }
    },
    getRouteDone: (data) => {
        return {
            type: type.GET_ROUTE_DONE,
            payload: { data }

        }
    },


}

export default {
    type,
    action
}
