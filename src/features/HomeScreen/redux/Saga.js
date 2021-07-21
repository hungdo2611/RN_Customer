/* eslint-disable import/no-unresolved */
import { call, put, select, takeLatest, takeEvery, fork } from 'redux-saga/effects';

import { Alert } from 'react-native';
import { Navigation } from 'react-native-navigation';
import GoogleAPI from '../api/GoogleAPI';
import Actions from './Action';


function* WorkerGGAutoComplete(action) {
  const { Text, lat, lng } = action.PayLoad;
  console.log('action', Text);

  const GGautoCompleteResppone = yield call(GoogleAPI.APIGoogleAutocomplete, Text, lat, lng);
  console.log('respone', GGautoCompleteResppone);
  if (GGautoCompleteResppone.status === 'OK') {
    if (Text.length <= 1) {
      yield put(Actions.actSearchPlaceDone(null));
    } else {
      yield put(Actions.actSearchPlaceDone(GGautoCompleteResppone.predictions));
    }
  }
}

export function* watcherSearchPlace() {
  yield takeLatest(Actions.ActionTypes.RS_SEARCH_GG_AUTOCOMPLETE, WorkerGGAutoComplete);
}

function* WorkerGGSearchPlaceWithLatLng(action) {
  const { lat, lng, type } = action.PayLoad;
  const SearchRespone = yield call(GoogleAPI.APISearchPlaceWithLatlng, lat, lng);
  console.log('respone search with latlng', SearchRespone);

  if (SearchRespone.status === 'OK') {
    yield put(Actions.actSearchPlaceWithLatLngDone(SearchRespone.results[0], type));
  }
}
export function* watcherSearchPlaceWithLatLng() {
  yield takeLatest(Actions.ActionTypes.RS_SEARCH_GG_GEOCODE_LAT_LNG, WorkerGGSearchPlaceWithLatLng);
}
function* WorkerGGSearchLatLngWithPlaceid(action) {
  const { placeid, type } = action.PayLoad;
  const SearchRespone = yield call(GoogleAPI.APIsearchLatLngWithPlaceId, placeid);
  console.log('respone search with place id', SearchRespone);
  console.log('type place id ', type);
  if (SearchRespone.status === 'OK') {
    yield put(Actions.actSearchLatLngWithPlaceIDDone(SearchRespone.result, type));
  }
}
export function* watcherSearchLatLngWithPlaceid() {
  yield takeLatest(
    Actions.ActionTypes.RS_SEARCH_GG_SEARCH_LAT_LNG_WITH_PLACE_ID,
    WorkerGGSearchLatLngWithPlaceid,
  );
}



export default function* CreateTripSaga() {
  yield fork(watcherSearchPlace);
  yield fork(watcherSearchPlaceWithLatLng);
  yield fork(watcherSearchLatLngWithPlaceid);

}
