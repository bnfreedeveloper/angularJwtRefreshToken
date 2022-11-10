import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProtectAccessService {
  private baseUrl = environment.baseUrl + "admin";
  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(this.baseUrl)
  }
  getDataForAdmin() {
    return this.http.get(this.baseUrl + "/private")
  }
}
