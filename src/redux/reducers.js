import { combineReducers } from "redux";
import homeReducer from '../features/HomeScreen/redux/Reducer';
import SelectDesOriginReducer from '../features/SelectDesOrigin/redux/reducer'

export default appReducer = combineReducers({
    homeReducer: homeReducer.reducer,
    SelectDesOriginReducer: SelectDesOriginReducer

})