const IMBB_PATH = "https://api.imgbb.com/1/upload",
  APP_SCRIPT_ID = process.env.REACT_APP_APP_SCRIPT_ID,
  GOOGLE_PATH = `https://script.google.com/macros/s/${APP_SCRIPT_ID}/exec`,
  IMBB_API_KEY = process.env.REACT_APP_IMBB_API_KEY;

const checkResponse = (res) => {
  return res.ok ? res.json() : Promise.reject(res);
};

export const API = {
  getUploadedInfo: () => {
    return fetch(GOOGLE_PATH).then(checkResponse);
  },

  UploadImage(body) {
    return fetch(IMBB_PATH + '?key=' + IMBB_API_KEY, {
      method: "POST",
      body,
    }).then(checkResponse);
  },

  storeUploadedInfo(data, type = "formdata") {
    let requestConfig = {
      method: "POST"
    }
    if (type === "formdata") {
      requestConfig["body"] = data
    }
    if (type === "json") {
      requestConfig["headers"] = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        'Content-Type': 'application/json',
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PATCH"
      }
      requestConfig["body"] = JSON.stringify(data)
    }
    return fetch(GOOGLE_PATH, requestConfig).then(checkResponse);
  },
};


export const Helpers = {
  baseSlice(array, start, end) {
    var index = -1,
      length = array.length;

    if (start < 0) {
      start = -start > length ? 0 : (length + start);
    }
    end = end > length ? length : end;
    if (end < 0) {
      end += length;
    }
    length = start > end ? 0 : ((end - start) >>> 0);
    start >>>= 0;

    var result = Array(length);
    while (++index < length) {
      result[index] = array[index + start];
    }
    return result;
  },

  chunk(array = [], size = 0) {
    size = parseInt(size)
    const length = array.length
    if (!length || size < 1) {
      return [];
    }
    let index = 0,
      resIndex = 0,
      result = Array(Math.ceil(length / size));
    while (index < length) {
      result[resIndex++] = this.baseSlice(array, index, (index += size));
    }
    return result;
  }
}
