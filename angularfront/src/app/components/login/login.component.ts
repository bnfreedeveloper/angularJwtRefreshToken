import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginResponse } from "../../Models/loginResponse"
import { CoreResponse } from "../../Models/coreResponse"
import { TokenManagementService } from 'src/app/services/tokenManagement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',

})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  loginResponse !: LoginResponse;
  loading!: boolean;
  message!: any;
  get FormValues() {
    return this.form.controls;
  }
  constructor(private authService: AuthenticationService, private fb: FormBuilder, private tokenManagement: TokenManagementService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.form.value).pipe(tap(() => this.loading = true),
      catchError(err => {
        throw err;
      }), delay(1500)).subscribe({
        next: response => {
          this.loginResponse = response as LoginResponse;
          console.log(this.loginResponse);
          this.tokenManagement.AddUser(this.loginResponse.userName);
          this.tokenManagement.AddToken(this.loginResponse.token);
          this.tokenManagement.AddRefreshToken(this.loginResponse.refreshToken)
          this.loading = false;
          this.form.reset();
          this.router.navigate(["./dashboard"])
        },
        error: err => {
          this.loginResponse = { success: false, message: err.error.error } as LoginResponse
          this.form.reset();
          this.loading = false;
          this.message = { color: "red" }

        },
        complete: () => {
          this.message = { color: this.loginResponse?.success ? "green" : "red" }
        }
      })
  }
  ngOnInit(): void {
    this.form = this.fb.group({
      "username": ["", Validators.required],
      "password": ["", Validators.required]
    })
    if (this.tokenManagement.checkLoggedIn()) {
      this.router.navigate(["./dashboard"])
    }
  }


}
