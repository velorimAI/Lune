// import {
//     UseQueryOptions,
//     useQuery as useReactQuery,
//   } from '@tanstack/react-query';
//   import { Method, AxiosRequestConfig } from 'axios';
//   import { httpService } from '@/lib/http-service/http-service';
//   import { useLogout } from '@/app/auth/hooks';
//   import React from 'react';

  
//   interface Options<TData = unknown> extends UseQueryOptions<TData> {
//     url: string;
//     method: Method;
//     successMessage?: string;
//     errorMessage?: string;
//     requestOptions?: AxiosRequestConfig;
//     transformer?: (data: any) => TData;
//     queryFn?: () => Promise<TData>;
//     showServerError?: boolean;
//   }
  
//   export const useQuery = <TData = unknown,>(params: Options<TData>) => {
//     const {
//       url,
//       method,
//       requestOptions,
//       transformer,
//       queryFn,
//       ...queryHookOptions
//     } = params;
  
//     const { logout } = useLogout();
  
//     async function defaultQueryFn() {
//       const requestPromise = httpService?.request({
//         url,
//         method,
//         ...requestOptions,
//       });
//       requestPromise?.catch((error) => {
//         const errorUrl = error?.response?.request?.responseURL || '';
//         const getShortUrl = (url: string) => {
//           return url.includes('?') ? url.split('?')[0] : url;
//         };
//         if (error.response?.status === 503) {
//           toast({
//             duration: 10000,
//             description: (
//               <GetFormattedToastContent
//                 title={`Error ${error?.status}`}
//                 url={getShortUrl(errorUrl)}
//                 description={`Service Unavailable. Please try again later.`}
//               />
//             ),
//             variant: 'error',
//           });
//         } else if (error.response?.status === 500) {
//           let message = error?.response?.data || error?.message || '';
//           if (typeof message === 'string' && message.length > 200) {
//             message = message.slice(0, 100) + '...';
//           }
//           toast({
//             duration: 10000,
//             description: (
//               <GetFormattedToastContent
//                 title={`Error ${error?.status}`}
//                 url={getShortUrl(errorUrl)}
//                 description={message}
//               />
//             ),
//             variant: 'error',
//           });
//         } else if (error.response?.status === 404) {
//           const message = error?.response?.data;
//           let messages = '';
  
//           if (Array.isArray(message)) {
//             messages = message
//               .map((item) => {
//                 if (typeof item === 'string') {
//                   return item;
//                 } else if (
//                   item !== null &&
//                   typeof item === 'object' &&
//                   !Array.isArray(item)
//                 ) {
//                   return Object.entries(item)
//                     .map(([key, val]) => `${key}: ${val}`)
//                     .join('\n');
//                 } else {
//                   return JSON.stringify(item);
//                 }
//               })
//               .join('\n');
//           } else if (
//             Object.prototype.toString.call(message) === '[object Object]'
//           ) {
//             Object.keys(message).forEach((key) => {
//               const val = message[key];
//               if (Array.isArray(val)) {
//                 messages += `\n${val.join('\n')}\n`;
//               } else {
//                 messages += `\n${val}\n`;
//               }
//             });
//           } else if (typeof message === 'string') {
//             messages = message;
//           } else {
//             messages = "The page or resource you're looking for was not found.";
//           }
  
//           toast({
//             duration: 10000,
//             description: (
//               <GetFormattedToastContent
//                 title={`Error ${error?.status}`}
//                 url={getShortUrl(errorUrl)}
//                 description={messages}
//               />
//             ),
//             variant: 'error',
//           });
//         } else if (error?.response?.status === 403) {
//           toast({
//             duration: 10000,
//             description: (
//               <GetFormattedToastContent
//                 title={`Error ${error?.status}`}
//                 url={getShortUrl(errorUrl)}
//                 description={`${error?.response?.data?.account || error?.response?.data?.detail}`}
//               />
//             ),
//             variant: 'error',
//           });
//         } else if (error.response?.status === 400) {
//           try {
//             const message = error?.response?.data || '';
//             let messages = '';
//             if (Array.isArray(message)) {
//               messages = message
//                 .map((item) => {
//                   if (typeof item === 'string') {
//                     return item;
//                   } else if (
//                     item !== null &&
//                     typeof item === 'object' &&
//                     !Array.isArray(item)
//                   ) {
//                     return Object.entries(item)
//                       .map(([key, val]) => `${key}: ${val}`)
//                       .join('\n');
//                   } else {
//                     return JSON.stringify(item);
//                   }
//                 })
//                 .join('\n');
//             } else if (
//               Object.prototype.toString.call(message) === '[object Object]'
//             ) {
//               Object.entries(message).forEach(([key, val]) => {
//                 if (Array.isArray(val)) {
//                   val.forEach((msg) => {
//                     messages += `${key}: ${msg}\n`;
//                   });
//                 } else {
//                   messages += `${key}: ${val}\n`;
//                 }
//               });
//             } else {
//               messages = message;
//             }
//             toast({
//               duration: 10000,
//               description: (
//                 <GetFormattedToastContent
//                   title={`Error ${error?.status}`}
//                   url={getShortUrl(errorUrl)}
//                   description={messages}
//                 />
//               ),
//               variant: 'error',
//             });
//           } catch (error) {
//             console.log(
//               'An error occurred while processing the error message:',
//               error
//             );
//           }
//         }
//         if (
//           error?.response?.data?.detail === 'Invalid token' ||
//           error?.response?.data?.detail === 'Token has expired'
//         ) {
//           toast({
//             duration: 10000,
//             description: (
//               <GetFormattedToastContent
//                 title={`Error ${error?.status}`}
//                 url={getShortUrl(errorUrl)}
//                 description={`${error?.response?.data?.detail}`}
//               />
//             ),
//             variant: 'error',
//           });
//           logout();
//           // show notification
//           // revoke
//           // remove token
//           // redirect to /auth/login
//         }
//       });
  
//       return requestPromise.then((response) => {
//         const finalData = response?.data;
//         return transformer ? transformer(finalData) : finalData;
//       });
//     }
  
//     const mainQueryFn = queryFn || defaultQueryFn;
  
//     return useReactQuery<TData>({
//       ...queryHookOptions,
//       queryFn: mainQueryFn,
//       staleTime: 0,
//       gcTime: 0,
//     });
//   };