import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appAlphanumericInput]'
})
export class AlphaNumericInputDirective {

    constructor(private ngControl: NgControl) { }

    @HostListener('input', ['$event.target.value'])
    onInput(value: string): void {
        // Use NgControl patchValue to prevent the issue on validation
        this.ngControl.control.patchValue(value.replace(/[^0-9a-zA-Z ]*/g, ''));
    }
}
