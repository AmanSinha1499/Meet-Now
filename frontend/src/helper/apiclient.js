import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-type": "application/json; charset=UTF-8",
  },
});

apiClient.interceptors.request.use(function (config) {
  config.headers["X-CSRFToken"] = Cookies.get("teams_csrftoken");
  return config;
});

export default apiClient;
