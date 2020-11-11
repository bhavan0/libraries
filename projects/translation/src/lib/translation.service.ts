import { Store, select } from '@ngrx/store';
import * as translation from './state';
import { Translation } from './models/translation.model';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TranslationService {

    private static defaultTranslations: Translation[];
    private static currentTranslations: Translation[];

    constructor(private store: Store<translation.State>) {
        const language = sessionStorage.getItem('LanguageCode');
        this.store.pipe(select(translation.getCurrentTranslation)).subscribe(
            (data) => {
                if (data) {
                    TranslationService.defaultTranslations = data.en;
                    TranslationService.currentTranslations = data[language] === undefined ?
                        data.en : data[language];
                }
            }
        );
    }


    static translate(value: string): string {
        let temp;
        if (TranslationService.currentTranslations && TranslationService.defaultTranslations) {
            temp = TranslationService.currentTranslations.filter(x => x.key === value).shift()
                || TranslationService.defaultTranslations.filter(x => x.key === value).shift();
        }
        return temp === undefined ? value : temp.value;
    }
}
