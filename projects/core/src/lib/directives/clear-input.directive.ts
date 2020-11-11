import { Directive, ElementRef, Renderer2, HostListener, Input, AfterViewInit, EventEmitter, Output } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appClearInput]'
})
export class TreeClearInputDirective implements AfterViewInit {
    constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

    crossElement: any;
    @Output() resetInput = new EventEmitter();

    ngAfterViewInit(): void {
        this.crossElement = this.renderer.createElement('i');
        this.renderer.addClass(this.crossElement, 'ui-button');
        this.renderer.addClass(this.crossElement, 'ei');
        this.renderer.addClass(this.crossElement, 'ei-cross');
        this.renderer.addClass(this.crossElement, 'clearSearch');
        this.renderer.setAttribute(this.crossElement, 'title', 'Clear');
        const elementData = this.elementRef.nativeElement.getElementsByClassName('ui-inputtext');
        if (elementData.length && !elementData[0].value) {
            this.renderer.addClass(this.crossElement, 'hidden');
        }
        this.renderer.listen(this.crossElement, 'click', () => {
            this.elementRef.nativeElement.getElementsByClassName('ui-inputtext')[0].value = '';
            this.renderer.addClass(this.crossElement, 'hidden');
            this.resetInput.emit();
        });
        this.renderer.appendChild(this.elementRef.nativeElement, this.crossElement);
    }

    @HostListener('window:keyup', ['$event'])
    keyEvent(): void {
        if (this.elementRef.nativeElement.getElementsByClassName('ui-inputtext')[0].value) {
            this.renderer.removeClass(this.crossElement, 'hidden');
        } else {
            this.renderer.addClass(this.crossElement, 'hidden');
        }
    }

}
