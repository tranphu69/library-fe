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
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfVVNFUl9NQU5BR0VNRU5UIiwiUk9MRV9QRVJNSVNTSU9OX01BTkFHRU1FTlQiLCJST0xFX1JPTEVfTUFOQUdFTUVOVCJdLCJpYXQiOjE3NjQ5MDc2MzQsImV4cCI6MTc2NDkzNzYzNH0.nL8gPLQU9IwPRpIA06YWZ_odzMiXEWQ40tPcNky112g';

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
