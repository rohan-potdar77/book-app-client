import axios from "axios";

// creating axios instance for app
const getInitialized = (contentType, params) => {
  return axios.create({
    baseURL: process.env.REACT_APP_BASE_SERVER_URL,
    params: params ? params : undefined,
    headers: { "Content-Type": contentType ? contentType : "application/json" },
  });
};

// GET
export const getRequest = (url, params, contentType) => {
  return getInitialized(contentType, params).get(url);
};

// POST
export const postRequest = (url, contentType, data, params) => {
  return getInitialized(contentType, params).post(url, data);
};

// PUT
export const putRequest = (url, contentType, data, params) => {
  return getInitialized(contentType, params).put(url, data);
};

// DELETE
export const deleteRequest = (url, contentType, data, params) => {
  return getInitialized(contentType, params).delete(url, data);
};
