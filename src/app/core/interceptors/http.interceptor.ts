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
      'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfUEVSTUlTU0lPTl9NQU5BR0VNRU5UIiwiUk9MRV9ST0xFX01BTkFHRU1FTlQiLCJST0xFX1VTRVJfTUFOQUdFTUVOVCJdLCJpYXQiOjE3NjM5NDk5MzIsImV4cCI6MTc2Mzk3OTkzMn0.UIidwTlhewu2ELuM5acD3oJu3BqM9y_EONiJYLd6-Ec';

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
