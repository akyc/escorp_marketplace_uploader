const IMBB_PATH = "",
  GOOGLE_PATH = "",
  IMBB_API_KEY = "";

const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(res);
};

export const API = {
  getUploadedInfo() {
    return fetch(GOOGLE_PATH).checkResponse();
  },

  UploadImages(data) {
    return fetch(IMBB_PATH, {
      method: "POST",
      body: data,
    }).checkResponse();
  },

  storeUploadedInfo(data) {
    return fetch(GOOGLE_PATH, {
      method: "POST",
      body: data,
    }).checkResponse();
  },
};
