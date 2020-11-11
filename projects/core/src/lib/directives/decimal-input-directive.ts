import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appDecimalInput]'
})
export class ThreeDigitDecimalNumberDirective {

    private regex: RegExp = new RegExp(/^\d{0,10}(\.\d{0,2})?$/g);
    private specialKeys: Array<string> =
        ['Backspace', 'Tab', 'End', 'Home', '-', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const position = this.el.nativeElement.selectionStart;
        const next: string = [current.slice(0, position), event.key === 'Decimal' ? '.' : event.key, current.slice(position)].join('');
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }

}
