import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api';

export const api = axios.create({
  baseURL,
  timeout: 10000
});

export const setAccessToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = 'Token ' + token;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};
