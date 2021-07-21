import { ActionTypes } from './ActionType';

function actSearchPlace(Text, lat, lng) {
  return {
    type: ActionTypes.RS_SEARCH_GG_AUTOCOMPLETE,
    PayLoad: { Text, lat, lng },
  };
}
function actSearchPlaceDone(data) {
  return {
    type: ActionTypes.RS_SEARCH_GG_AUTOCOMPLETE_DONE,
    PayLoad: { data },
  };
}
function actSearchPlaceWithLatlng(lat, lng, type) {
  return {
    type: ActionTypes.RS_SEARCH_GG_GEOCODE_LAT_LNG,
    PayLoad: { lat, lng, type },
  };
}
function actSearchPlaceWithLatLngDone(reuslt, type) {
  return {
    type: ActionTypes.RS_SEARCH_GG_GEOCODE_LAT_LNG_DONE,
    PayLoad: { reuslt, type },
  };
}
function actSearchLatLngWithPlaceID(placeid, type) {
  return {
    type: ActionTypes.RS_SEARCH_GG_SEARCH_LAT_LNG_WITH_PLACE_ID,
    PayLoad: { placeid, type },
  };
}
function actSearchLatLngWithPlaceIDDone(dt, tp) {
  return {
    type: ActionTypes.RS_SEARCH_GG_SEARCH_LAT_LNG_WITH_PLACE_ID_DONE,
    PayLoad: { dt, tp },
  };
}
function actSharePlan(body) {
  return {
    type: ActionTypes.RS_SHARE_PLAN,
    PayLoad: { body },
  };
}
function actCreateTrip(body) {
  return {
    type: ActionTypes.RS_CREATE_TRIP,
    PayLoad: { body },
  };
}
function actSearchTripFitByPlan() {
  return {
    type: ActionTypes.RS_SEARCH_TRIP_FIT_BY_PLAN,
  };
}
function actSearchTripFitByPlanDone(data) {
  return {
    type: ActionTypes.RS_SEARCH_TRIP_FIT_BY_PLAN_DONE,
    PayLoad: { data },
  };
}
function actTakeTrip(tripID) {
  return {
    type: ActionTypes.RS_TAKE_TRIP,
    PayLoad: { tripID },
  };
}
function GetListTripById(lstTrip) {
  return {
    type: ActionTypes.RS_GET_LIST_TRIP_BY_ID,
    PayLoad: { lstTrip },
  };
}
function GetListTripByIdDone(data) {
  return {
    type: ActionTypes.RS_GET_LIST_TRIP_BY_ID_DONE,
    PayLoad: { data },
  };
}
function GetPointFromDistance(distance) {
  return {
    type: ActionTypes.RS_GET_POINT_FROM_DISTANCE,
    PayLoad: { distance },
  };
}
function GetPointFromDistanceDone(data) {
  return {
    type: ActionTypes.RS_GET_POINT_FROM_DISTANCE_DONE,
    PayLoad: { data },
  };
}

export default {
  actCreateTrip,
  actSharePlan,
  actSearchLatLngWithPlaceID,
  actSearchLatLngWithPlaceIDDone,
  actSearchPlaceWithLatlng,
  actSearchPlaceWithLatLngDone,
  actSearchPlaceDone,
  actSearchPlace,
  ActionTypes,
  actSearchTripFitByPlan,
  actSearchTripFitByPlanDone,
  actTakeTrip,
  GetListTripById,
  GetListTripByIdDone,
  GetPointFromDistance,
  GetPointFromDistanceDone,
};
