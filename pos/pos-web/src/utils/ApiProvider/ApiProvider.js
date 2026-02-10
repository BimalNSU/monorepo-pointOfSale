// Under Dev

import axios from "axios";

const instance = axios.create({
  // baseURL: process.env.REACT_APP_baseUrl,
  baseURL: import.meta.env.VITE_baseUrl,
  timeout: 10000,
});

const successHandler = (response) => {
  if (response) return response;
};

const errorHandler = (error) => {
  return error.response;
};

//Http Methods
const get = (url) => instance.get(url).then(successHandler).catch(errorHandler);

const post = (url, data, headers = {}) =>
  instance.post(url, data, { headers }).then(successHandler).catch(errorHandler);

const put = (url, data, headers = {}) =>
  instance.put(url, data, { headers }).then(successHandler).catch(errorHandler);

const patch = (url, data, headers = {}) =>
  instance.patch(url, data, { headers }).then(successHandler).catch(errorHandler);

const axiosDelete = (url, headers = {}) =>
  instance.delete(url, { headers }).then(successHandler).catch(errorHandler);

//New Functions
// const register = (data, recaptchaToken) =>
//   post(`/users/`, data, { authorization: `Bearer ${recaptchaToken}` });

const login = (data, recaptchaToken) =>
  post("/auth/login/", data, { "x-recaptcha-token": recaptchaToken });

const updateOwnPassword = (data, token, sessionId) =>
  patch(`me/password`, data, { authorization: token, session_id: sessionId });
const updateUser = (userId, data, token, sessionId) =>
  put(`/users/${userId}`, data, { authorization: token, session_id: sessionId });

//#region: admin endpoints
const updateUserStatus = (userId, data, token, sessionId) =>
  patch(`admin/users/${userId}/status`, data, { authorization: token, session_id: sessionId });

const addUserByAdmin = async (data, accessToken, sessionId) =>
  await post(`/admin/users/`, data, {
    authorization: `Bearer ${accessToken}`,
    session_id: sessionId,
  });
const updateUserByAdmin = (userId, data, token, sessionId) =>
  put(`/admin/users/${userId}`, data, { authorization: token, session_id: sessionId });

const updatePasswordByAdmin = (userId, data, token, sessionId) =>
  patch(`/admin/users/${userId}/password`, data, { authorization: token, session_id: sessionId });
//#endregion

// const addProperty = async (data, token) => post(`/properties/`, data, { authorization: token });
// const updateProperty = async (id, data, token) =>
//   put(`/properties/${id}/`, data, { authorization: token });

// const deleteProperty = async (id, token) =>
//   axiosDelete(`/properties/${id}/`, { authorization: token });

const updateSession = async (id, data, token) =>
  put(`/sessions`, data, { authorization: token, session_id: id });

const addShopAccess = (shopId, userId, data, token, sessionId) =>
  put(`/shops/${shopId}/employees/${userId}/role`, data, {
    authorization: token,
    session_id: sessionId,
  });
const revokeShopAccess = async (shopId, userId, token, sessionId) =>
  axiosDelete(`/shops/${shopId}/employees/${userId}`, {
    authorization: token,
    session_id: sessionId,
  });

export const apiProvider = {
  login,
  // register,
  updateUser,
  updateOwnPassword,

  addUserByAdmin,
  updateUserByAdmin,
  updatePasswordByAdmin,
  updateUserStatus,

  updateSession,

  addShopAccess,
  revokeShopAccess,
  // addProperty,
  // updateProperty,
  // deleteProperty,
};
