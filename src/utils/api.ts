import axios, { AxiosInstance } from 'axios';

const BACKEND_URL = 'https://14.design.htmlacademy.pro/six-cities';
const TIMEOUT = 5000;

export const createAPI = (): AxiosInstance =>
  axios.create({
    baseURL: BACKEND_URL,
    timeout: TIMEOUT,
  });
