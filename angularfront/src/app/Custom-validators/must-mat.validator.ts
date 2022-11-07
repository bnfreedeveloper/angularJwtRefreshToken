import { FormGroup, ValidatorFn } from "@angular/forms";

export function CheckMatch(name: string, matchingName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[name];
        const matchingControl = formGroup.controls[matchingName];
        if (matchingControl.errors && !matchingControl.errors["mustMatch"]) return
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMach: true })
        }
        else matchingControl.setErrors(null)
    }
}