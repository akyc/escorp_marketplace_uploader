const IMBB_PATH = "https://api.imgbb.com/1/upload",
  GOOGLE_PATH =
    "https://script.google.com/macros/s/AKfycbwim7O-YadiWZ42Ixu8aHuB486mY1tvM6COk5YOcroVrWCpA0-Wp8_bvn7z-8TMqLWkfQ/exec",
  IMBB_API_KEY = "b614a7e1c06dc17e2b73be7b41af9d7b";

const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(res);
};

export const API = {
  getUploadedInfo: () => {
    return fetch(GOOGLE_PATH).then(checkResponse);
  },

  UploadImage(data) {
    return fetch(IMBB_PATH + '?expiration=2678400&key=' + IMBB_API_KEY, {
      method: "POST",
      body: data,
    }).then(checkResponse);
  },

  storeUploadedInfo(data) {
    return fetch(GOOGLE_PATH, {
      method: "POST",
      body: data,
    }).then(checkResponse);
  },
};
