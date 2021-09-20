import { combineReducers } from "redux";
import BookingReducer from '../features/BookingScreen/redux/reducer'
import BookingHybirdReducer from '../features/BookingHybirdScreen/redux/reducer'
import HomeReducer from '../features/HomeScreen/redux/reducer'
import DeliveryReducer from '../features/DeliveryScreen/redux/reducer'
export default appReducer = combineReducers({
    BookingReducer: BookingReducer,
    BookingHybirdReducer: BookingHybirdReducer,
    HomeReducer: HomeReducer,
    DeliveryReducer: DeliveryReducer
})