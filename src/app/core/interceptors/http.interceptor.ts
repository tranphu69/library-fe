import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Thêm token vào header nếu có
    //const token = localStorage.getItem('access_token');
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfUk9MRV9NQU5BR0VNRU5UIiwiUk9MRV9VU0VSX01BTkFHRU1FTlQiLCJST0xFX1BFUk1JU1NJT05fTUFOQUdFTUVOVCJdLCJpYXQiOjE3NjQwMzYyNjgsImV4cCI6MTc2NDA2NjI2OH0.6_tAykp7rkdCEOs6HJ7xURMw78iY_SpSravsdsbXNuE';

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => error);
      })
    );
  }
}
