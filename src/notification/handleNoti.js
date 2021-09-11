import { instanceData } from '../model'
import { constant_name } from '../registerScreen'
import store from '../redux/store'
import actionsBooking from '../features/BookingScreen/redux/actions'
import { pushToBookingScreen } from '../NavigationController'
export const constant_type_notify = {
    DRIVER_ACEEPT_BOOKING: 'DRIVER_ACEEPT_BOOKING',
    DRIVER_PICK_UP_CUSTOMER: 'DRIVER_PICK_UP_CUSTOMER'

}

export default handleNoti = async (data) => {
    console.log("handleNoti data", data)
    if (!data) {
        return
    }
    if (data.type == constant_type_notify.DRIVER_ACEEPT_BOOKING || data.type == constant_type_notify.DRIVER_ACEEPT_BOOKING) {
        store.dispatch(actionsBooking.action.getCurrentBooking())
        if (instanceData.current_component_id === `${constant_name.BOOKING_SCREEN}_id`) {
            // update data
        } else {
            pushToBookingScreen(instanceData.current_component_id)
        }
    }
    // handle noti have customer request


}