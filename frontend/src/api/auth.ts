import axios from 'axios';

const API_URL = 'http://localhost:5000/auth';

export const register = (email: string, password: string, name: string) => {
  return axios.post(`${API_URL}/register`, {
    email,
    password,
    name,
  });
};

export const login = (email: string, password: string) => {
  return axios.post(`${API_URL}/login`, {
    email,
    password,
  });
};

export const logout = (accessToken: string) => {
  return axios.post(
    `${API_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const refreshToken = (refreshToken: string) => {
  return axios.post(`${API_URL}/refresh`, {
    refreshToken,
  });
};

export const getProfile = (accessToken: string) => {
  return axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};