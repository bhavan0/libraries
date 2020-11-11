import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appIntegerInput]'
})
export class IntegerInputDirective {

    constructor(private el: ElementRef) { }

    @HostListener('input', ['$event']) onInputChange(event: { stopPropagation: () => void; }): void {
        const initialValue = this.el.nativeElement.value;
        const newValue = initialValue.replace(/[^0-9]*/g, '');
        if (initialValue !== newValue) {
            this.el.nativeElement.value = newValue;
            event.stopPropagation();
        }
    }
}
