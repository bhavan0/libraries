// TODO: move this directive to external dop angular library

import { Directive, ElementRef, Renderer2, OnInit, Input, HostListener, DoCheck } from '@angular/core';

@Directive({
    // tslint:disable-next-line: directive-selector
    selector: '[appCustomPaginator]'
})
export class CustomPaginatorDirective implements OnInit, DoCheck {

    constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

    @Input() totalRecords: string;

    ngOnInit(): void {
        const element = this.elementRef.nativeElement;
        const self = this;
        setTimeout(() => {
            const leftSpan = self.renderer.createElement('span');
            self.renderer.addClass(leftSpan, 'ui-dropdown-left-span');
            const show = self.renderer.createText('Show');
            self.renderer.appendChild(leftSpan, show);

            const rightSpan = self.renderer.createElement('span');
            self.renderer.addClass(rightSpan, 'ui-dropdown-right-span');
            const perPage = self.renderer.createText(' per page');
            self.renderer.appendChild(rightSpan, perPage);

            const dropdownContainer = element.getElementsByClassName('ui-inputwrapper-filled');
            const dropdown = element.getElementsByClassName('ui-dropdown');
            self.renderer.addClass(dropdown[0], 'ui-dropdown-custom');
            self.renderer.addClass(dropdownContainer[0], 'flex-body');

            self.renderer.appendChild(dropdownContainer[0], leftSpan);
            self.renderer.appendChild(dropdownContainer[0], rightSpan);

            self.updateRowRangeElement();

            const paginatorInDialog = document.getElementsByClassName('ui-dynamic-dialog-body')[0];
            if (paginatorInDialog) {
                paginatorInDialog.addEventListener('scroll', this.onScroll);
            }
        });
    }

    // on next/prev/last/first page button click
    @HostListener('click', ['$event.target'])
    onClick(element: { className: string }): void {
        if (element.className.indexOf('.ui-paginator-page.ui-paginator-element') ||
            element.className.indexOf('ui-dropdown-item')) {
            this.updateRowRangeElement();
        }
    }

    onScroll(): void {
        document.getElementsByTagName('body')[0].click();
    }

    // Range from * to *  of *
    updateRowRangeElement(): void {
        const element = this.elementRef.nativeElement;
        const self = this;
        setTimeout(() => {
            let rowRangeElement: HTMLCollection = element.getElementsByClassName('ui-dropdown-row-range');
            let currentPageInput: HTMLCollection = element.getElementsByClassName('ui-input-current-page');
            let currentPageInputContainer: HTMLCollection = element.getElementsByClassName('ui-input-current-page-container');
            let totalPages: HTMLCollection = element.getElementsByClassName('ui-input-total-pages');

            if (!rowRangeElement[0]) {
                rowRangeElement = self.renderer.createElement('span');
                self.renderer.addClass(rowRangeElement, 'ui-dropdown-row-range');
            }

            if (!currentPageInput[0]) {
                currentPageInputContainer = self.renderer.createElement('span');
                self.renderer.addClass(currentPageInputContainer, 'ui-input-current-page-container');

                const page = self.renderer.createElement('span');
                const pageText = self.renderer.createText('Page ');
                self.renderer.appendChild(page, pageText);
                self.renderer.appendChild(currentPageInputContainer, page);

                currentPageInput = self.renderer.createElement('input');
                this.renderer.setAttribute(currentPageInput, 'type', 'number');
                self.renderer.addClass(currentPageInput, 'ui-input-current-page');
                self.renderer.appendChild(currentPageInputContainer, currentPageInput);

                const divider = self.renderer.createElement('span');
                const dividerText = self.renderer.createText(' / ');
                self.renderer.appendChild(divider, dividerText);
                self.renderer.appendChild(currentPageInputContainer, divider);
            }

            const dropdownLabel = element.getElementsByClassName('ui-dropdown-label');
            const rowRange = +dropdownLabel[0].innerText;
            const activePage = element.getElementsByClassName('ui-state-active');
            let currentPage = 1;
            if (+activePage.length > 0) {
                currentPage = +activePage[0].innerText;
            }

            if (!totalPages[0]) {
                totalPages = self.renderer.createElement('span');
                self.renderer.addClass(totalPages, 'ui-input-total-pages');
                const totalPageText = self.renderer.createText(currentPage.toString());
                self.renderer.appendChild(totalPages, totalPageText);
                self.renderer.appendChild(currentPageInputContainer, totalPages);
            } else {
                let totalPagesCount = Math.trunc(+self.totalRecords / rowRange);
                if ((+self.totalRecords / rowRange) > totalPagesCount) {
                    totalPagesCount++;
                }
                totalPages[0].innerHTML = totalPagesCount.toString();
            }

            const rowRangeText = (((rowRange * (currentPage - 1)) + 1) + ' - ' +
                ((+self.totalRecords < (rowRange * currentPage)) ? self.totalRecords :
                    (rowRange * currentPage)) + ' of ' + self.totalRecords);

            if (!rowRangeElement[0]) {
                const rowRangeContent = self.renderer.createText(rowRangeText);
                self.renderer.appendChild(rowRangeElement, rowRangeContent);
                const paginatorContainer = element.getElementsByClassName('ui-paginator');
                self.renderer.appendChild(paginatorContainer[0], rowRangeElement);
            } else {
                rowRangeElement[0].innerHTML = rowRangeText;
            }

            if (!currentPageInput[0]) {
                this.renderer.setProperty(currentPageInput, 'value', currentPage);
                const paginatorPagesContainer = element.getElementsByClassName('ui-paginator-pages');
                self.renderer.appendChild(paginatorPagesContainer[0], currentPageInputContainer);
            } else {
                this.renderer.setProperty(currentPageInput[0], 'value', currentPage);
            }
        });
    }

    // On page number enter
    @HostListener('input') onInput(): void {
        const element = this.elementRef.nativeElement;
        const currentPageInput = element.getElementsByClassName('ui-input-current-page');
        const dropdownLabel = element.getElementsByClassName('ui-dropdown-label');
        const rowRange = +dropdownLabel[0].innerText;

        if (currentPageInput[0].value <= Math.ceil(+this.totalRecords / rowRange)) {
            const allPagesContainer = element.getElementsByClassName('ui-paginator-pages');
            const allPages = allPagesContainer[0].getElementsByClassName('ui-paginator-page');
            for (const page of allPages) {
                if (page.innerText === currentPageInput[0].value) {
                    page.click();
                    break;
                }
            }
        } else {
            const activePage = element.getElementsByClassName('ui-state-active');
            const currentPage = +activePage[0].innerText;
            this.renderer.setProperty(currentPageInput[0], 'value', currentPage);
        }
    }

    @HostListener('focusout') onfocusut(): void {
        const element = this.elementRef.nativeElement;
        const currentPageInput = element.getElementsByClassName('ui-input-current-page');
        if (!currentPageInput[0].value || parseInt(currentPageInput[0].value, 10) < 1) {
            const activePage = element.getElementsByClassName('ui-state-active');
            if (+activePage.length > 0) {
                currentPageInput[0].value = +activePage[0].innerText;
            }
        }
    }

    ngDoCheck(): void {
        this.updateRowRangeElement();
    }
}
