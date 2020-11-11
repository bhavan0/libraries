import { HttpClient } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Translation } from '../models/translation.model';
import * as translation from '../state';
import * as translationActions from '../state/translate.actions';
import { Injectable } from '@angular/core';
import { TranslationService } from '../translation.service';

@Injectable({
    providedIn: 'root'
})
export class TranslationResolver implements Resolve<Promise<void>> {

    currentModule: string;
    moduleNames: string[];
    constructor(
        private http: HttpClient,
        private store: Store<translation.State>) {

        this.store.pipe(select(translation.getTranslation)).subscribe(
            (data) => {
                if (data) {
                    if (this.moduleNames === undefined) {
                        this.moduleNames = [];
                    }
                    data.forEach(x => {
                        if (this.moduleNames.indexOf(x.moduleName) === -1) {
                            this.moduleNames.push(x.moduleName);
                        }
                    });
                    this.store.dispatch(new translationActions.LoadCurrentTranslation(this.currentModule));
                }
            }
        );
    }

    resolve(route: ActivatedRouteSnapshot): Promise<void> {

        console.log('resolver data: ' + route.data.module);
        this.currentModule = route.data.module;
        let fileName = '';
        if (this.moduleNames === undefined || this.moduleNames.indexOf(route.data.module) === -1) {
            if (this.currentModule === 'test') {
                fileName = 'test-translation.json';
            }
            // TODO: add other module translation json data here if needed
            return this.http.get('assets/translations/' + fileName).toPromise().then(
                (data: { [key: string]: Translation[] }) => {
                    this.store.dispatch(new translationActions.LoadAllTranslation({ moduleName: route.data.module, translation: data }));

                    // Used to initialize the Translation Service once the dispatch is done
                    const x = new TranslationService(this.store);
                });
        } else {
            this.store.dispatch(new translationActions.LoadCurrentTranslation(this.currentModule));

            // Used to initialize the Translation Service once the dispatch is done
            const x = new TranslationService(this.store);
        }
    }
}
