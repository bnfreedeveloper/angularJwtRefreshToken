import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularfront';
  isLoggedIn!: boolean;

  constructor(private authService: AuthenticationService) {
  }
  ngOnInit() {
    this.authService.$sendLoginStatus.pipe(delay(1500)).subscribe(status => {
      this.isLoggedIn = status
    })
  }
  logout() {
    this.authService.logout();
  }

}
