import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Thêm token vào header nếu có
    //const token = localStorage.getItem('access_token');
    const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfVVNFUl9NQU5BR0VNRU5UIiwiUk9MRV9ST0xFX01BTkFHRU1FTlQiLCJST0xFX1BFUk1JU1NJT05fTUFOQUdFTUVOVCJdLCJpYXQiOjE3NjM1Mzk0MzEsImV4cCI6MTc2MzU0MzAzMX0.uI7U_i-rEqq5Db7rQSyVjY6tM0o83hcB67Y3vleuvzY"
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
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