import {
    put,
    takeLatest,
    all,
    fork,
    call,
    takeEvery,
    select
} from "redux-saga/effects";

import actions from "./actions";
import { getCurrentBookingAPI, getBookingWithIdAPI } from '../../../api/bookingApi'
import { getDetailCoupon } from '../../../api/couponAPI'
function* saga_getCurrentBooking(action) {
    try {
        const { _id } = action.payload;
        //console.oldlog('add data to realm', lstNotify)
        yield put(actions.action.updateIsloadingPre(true))
        if (_id) {
            let reqCrrBooking = yield call(getBookingWithIdAPI, _id);
            if (!reqCrrBooking.err) {
                yield put(actions.action.updateCurrentBooking(reqCrrBooking.data))
                if (reqCrrBooking.data.coupon_code) {
                    let crr_coupon = yield call(getDetailCoupon, reqCrrBooking.data.coupon_code)
                    if (crr_coupon && !crr_coupon.err) {
                        yield put(actions.action.updateCurrentCoupon(crr_coupon.data))
                    }
                }
            }
        } else {
            let reqCrrBooking = yield call(getCurrentBookingAPI);
            console.log("reqCrrBooking", reqCrrBooking)

            if (!reqCrrBooking.err) {
                yield put(actions.action.updateCurrentBooking(reqCrrBooking.data))
                if (reqCrrBooking.data.coupon_code) {
                    let crr_coupon = yield call(getDetailCoupon, reqCrrBooking.data.coupon_code)
                    console.log("crr_coupon", crr_coupon)
                    if (crr_coupon && !crr_coupon.err) {
                        yield put(actions.action.updateCurrentCoupon(crr_coupon.data))
                    }
                }
            }
        }

        yield put(actions.action.updateIsloadingPre(false))


    } catch (ex) {
        console.log("error prefetch", ex)
        //console.oldlog('error add  notify', ex)
    }
}


function* listen() {

    yield takeEvery(actions.type.GET_CURRENT_BOOKING, saga_getCurrentBooking);

}

export default function* HomeSaga() {
    yield all([listen()]);
}
