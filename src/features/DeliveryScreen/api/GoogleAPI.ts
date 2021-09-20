export type NetworkPromiseResponse<T> = Promise<T>;
import Network from "./index";

import axios, { AxiosPromise } from "axios";
import { ApiKey } from "../constant";

export function APIGoogleAutocomplete<T>(
  Text: string,
  lat: Number,
  lng: Number
): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    Network.unAuthorizedRequest<T>(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=(${Text})&location=${lat},${lng}&radius=50000&strictbounds&language=vi&key=${ApiKey}`,
      "GET"
    )
      .then(response => {
        // console.log("GGautoComplete respone", response);
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        // reject("search faild");
      });
  });
}
export function APISearchPlaceWithLatlng<T>(
  lat: Number,
  lng: Number
): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    Network.unAuthorizedRequest<T>(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${ApiKey}`,
      "GET"
    )
      .then(response => {
        // console.log("GGautoComplete respone", response);
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        // reject("search place with lat lng faild");
      });
  });
}
export function APIsearchLatLngWithPlaceId<T>(
  placeid: string
): NetworkPromiseResponse<T> {
  return new Promise((resolve, reject) => {
    Network.unAuthorizedRequest<T>(
      `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeid}&key=${ApiKey}`,
      "GET"
    )
      .then(response => {
        // console.log("GGautoComplete respone", response);
        const data = response.data;
        resolve(data);
      })
      .catch(error => {
        console.log(error);
        // reject("search latlng with place faild");
      });
  });
}

export default {
  APIGoogleAutocomplete,
  APISearchPlaceWithLatlng,
  APIsearchLatLngWithPlaceId
};
