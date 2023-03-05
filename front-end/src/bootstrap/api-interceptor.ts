import axios from 'axios';

const instance = axios.create();

export const setAuthorirationToken = (token: string) => {
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};axios.defaults.headers.common.Authorization

instance.defaults.baseURL = String(import.meta.env.VITE_API_URL);
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        window.location.href = '/logout';
      }

      if (error.config.errorHandling) {
        const { message } = error.response.data;

        if (message && error.config.errorMessageHandling) {
          console.log(message);
        }
      }

      const response = {
        ...error.response.data,
        status_code: error.response.status,
      };

      return Promise.reject(response);
    } else if (error.request) {
      /**
       * The request was made but no response was received
       * `error.request` is an instance of XMLHttpRequest in the browser and an instance of
       * http.ClientRequest in node.js
       */
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log(error.message);
    }

    return Promise.reject(error);
  },
);

export default instance;
