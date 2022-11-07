import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms"
import { ValidatePattern } from 'src/app/Custom-validators/pattern-match.validator';
import { CheckMatch } from 'src/app/Custom-validators/must-mat.validator';
import { CoreResponse } from "../../Models/coreResponse"
import { delay, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',

})
export class RegisterComponent implements OnInit {

  frmGroup!: FormGroup;
  checkIfDirtyOrTouched!: boolean;
  responsePost: CoreResponse = {};
  loading!: boolean;
  get frmvalue() {
    return this.frmGroup.controls;
  }
  constructor(private authService: AuthenticationService, private fb: FormBuilder) { }

  ngOnInit(): void {
    let regex = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&-+=()])(?=\\S+$).{8,20}$')

    //^ represents starting character of the string.
    //(?=.*[0-9]) represents a digit must occur at least once.
    //(?=.*[a-z]) represents a lower case alphabet must occur at least once.
    //(?=.*[A-Z]) represents an upper case alphabet that must occur at least once.
    //(?=.*[@#$%^&-+=()] represents a special character that must occur at least once.
    //(?=\\S+$) white spaces don’t allowed in the entire string.
    //.{8, 20} represents at least 8 characters and at most 20 characters.
    //$ represents the end of the string.

    let mailformat = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    this.frmGroup = this.fb.group({
      "name": ["", Validators.required],
      "username": ["", Validators.required],
      "password": ["", [Validators.required, ValidatePattern(regex)]],
      "confirmPassword": ["", Validators.required],
      "email": ["", [Validators.required, ValidatePattern(new RegExp(mailformat))]]

    }, {
      validator: CheckMatch("password", "confirmPassword")
    })
    this.checkIfDirtyOrTouched = (this.frmvalue['password'].dirty || this.frmvalue['password'].touched)
  }
  onSubmit() {
    console.log(this.frmGroup.value)
    this.responsePost.success = false;
    this.responsePost.message = 'waiting...';
    this.authService.register(this.frmGroup.value).pipe(tap(() => {
      this.loading = true;
    }), delay(2000)).subscribe({
      next: response => {
        this.responsePost = response;
        this.loading = false;
      },
      error: err => {
        console.log(err)
        this.responsePost.success = err.error.success;
        this.responsePost.message = err.error.error;
        this.loading = false;
        this.frmGroup.reset();
        console.log(this.responsePost)
      },
      complete: () => {
        this.frmGroup.reset();
      }
    })
  }

}
