import axios from "axios";
import { toast } from "react-toastify";
import localStorageService from "./localStorage.service";



export const http = axios.create({
  baseURL: "http://test-blog-api.ficuslife.com/api/v1/",
});

http.interceptors.request.use((req) => {
  const token = localStorageService.getAccessToken();
  req.headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  return req;
});

http.interceptors.response.use(
  (res) => res,
  function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedErrors) {
      console.log(error);
      toast.error("Something went wrong , try it later");
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
