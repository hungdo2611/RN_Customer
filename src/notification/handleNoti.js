import { instanceData } from '../model'
import { constant_name } from '../registerScreen'
import store from '../redux/store'
import { pushToBookingScreen, pushToCouponScreen } from '../NavigationController'
import actionsBooking from '../features/HomeScreen/redux/actions'
import { CONSTANT_TYPE_BOOKING } from '../constant'
export const constant_type_notify = {
    DRIVER_ACEEPT_BOOKING: 'DRIVER_ACEEPT_BOOKING',
    DRIVER_PICK_UP_CUSTOMER: 'DRIVER_PICK_UP_CUSTOMER',
    PROMOTION_NOTIFICATION: 'PROMOTION_NOTIFICATION',
    ALERT_NOTIFICATION: 'ALERT_NOTIFICATION',
    SYSTEM_CANCLE_BOOKING: 'SYSTEM_CANCLE_BOOKING',
    DRIVER_DROP_OFF_CUSTOMER: 'DRIVER_DROP_OFF_CUSTOMER'

}


export default handleNoti = async (data) => {
    console.log("handleNoti data", data)
    if (!data) {
        return
    }

    if (data.type == constant_type_notify.PROMOTION_NOTIFICATION) {
        pushToCouponScreen(instanceData.current_component_id);
    }
    if (data.type == constant_type_notify.SYSTEM_CANCLE_BOOKING) {
        store.dispatch(actionsBooking.action.updateBookingCancel())

    }
    // handle noti have customer request


}