import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const access_token = cookieService.get('access_token');

  if (access_token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return next(authReq);
  }

  return next(req);
};
