import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { delay, tap } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { TokenManagementService } from './services/tokenManagement.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'angularfront';
  isLoggedIn!: boolean;
  isAdmin!: boolean;

  constructor(private authService: AuthenticationService, private tokenMang: TokenManagementService) {
  }
  ngOnInit() {
    this.authService.$sendLoginStatus.pipe(delay(1500)).subscribe(status => {
      this.isLoggedIn = status
    })
    this.tokenMang.role.subscribe(roles => {
      this.isAdmin = roles.includes("admin")
    })
  }
  logout() {
    this.authService.logout();
  }
  ngDoCheck() {
    this.isLoggedIn = this.authService.isLoggedIn() ?? false;
    this.tokenMang.getUserRoles();
    console.log("changement")
  }

}
