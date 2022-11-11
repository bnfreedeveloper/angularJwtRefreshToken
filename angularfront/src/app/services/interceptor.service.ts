import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenManagementService } from './tokenManagement.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.injector.get(TokenManagementService);
    let tokenAddedToRequest = req.clone({
      setHeaders: {
        "Authorization": "Bearer " + authService.getToken()

      }
    })
    //console.log(this.injector.get(TokenManagementService).getToken())
    return next.handle(tokenAddedToRequest);
  }
}
