import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export function ValidatePattern(regx: RegExp): ValidatorFn {
    return (control: AbstractControl) => {
        const check = regx.test(control.value);
        return check ? null : { invalidPattern: true }
    }
}