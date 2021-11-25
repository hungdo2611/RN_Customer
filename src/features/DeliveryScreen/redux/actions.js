const prefix = 'SELECT/ORIGIN';

const type = {
    GET_LIST_DRIVER: prefix + "GET_LIST_DRIVER",
    GET_LIST_DRIVER_DONE: prefix + "GET_LIST_DRIVER_DONE",
    GET_ROUTE: prefix + "GET_ROUTE",
    GET_ROUTE_DONE: prefix + "GET_ROUTE_DONE",

};

const action = {

    getListDriver: () => {
        return {
            type: type.GET_LIST_DRIVER,
            payload: {}

        }
    },
    getListDriverDone: (data, dataFree) => {
        return {
            type: type.GET_LIST_DRIVER_DONE,
            payload: { data, dataFree }

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
