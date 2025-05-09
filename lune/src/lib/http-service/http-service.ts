// 'use client';

// import axios from 'axios';
// // import { signOut } from 'aws-amplify/auth'; // { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse }
// // import { ApiError } from '@/types/http-errors.interface';
// // import { errorHandler, networkError } from '@/lib/http-service/http-errors';

// let baseURL: string | undefined;

// // if (typeof window !== 'undefined') {
// //   const host = window?.location?.host || '';

// //   if (host.includes('.staging')) {
// //     baseURL = process.env.NEXT_PUBLIC_API_URL_STAGING;
// //   } else if (host.includes('.dev')) {
// //     baseURL = process.env.NEXT_PUBLIC_API_URL_DEV;
// //   } else if (host.includes('app.tritonsensors')) {
// //     baseURL = process.env.NEXT_PUBLIC_API_URL_APP_PRD;
// //   } else {
// //     baseURL = process.env.NEXT_PUBLIC_API_URL;
// //   }
// // } else {
// //   baseURL = process.env.NEXT_PUBLIC_API_URL;
// // }

// const httpService = axios.create({
//   baseURL : "http://localhost:5000",
//   responseType: 'json',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json',
//   },
// });

// // async function getToken() {
// //   const response = await fetch('/api/auth/get-token-id', {
// //     method: 'GET',
// //     credentials: 'include',
// //   });

// //   if (response.ok) {
// //     return await response.json();
// //   } else {
// //     await signOut({ global: true });
// //     fetch('/api/auth/remove-auth-data', {
// //       method: 'POST',
// //     });
// //     window.location.replace('/auth/login');
// //     throw new Error(response.statusText);
// //   }
// // }

// // httpService.interceptors.request.use(
// //   async (config) => {
// //     const { token } = await getToken();

// //     if (!config.headers.Authorization && token?.length) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   }
// // );

// // httpService.interceptors.response.use(
// //   (response) => {
// //     return response;
// //   },
// //   (error) => {
// //
// //     if (error?.response) {
// //
// //       if (error?.response?.data?.detail === "Invalid token") {
// //         console.log('Invalid token ===============', error?.response?.data?.detail);
// //
// //         // fetch('/api/auth/remove-auth-data', {
// //         //   method: 'POST',
// //         // });
// //         // router.replace('/auth/login');
// //       }
// //       // const statusCode = error.response?.status;
// // //
// // //       if (statusCode >= 400) {
// // //         const errorData: ApiError = error?.response?.data;
// // //         errorHandler[statusCode](errorData);
// // //       }
// //     } else {
// //       // networkError();
// //     }
// //   }
// // );

// // async function apiBase<T>(
// //   url: string,
// //   options?: Record<any, any>
// // ): Promise<T> {
// //   const response: AxiosResponse = await httpService(url, options);
// //   return response.data as T;
// // }
// //
// // async function readData<T>(
// //   url: string,
// //   headers?: AxiosRequestHeaders
// // ): Promise<T> {
// //   const options: AxiosRequestConfig = {
// //     headers,
// //     method: "GET"
// //   }
// //
// //   return await apiBase<T>(url, options);
// // }
// //
// // async function createData<TModel, TResult>(
// //   url: string,
// //   data: TModel,
// //   headers?: AxiosRequestHeaders
// // ): Promise<TResult> {
// //   const options: AxiosRequestConfig = {
// //     headers,
// //     method: "POST",
// //     data: JSON.stringify(data)
// //   };
// //
// //   return await apiBase<TResult>(url, options)
// // }

// export {
//   // createData,
//   // readData,
//   httpService,
// };