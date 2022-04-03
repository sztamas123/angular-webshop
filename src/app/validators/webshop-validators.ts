import { FormControl, ValidationErrors } from "@angular/forms";

export class WebshopValidators {
    static whitespaceValidator(control: FormControl): ValidationErrors {
        if((control.value != null) && (control.value.trim().length === 0)) {
            return { 'whitespaceValidator': true }
        }
        else {
            return null;
        }
    }
}
