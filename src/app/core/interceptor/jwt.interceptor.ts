import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { TokenStorageService } from "../service/token-storage.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private tokenStorage: TokenStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve the token
    const token = this.tokenStorage.getToken();

    // Safely check for token before modifying the headers
    if (token) {
      const cloneReq = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
      console.log("JWT Interceptor: Adding Authorization header only");
      return next.handle(cloneReq);
    }

    console.warn('JWT Interceptor: Token missing, skipping headers.');
    return next.handle(request); // Proceed without modifying the headers
  }
}
