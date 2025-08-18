// import {
//   MutationKey,
//   useMutation as useReactMutation,
// } from "@tanstack/react-query";
// import { AxiosRequestConfig, Method } from "axios";
// import { httpService } from "@/lib/http-service/http-service";
// import { toast } from "sonner";
// import { queryClient } from "@/lib/http-service/query-client";

// interface MutationFnOptions {
//   queryKey: MutationKey;
//   url: string;
//   method: Method;
//   requestOptions?: AxiosRequestConfig;
//   successMessage?: string;
//   errorMessage?: string;
//   showServerError?: boolean;
//   transformer?: (data: any) => any;
// }

// type MutateFn = (...mutationParams: any) => Promise<MutationFnOptions>;

// export const useMutation = (mutateFn: MutateFn, options?: Record<any, any>) => {

//   const mainMutationFn = async (...mutationParams: any) => {
//     const {
//       url,
//       method,
//       requestOptions,
//       successMessage,
//       errorMessage,
//       showServerError = true,
//       transformer,
//     } = await mutateFn(...mutationParams);

//     const requestPromise = httpService.request({
//       url,
//       method,
//       ...requestOptions,
//     });

//     // مدیریت خطاها
//     requestPromise.catch((error) => {
//       if (!error?.response) {
//         toast(`Error`, {
//           description: "An unknown error occurred.",
//           duration: 10000,
//           closeButton: true,
//         });
//         return;
//       }

//       const errorUrl = error?.response?.request?.responseURL || "";
//       const getShortUrl = (url: string) => url.includes("?") ? url.split("?")[0] : url;

//       const handleError = (status: number, message: string) => {
//         toast(`Error ${status}`, {
//           description: message,
//           duration: 10000,
//           closeButton: true,
//         });
//       };

//       const errorMessages = {
//         503: "Service Unavailable. Please try again later.",
//         500: error?.response?.data || error?.message || "Server Error",
//         404: "The page or resource you're looking for was not found.",
//         403: error?.response?.data?.account || error?.response?.data?.detail,
//         400: error?.response?.data || "Bad Request",
//       };

//       const errorMessage =  "An error occurred.";

//       // اگر توکن نامعتبر باشد
//       if (error?.response?.data?.detail === "Invalid token" || error?.response?.data?.detail === "Token has expired") {
//         handleError(error?.status, error?.response?.data?.detail);
//       } else {
//         handleError(error?.status, errorMessage);
//       }
//     });

//     // مدیریت موفقیت
//     return requestPromise.then((response) => {
//       const finalData = response.data;

//       if (successMessage) {
//         toast(successMessage, {
//           duration: 3000,
//           closeButton: true,
//         });
//       }

//       return transformer ? transformer(finalData) : finalData;
//     });
//   };

//   return useReactMutation(
//     {
//       mutationFn: mainMutationFn,
//       ...options,
//     },
//     queryClient
//   );
// };
