import axios, { AxiosPromise } from "axios";
export const ERROR_CODE_SUCCESS = 200;
export const ERROR_CODE_NOT_FOUND = 404;
export const ERROR_CODE_INVALID_REQUEST = 422;
export const ERROR_CODE_SERVER = 500;

const BaseUrlDev = "https://api.ridesharing.mobilelab.vn/v1";
const BaseUrlLive = "https://api.ridesharing.mobilelab.vn/v1";

class Network {
  private static instance = new Network();
  private sessionkey: string = "";
  private Ctype: string = "";
  private isOpenRideShareModule = false;
  constructor() {
    if (Network.instance) {
      throw new Error(
        "Error: Instantiation failed: Use Network.getInstance() instead of new."
      );
    }
    Network.instance = this;
  }
  public static getInstance(): Network {
    return Network.instance;
  }

  getBaseUrl(): string {
    if (__DEV__) return BaseUrlDev;
    return BaseUrlLive;
  }
  setIsOpenRideShareModule(value: boolean) {
    this.isOpenRideShareModule = value;
  }
  getIsOpenRideShareModule(): boolean {
    return this.isOpenRideShareModule;
  }
  setSessionKey(sessionkey: string) {
    console.log("set sessionkey", sessionkey);
    this.sessionkey = sessionkey;
  }

  getSessionkey(): string {
    return this.sessionkey;
  }
  setCtype(Ctype: string) {
    this.Ctype = Ctype;
  }
  getCtype(): string {
    return this.Ctype;
  }

  unAuthorizedRequest<T>(
    url: string,
    method: "POST" | "DELETE" | "PUT" | "GET" = "GET",
    data?: object,
    header?: {
      Aver?: string;
    }
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: "",
      data: data,
      timeout: 10000,
      headers: {
        ...header,
        Accept: "application/json",
        "Content-Type": "application/json",
        Aver: header && header.Aver ? header.Aver : "2.0.0",
        Ctype: 0
      }
    });
    return response;
  }

  authorizedRequest<T>(
    url: string,
    method: "POST" | "DELETE" | "PUT" | "GET" = "GET",
    data?: object,
    header?: {
      Aver?: string;
    }
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: this.getBaseUrl(),
      data: data,
      timeout: 10000,
      headers: {
        ...header,
        "Content-Type": "application/json",
        Aver: header && header.Aver ? header.Aver : "2.0.0",
        Ctype: this.getCtype(),
        sessionkey: this.getSessionkey()
      }
    });
    return response;
  }
  RegisterFirebase<T>(
    url: string,
    method: "POST" | "DELETE" | "PUT" | "GET" = "GET",
    data?: object,
    header?: {
      Aver?: string;
    }
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: "https://api.trustkeys.network/v1",
      data: data,
      timeout: 10000,
      headers: {
        ...header,
        "Content-Type": "application/json",
        Aver: header && header.Aver ? header.Aver : "2.0.0"
      }
    });
    return response;
  }
  AptPhotoCloud<T>(
    url: string,
    method: "POST" | "DELETE" | "PUT" | "GET" = "GET",
    data?: FormData
  ): AxiosPromise<T> {
    const response: AxiosPromise<T> = axios({
      method: method,
      url: url,
      baseURL: "https://upload.photocloud.mobilelab.vn",
      data: data,
      timeout: 10000
    });
    return response;
  }
}

export default Network.getInstance();
