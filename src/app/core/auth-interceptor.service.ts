import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Constants } from '../constants';
import { AuthService } from './auth-service.component';

// This service will intercept any HTTP requests made by this app and will attach an access token to them.
// This only happens if the HTTP request is one of your personal APIS, as seen in "startsWith(Constants.apiRoot)".
// If the user attempts to do a forbidden request (i.e. access admin features), they will be sent to an "unauthorized" page.*+/
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private _authService: AuthService,
    private _router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(Constants.apiRoot)) {
      return from(this._authService.getAccessToken().then(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const authReq = req.clone({ headers });
        return next.handle(authReq).pipe(tap(valueNotUsed => { }, error => {
          const respError = error as HttpErrorResponse;
          if (respError && (respError.status === 401 || respError.status === 403)) {
            this._router.navigate(['/unauthorized']);
          }
        })).toPromise();
      }));
    }
    else {
      return next.handle(req);
    }
  }
}
