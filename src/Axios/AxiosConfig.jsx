import axios from "axios";
import { useState, useEffect } from "react";

const axiosInstance = axios.create({
  //baseURL: "https://ecom-backend-sys6.onrender.com",
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const useAxiosLoader = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isSubscribed = true;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        if (isSubscribed) setLoading(true);
        return config;
      },
      (error) => {
        if (isSubscribed) setLoading(false);
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        if (isSubscribed) setLoading(false);
        return response;
      },
      (error) => {
        if (isSubscribed) setLoading(false);
        return Promise.reject(error);
      }
    );

    return () => {
      isSubscribed = false;
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return [loading];
};

export { axiosInstance, useAxiosLoader };
