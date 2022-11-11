import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { TokenManagementService } from './tokenManagement.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    let isvalid: boolean = false;
    if (this.authService.isLoggedIn()) return true;
    else {
      // this.tokenManage.refreshToken().subscribe({
      //   next: response => {
      //     this.tokenManage.AddToken(response.token);
      //     this.tokenManage.AddRefreshToken(response.refreshToken);
      //     isvalid = this.authService.isLoggedIn()
      //   },
      //   error: err => {
      //     isvalid = false
      //   }
      // })
      // if (!isvalid) this.router.navigate(["./login"])
      // return isvalid;
      let result: boolean = await new Promise((res, rej) => {
        this.tokenManage.refreshToken().subscribe({
          next: response => {
            this.tokenManage.AddToken(response.token);
            this.tokenManage.AddRefreshToken(response.refreshToken);
            isvalid = this.authService.isLoggedIn();
            // if (isvalid) this.tokenManage.getUserRoles();
            res(isvalid)
          },
          error: err => {
            isvalid = false,
              rej(isvalid)
          }
        })
      })
      if (!result) this.router.navigate(["./login"]);
      return result;
    }
  }
  constructor(private authService: AuthenticationService, private router: Router,
    private tokenManage: TokenManagementService) { }

}
