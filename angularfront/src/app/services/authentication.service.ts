import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChangePassword } from '../Models/changePassword';
import { CoreResponse } from '../Models/coreResponse';
import { LoginModel } from '../Models/loginModel';
import { LoginResponse } from '../Models/loginResponse';
import { RegisterModel } from '../Models/registerModel';
import { TokenManagementService } from './tokenManagement.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl = environment.baseUrl + "authentication/";
  public $sendLoginInfos = new BehaviorSubject<boolean>(false);
  public $sendLoginStatus = this.$sendLoginInfos.asObservable();
  constructor(private http: HttpClient, private tokenManag: TokenManagementService,
    private router: Router) { }

  login(login: LoginModel): Observable<LoginResponse | CoreResponse> {
    return this.http.post<LoginResponse | CoreResponse>(this.baseUrl + "login", login)
      .pipe(this.sendLoginStatus())
  }
  register(register: RegisterModel): Observable<CoreResponse | LoginResponse> {
    return this.http.post<CoreResponse>(this.baseUrl + "register", register)
      .pipe(switchMap((value) => {
        return this.login({ username: register.username, password: register.password })

      }))
  }
  changePassword(changePassword: ChangePassword): Observable<CoreResponse> {
    return this.http.post<CoreResponse>(this.baseUrl + "changePassword", changePassword)
  }
  logout() {
    this.tokenManag.deleteInfos();
    this.$sendLoginInfos.next(false);
    setTimeout(() => {
      this.router.navigateByUrl("/login");
    }, 500)

  }
  isLoggedIn(): boolean {
    return this.tokenManag.checkLoggedIn();
  }
  private sendLoginStatus() {
    return tap<LoginResponse | CoreResponse>(response => {
      if (response.success) {
        this.$sendLoginInfos.next(true)
      }
    })
  }
}
