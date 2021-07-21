/* eslint-disable no-case-declarations */
import { result } from 'lodash';
import { ActionTypes } from './ActionType';

const initialState = {
  GGautoCompleteData: null,
  SearchDestination: null,
  SearchOrigin: null,
  isLoading: false,
  Point: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RS_SEARCH_GG_GEOCODE_LAT_LNG:
      return {
        ...state,
        isLoading: true
      }
    case ActionTypes.RS_SEARCH_GG_AUTOCOMPLETE_DONE:
      const { data } = action.PayLoad;
      return {
        ...state,
        GGautoCompleteData: data
      }
    case ActionTypes.RS_SEARCH_GG_GEOCODE_LAT_LNG_DONE:
      const { reuslt, type } = action.PayLoad;
      if (type === 'des') {
        return {
          ...state,
          SearchDestination: reuslt,
          isLoading: false
        }
      } else {
        return {
          ...state,
          SearchOrigin: reuslt,
          isLoading: false
        }
      }
    case ActionTypes.RS_SEARCH_GG_SEARCH_LAT_LNG_WITH_PLACE_ID_DONE:
      const { dt, tp } = action.PayLoad;
      if (tp === 'des') {
        return {
          ...state,
          SearchDestination: dt
        }
      } else {
        return {
          ...state,
          SearchOrigin: dt,
        }
      }
    case ActionTypes.RS_GET_POINT_FROM_DISTANCE:
      return {
        ...state,
        isLoading: true,
        Point: 0
      }
    case ActionTypes.RS_GET_POINT_FROM_DISTANCE_DONE:
      return {
        ...state,
        Point: action.PayLoad.data,
        isLoading: false
      }
    default:
      return state;
  }
};

export default { initialState, reducer };
