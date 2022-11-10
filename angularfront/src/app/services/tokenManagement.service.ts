import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenManagementService {

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
}
