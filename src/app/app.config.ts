import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  QueryClient,
  provideAngularQuery,
} from '@tanstack/angular-query-experimental';
import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

// Define a default query function that will receive the query key
// const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
//   const { data } = await axios.get(`http://localhost:3000/api/${queryKey[0]}`);
//   return data;
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAngularQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            // queryFn: defaultQueryFn,
          },
        },
      })
    ),
  ],
};
