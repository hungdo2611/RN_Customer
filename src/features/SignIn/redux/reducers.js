import actions from "./actions";
export default AuthReducer = (
    state = {
        user: {},
    },
    payload
) => {
    switch (payload.type) {
        case actions.type.LOGOUT_ACTION:
            return {
                user: {}
            }
        case actions.type.LOGIN_SUCCESS:
            return {
                user: payload.response
            }
        case actions.type.REGISTER_SUCCESS:
            console.log(payload.response.data)
            return {
                user: payload.response.data
            }
        case actions.type.LOGIN_FAIL:
            return {
                user: null,
            }
        case actions.type.REGISTER_FAIL:
            return {
                user: null
            }
        default:
            return {
                ...state
            }
    }
}
