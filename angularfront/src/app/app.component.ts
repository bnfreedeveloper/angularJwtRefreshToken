import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { delay } from 'rxjs';
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

  constructor(private authService: AuthenticationService, private TokenMang: TokenManagementService) {
  }
  ngOnInit() {
    this.authService.$sendLoginStatus.pipe(delay(1500)).subscribe(status => {
      this.isLoggedIn = status
    })
  }
  logout() {
    this.authService.logout();
  }
  ngDoCheck() {
    this.isLoggedIn = this.TokenMang.checkLoggedIn() ?? false;
  }

}
