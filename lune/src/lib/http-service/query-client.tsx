import {
  // QueryCache,
  QueryClient,
} from '@tanstack/react-query';

export const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   onError: (error) => {
  //     // show notification
  //     console.log('error', error);
  //   },
  // }),

  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // throwOnError: false,
      // gcTime: 1,
      // staleTime: 2
    },
  },
});
