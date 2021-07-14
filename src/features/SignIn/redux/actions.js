const type = {
    LOGIN: 'LOGIN',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAIL: 'LOGIN_FAIL',
    UPDATE_INFO: 'UPDATE_INFO',
    REGISTER: 'REGISTER',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAIL: 'REGISTER_FAIL',

    UPDATE_INFO: 'UPDATE_INFO',
    UPDATE_INFO_SUCCESS: 'UPDATE_INFO_SUCCESS',
    UPDATE_INFO_FAIL: 'UPDATE_INFO_FAIL',

    GET_INFO: 'GET_INFO',
    GET_INFO_SUCCESS: 'GET_INFO_SUCCESS',
    GET_INFO_FAIL: 'GET_INFO_FAIL',

    GET_OTP: 'GET_OTP',
    GET_OTP_SUCCESS: 'GET_OTP_SUCCESS',
    GET_OTP_FAIL: 'GET_OTP_FAIL',

    VERIFY_OTP: 'VERIFY_OTP',
    VERIFY_OTP_SUCCESS: 'VERIFY_OTP_SUCCESS',
    VERIFY_OTP_FAIL: 'VERIFY_OTP_FAIL',

    VERIFY_OTP_WITH_FIREBASE: 'VERIFY_OTP_WITH_FIREBASE',
    VERIFY_OTP_WITH_FIREBASE_SUCCESS: 'VERIFY_OTP_WITH_FIREBASE_SUCCESS',
    VERIFY_OTP_WITH_FIREBASE_FAIL: 'VERIFY_OTP_WITH_FIREBASE_FAIL',

    RESET_PASS: 'RESET_PASS',
    RESET_PASS_SUCCESS: 'RESET_PASS_SUCCESS',
    RESET_PASS_FAIL: 'RESET_PASS_FAIL',

    CHANGE_PASS: 'CHANGE_PASS',
    CHANGE_PASS_SUCCESS: 'CHANGE_PASS_SUCCESS',
    CHANGE_PASS_FAIL: 'CHANGE_PASS_FAIL',

    VALIDATE_CODE_ACTIVE_SUCCESS: 'VALIDATE_CODE_ACTIVE_SUCCESS',
    VALIDATE_CODE_ACTIVE_FAIL: 'VALIDATE_CODE_ACTIVE_FAIL',

    LOGIN_WITH_SOCIAL: 'LOGIN_WITH_SOCIAL',
    LOGIN_WITH_SOCIAL_SUCCESS: 'LOGIN_WITH_SOCIAL_SUCCESS',
    LOGIN_WITH_SOCIAL_FAIL: 'LOGIN_WITH_SOCIAL_FAIL',

    REGISTER_WITH_SOCIAL: 'REGISTER_WITH_SOCIAL',
    REGISTER_WITH_SOCIAL_SUCCESS: 'REGISTER_WITH_SOCIAL_SUCCESS',
    REGISTER_WITH_SOCIAL_FAIL: 'REGISTER_WITH_SOCIAL_FAIL',

    CONNECT_WITH_SOCIAL: 'CONNECT_WITH_SOCIAL',
    CONNECT_WITH_SOCIAL_SUCCESS: 'CONNECT_WITH_SOCIAL_SUCCESS',
    CONNECT_WITH_SOCIAL_FAIL: 'CONNECT_WITH_SOCIAL_FAIL',
    LOGOUT_ACTION: 'LOGOUT_ACTION'
}




const action = {
    logout_action: () => {
        return {
            type: type.LOGOUT_ACTION,
        }
    },
    loginAction: (uname, password, callbackFail, callbackSuccess) => {
        return {
            type: type.LOGIN,
            uname,
            password,
            callbackFail,
            callbackSuccess
        }
    },
    loginSuccessAction: (response) => {
        return {
            type: type.LOGIN_SUCCESS,
            response,
        }
    },
    loginFailAction: () => {
        return {
            type: type.LOGIN_FAIL,
            response: "Login error"
        }
    },

    ////////////////////////
    registerAction: (uname, password, invite_code, email, authCode) => {
        return {
            type: type.REGISTER,
            uname,
            password,
            invite_code,
            email,
            authCode,
        }
    },
    registerSuccessAction: (response) => {
        return {
            type: type.REGISTER_SUCCESS,
            response,
        }
    },
    registerFailAction: () => {
        return {
            type: type.REGISTER_FAIL,
            response: "Register fail"
        }
    },

    //////////////////////////////////////////////////////////////////

    updateInfoUserAction: () => {
        return {
            type: type.UPDATE_INFO,
        }
    },
    updateInfoUserSuccessAction: () => {
        return {
            type: type.UPDATE_INFO_SUCCESS
        }
    },
    updateInfoUserFailAction: () => {
        return {
            type: type.UPDATE_INFO_FAIL,
        }
    },
    ////////////////////////////////////////////////////

    getInfoUserAction: () => {
        return {
            type: type.GET_INFO,
        }
    },
    getInfoUserSuccessAction: () => {
        return {
            type: type.GET_INFO_SUCCESS,
        }
    },
    getInfoUserFailAction: () => {
        return {
            type: type.GET_INFO_FAIL,
        }
    },

    //////////////////////////////////
    getOTPAction: (phone) => {
        return {
            type: type.GET_OTP,
            phone,
        }
    },
    getOTPSuccessAction: (data) => {
        return {
            type: type.GET_OTP_SUCCESS,
            data
        }
    },
    getOTPFailAction: () => {
        return {
            type: type.GET_OTP_FAIL,
        }
    },

    ///////////////////////////////////////////////
    verifyOTPAction: (phone, otp_code, auth_code, verify_type) => {
        return {
            type: type.VERIFY_OTP,
            phone,
            otp_code,
            auth_code,
            verify_type,
        }
    },
    verifyOTPSuccessAction: (data) => {
        return {
            type: type.VERIFY_OTP_SUCCESS,
            data
        }
    },
    verifyOTPFailAction: () => {
        return {
            type: type.VERIFY_OTP_FAIL,
        }
    },


    ////////////////////////////////
    verifyOTPWithFirebaseAction: (phone, otp_code, auth_code, verify_type) => {
        return {
            type: type.VERIFY_OTP_WITH_FIREBASE,
            phone,
            otp_code,
            auth_code,
            verify_type,
        }
    },
    verifyOTPWithFirebaseSuccessAction: () => {
        return {
            type: type.VERIFY_OTP_WITH_FIREBASE_SUCCESS,
        }
    },
    verifyOTPWithFirebaseFailAction: () => {
        return {
            type: type.VERIFY_OTP_WITH_FIREBASE_FAIL,
        }
    },


    ////////////////////////////////////
    resetPassAction: () => {
        return {
            type: type.RESET_PASS,
        }
    },
    resetPassSuccessAction: () => {
        return {
            type: type.RESET_PASS_SUCCESS,
        }
    },
    resetPassFailAction: () => {
        return {
            type: type.RESET_PASS_FAIL,
        }
    },


    ////////////////////////////////////
    changePassAction: () => {
        return {
            type: type.CHANGE_PASS,
        }
    },
    changePassSuccessAction: () => {
        return {
            type: type.CHANGE_PASS_SUCCESS,
        }
    },
    changePassFailAction: () => {
        return {
            type: type.CHANGE_PASS_FAIL,
        }
    },


    ////////////////////////////////////
    validateCodeActiveAction: () => {
        return {
            type: type.VALIDATE_CODE_ACTIVE,
        }
    },
    validateCodeActiveSuccessAction: () => {
        return {
            type: type.VALIDATE_CODE_ACTIVE_SUCCESS,
        }
    },
    validateCodeActiveFailAction: () => {
        return {
            type: type.VALIDATE_CODE_ACTIVE_FAIL,
        }
    },

    ///////////////////////////////////////
    loginWithSocialAction: (sId, socialToken, socialType, callbackFail, callbackSuccess) => {
        return {
            type: type.LOGIN_WITH_SOCIAL,
            sId,
            socialToken,
            socialType,
            callbackFail,
            callbackSuccess
        }
    },
    loginWithSocialSuccessAction: (response) => {
        return {
            type: type.LOGIN_WITH_SOCIAL_SUCCESS,
        }
    },
    loginWithSocialFailAction: () => {
        return {
            type: type.LOGIN_WITH_SOCIAL_FAIL,
        }
    },


    ///////////////////////////////////////
    registerWithSocialAction: () => {
        return {
            type: type.REGISTER_WITH_SOCIAL,
        }
    },
    registerWithSocialSuccessAction: () => {
        return {
            type: type.REGISTER_WITH_SOCIAL_SUCCESS,
        }
    },
    registerWithSocialFailAction: () => {
        return {
            type: type.REGISTER_WITH_SOCIAL_FAIL,
        }
    },


    /////////////////////////////////////////
    connectWithSocialAction: () => {
        return {
            type: type.CONNECT_WITH_SOCIAL,
        }
    },
    connectWithSocialSuccessAction: () => {
        return {
            type: type.CONNECT_WITH_SOCIAL_SUCCESS,
        }
    },
    connectWithSocialFailAction: () => {
        return {
            type: type.CONNECT_WITH_SOCIAL_FAIL,
        }
    }
}

export default {
    type,
    action
}