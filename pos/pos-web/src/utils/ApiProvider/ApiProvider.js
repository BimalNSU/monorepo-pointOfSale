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

const axiosDelete = (url, headers = {}) =>
  instance.delete(url, { headers }).then(successHandler).catch(errorHandler);

//New Functions
// const register = (data, recaptchaToken) =>
//   post(`/users/`, data, { authorization: `Bearer ${recaptchaToken}` });

const login = (data) => post("/auth/login/", data);
const changePassword = (token, currentPassword, newPassword) =>
  post(`users/change-password`, { currentPassword, newPassword }, { authorization: token });
const updateUser = (data, token) => put(`/users/${userId}`, userId, data, { authorization: token });

const addUserByAdmin = async (data, accessToken) =>
  await post(`/admin/users/`, data, {
    authorization: `Bearer ${accessToken}`,
  });

// const addProperty = async (data, token) => post(`/properties/`, data, { authorization: token });
// const updateProperty = async (id, data, token) =>
//   put(`/properties/${id}/`, data, { authorization: token });

// const deleteProperty = async (id, token) =>
//   axiosDelete(`/properties/${id}/`, { authorization: token });

export const apiProvider = {
  login,
  // register,
  updateUser,
  addUserByAdmin,
  changePassword,
  // addProperty,
  // updateProperty,
  // deleteProperty,
};
