import { take } from 'lodash';
import { call, put, takeEvery } from 'redux-saga/effects';
import actions from "./actions";

import rf from '../../Requests/RequestFactory';
import { isFunction } from 'lodash';
// import { setDataLogin } from '../../../NativeFunction'
import AsyncStorage from '@react-native-community/async-storage';


import { switchToFullHome } from '../../NavigationController';
import { ActiveUser } from '../../Api/AuthenServices'

export function* loginHandle(action) {
    try {
        const params = {
            "uname": action.uname,
            "password": action.password,
        };
        const resp = yield call((params) => rf.getRequest('AuthRequest').login(params), params);
        console.log('responedata', resp)
        if (resp) {
            AsyncStorage.setItem('user_info', JSON.stringify(resp?.data?.user_info))
            console.log(resp);
            if (resp.error.code === 200) {



                switchToFullHome();


            } else if (resp.error.code === 2002) {
            } else if (resp.error.code === 2004) {
            } else {
            }
        } else {
            if (isFunction(action.callbackFail)) {
                action.callbackFail();
            }
            yield put(Action.loginFailAction());
        }
    } catch (e) {
        console.log("======== error")
        console.log(e)
        if (isFunction(action.callbackFail)) {
            action.callbackFail();
        }

        yield put(actions.action.loginFailAction())
    }

}

function* registerHandle(action) {
    console.log('action data', action)
    try {
        const params = {
            "uname": action.uname,
            "password": action.password,
            "invite_code": action.invite_code,
            "email": action.email,

        };
        const resp = yield call((params) => rf.getRequest('AuthRequest').register(params), params);
        console.log('resp reg', resp)
        if (resp) {
            AsyncStorage.setItem('user_info', JSON.stringify(resp?.data?.user_info))
            if (resp.error.code === 200) {

                switchToFullHome()
            }
        } else {
            yield put(actions.action.registerFailAction())
        }
    } catch (e) {
        console.log("error", e)
        yield put(actions.action.registerFailAction())
    }
}

function* getOTPHandle(action) {
    try {
        const params = {
        };
        const resp = yield call((path, params) => rf.getRequest('AuthRequest').getOTP(path, params), action.phone, params);
        if (resp) {
            yield put(actions.action.getOTPSuccessAction(resp));
        } else {
            yield put(actions.action.getOTPFailAction())
        }
    } catch (e) {
        console.log("error")
        console.log(e)
        yield put(Action.getOTPFailAction())
    }
}

function* verifyOTPHandle(action) {
    try {
        const params = {
            otp_code: action.otp_code,
            auth_code: action.auth_code,
            verify_type: action.verify_type,
        };
        const resp = yield call((path, params) => rf.getRequest('AuthRequest').verifyOTP(path, params), action.phone, params);
        console.log(resp, "verify saga")
        if (resp) {
            yield put(actions.action.verifyOTPSuccessAction(resp));
        } else {
            yield put(actions.action.verifyOTPFailAction())
        }
    } catch (e) {
        console.log("error")
        console.log(e)
        yield put(actions.action.verifyOTPFailAction())
    }
}


function* updateInfoUserHandle() { }
function* getInfoUserHandle() { }
function* verifyWithFirebaseHandle(action) {
    try {
        const params = {
            otp_code: action.otp_code,
            auth_code: action.auth_code,
            verify_type: action.verify_type,
        };
        const resp = yield call((path, params) => rf.getRequest('AuthRequest').verifyWithFirebase(path, params), { phone: action.phone }, params);
        console.log(resp, "verify saga")
        if (resp) {
            yield put(actions.action.verifyOTPWithFirebaseSuccessAction(resp));
        } else {
            yield put(actions.action.verifyOTPWithFirebaseFailAction())
        }
    } catch (e) {
        console.log(e, "error saga")
        yield put(actions.action.verifyOTPWithFirebaseFailAction())
    }
}
function* resetPwdHandle() { }
function* changePwdHandle() { }
function* LoginWithSocialHandle(action) {
    try {
        const params = {
            sID: action.sId,
            SocialToken: action.socialToken,
            SocialType: action.socialType,
        };
        const resp = yield call((params) => rf.getRequest('AuthRequest').LoginWithSocial(params), params);
        console.log('LoginWithSocialHandle respone', resp)
        console.log('LoginWithSocialHandle params', resp)

        if (resp) {
            if (isFunction(action.callbackSuccess)) {
                action.callbackSuccess(resp.data.user_info);
            }
            AsyncStorage.setItem('user_info', JSON.stringify(resp?.data?.user_info))
            if (resp.error.code === 200) {

                switchToFullHome();

            }
        } else {
            if (isFunction(action.callbackFail)) {
                action.callbackFail();
            }
            yield put(actions.action.loginWithSocialFailAction())
        }
    } catch (e) {
        console.log(e, "error saga")
        if (isFunction(action.callbackFail)) {
            action.callbackFail();
        }
        yield put(actions.action.loginWithSocialFailAction())
    }
}
function* RegisterWithSocialHandle() { }
function* ConnectWithSocialHandle() { }
function* OnLoginSuccess(action) {
    const { response } = action
}
function* onLogOut(action) {

}
export default function* auth() {
    yield takeEvery(actions.type.LOGOUT_ACTION, onLogOut);
    yield takeEvery(actions.type.LOGIN_SUCCESS, OnLoginSuccess);
    yield takeEvery(actions.type.LOGIN, loginHandle);
    yield takeEvery(actions.type.REGISTER, registerHandle);
    yield takeEvery(actions.type.GET_OTP, getOTPHandle);
    yield takeEvery(actions.type.VERIFY_OTP, verifyOTPHandle);
    yield takeEvery(actions.type.UPDATE_INFO, updateInfoUserHandle);
    yield takeEvery(actions.type.GET_INFO, getInfoUserHandle);
    yield takeEvery(actions.type.VERIFY_OTP_WITH_FIREBASE, verifyWithFirebaseHandle);
    yield takeEvery(actions.type.RESET_PASS, resetPwdHandle);
    yield takeEvery(actions.type.CHANGE_PASS, changePwdHandle);
    yield takeEvery(actions.type.LOGIN_WITH_SOCIAL, LoginWithSocialHandle);
    yield takeEvery(actions.type.REGISTER_WITH_SOCIAL, RegisterWithSocialHandle);
    yield takeEvery(actions.type.CONNECT_WITH_SOCIAL, ConnectWithSocialHandle);
}
