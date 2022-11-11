import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { refreshToken } from '../Models/refreshToken';

@Injectable({
  providedIn: 'root'
})
export class RefreshService {

  private baseUrl = environment.baseUrl + "token"
  constructor(private http: HttpClient) { }
  GenerateTokenRefresh(tokens: refreshToken) {
    return this.http.post<refreshToken | { [key: string]: string }>(this.baseUrl, tokens)
  }
  revokeRefresh() {
    return this.http.post(this.baseUrl + "/revoke", null)
  }
}
