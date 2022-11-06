import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../Models/changePassword';
import { CoreResponse } from '../Models/coreResponse';
import { LoginModel } from '../Models/loginModel';
import { LoginResponse } from '../Models/loginResponse';
import { RegisterModel } from '../Models/registerModel';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.baseUrl + "authentication/";
  constructor(private http: HttpClient) { }

  login(login: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl + "login", login)
  }
  register(register: RegisterModel): Observable<CoreResponse> {
    return this.http.post<CoreResponse>(this.baseUrl + "register", register)
  }
  changePassword(changePassword: ChangePassword): Observable<CoreResponse> {
    return this.http.post<CoreResponse>(this.baseUrl + "changePassword", changePassword)
  }
}
