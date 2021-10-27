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
import { getCurrentBookingAPI } from '../../../api/bookingApi'
function* saga_getCurrentBooking(action) {
    try {
        //console.oldlog('add data to realm', lstNotify)
        yield put(actions.action.updateIsloadingPre(true))
        let reqCrrBooking = yield call(getCurrentBookingAPI);

        console.log('reqCrrBooking', reqCrrBooking)
        if (!reqCrrBooking.err) {
            yield put(actions.action.updateCurrentBooking(reqCrrBooking.data))
        }
        yield put(actions.action.updateIsloadingPre(false))


    } catch (ex) {
        //console.oldlog('error add  notify', ex)
    }
}


function* listen() {

    yield takeEvery(actions.type.GET_CURRENT_BOOKING, saga_getCurrentBooking);

}

export default function* HomeSaga() {
    yield all([listen()]);
}
