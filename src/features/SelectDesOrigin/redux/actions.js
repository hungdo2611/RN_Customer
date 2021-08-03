const prefix = 'SELECT/ORIGIN';

const type = {
    GET_LIST_DRIVER: prefix + "GET_LIST_DRIVER",
    GET_LIST_DRIVER_DONE: prefix + "GET_LIST_DRIVER_DONE",
};

const action = {
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


}

export default {
    type,
    action
}
