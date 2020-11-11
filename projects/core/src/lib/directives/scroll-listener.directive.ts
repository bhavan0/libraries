import { Directive, Input, Output, EventEmitter, NgZone, OnInit } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appScrollListener]'
})
export class ScrollListenerDirective implements OnInit {
    @Input() target: string;
    @Output() scrollFired = new EventEmitter<Event>();

    constructor(private ngZone: NgZone) { }

    ngOnInit(): void {
        const element = document.getElementsByClassName(this.target);
        if (element.length > 0) {
            element[0].addEventListener('scroll', this.onScrollEvent, true);
            this.ngZone.runOutsideAngular(() => {
                element[0].addEventListener('scroll', this.onScrollEvent, true);
            });
        }
    }

    onScrollEvent = (event: Event): void => {
        this.ngZone.run(() => {
            this.scrollFired.emit(event);
        });
    }
}
