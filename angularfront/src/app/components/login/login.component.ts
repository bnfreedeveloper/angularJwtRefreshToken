import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, delay, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { LoginResponse } from "../../Models/loginResponse"
import { CoreResponse } from "../../Models/coreResponse"

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
  constructor(private authService: AuthenticationService, private fb: FormBuilder) { }

  onSubmit() {
    this.authService.login(this.form.value).pipe(tap(() => this.loading = true),
      catchError(err => {
        throw err;
      }), delay(1500)).subscribe({
        next: response => {
          this.loginResponse = response;
          console.log(this.loginResponse);
          this.loading = false;
          this.form.reset();
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
  }


}
