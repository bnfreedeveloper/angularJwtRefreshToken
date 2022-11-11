import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenManagementService {

  private roles = new Subject<string[] | string>();
  public role = this.roles.asObservable()
  constructor() { }

  AddUser(username: string) {
    localStorage.setItem("username", username);
  }
  AddToken(token: string) {
    localStorage.setItem("token", token)
  }
  AddRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshtoken", refreshToken)
  }
  getToken() {
    return localStorage.getItem("token");
  }
  getRefreshToken() {
    return localStorage.getItem("refreshtoken")
  }
  getUserName() {
    return localStorage.getItem("username")
  }
  checkLoggedIn() {
    return this.getToken() != null && !this.tokenExpired();
  }
  tokenExpired() {
    let token = this.getToken();
    if (token == null) return false;
    let decodeToken: any = jwt_decode(token);
    let expiration = decodeToken.exp;
    return Math.floor(new Date().getTime() / 1000) >= expiration;
  }
  deleteInfos() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("refreshtoken");
  }
  getUserRoles() {
    const helper = new JwtHelperService();
    let token = this.getToken() ?? "";
    if (token != "") {
      const decodedToken = helper.decodeToken(token);
      console.log(decodedToken);
      let roleAccess = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
      let role: string[] | string = decodedToken[roleAccess];
      this.roles.next(role)
    }

  }
}
