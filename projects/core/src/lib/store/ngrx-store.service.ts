import { Injectable } from '@angular/core';
import { ActionTypes } from './ngrx-store.actions';
import { AsyncSubject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    constructor(private store: Store<{ state: any }>) { }

    Get<T>(idValue: string): Observable<T> {
        const subject = new AsyncSubject<T>();
        this.getValueById(idValue).subscribe(data => {
            subject.next(data as T);
        });
        subject.complete();
        return subject;
    }

    GetMany(idValues: string[]): Observable<any> {
        const returnData: any = {};
        const subject = new AsyncSubject();
        for (const idValue of idValues) {
            this.getValueById(idValue).subscribe(data => returnData[idValue] = data);
        }
        subject.next(returnData);
        subject.complete();
        return subject;
    }

    Save(idValue: string, data: any, isAppLevel?: boolean): void {
        const payload: any = {};
        payload[idValue] = { data, isAppLevel: isAppLevel ? isAppLevel : false };
        this.store.dispatch({ type: ActionTypes.save.toString(), payload });
    }

    delete(idValues: string[]): void {
        for (const idValue of idValues) {
            this.store.dispatch({ type: ActionTypes.delete.toString(), payload: idValue });
        }
    }

    private getValueById(idValue: string): Observable<any> {
        const subject = new AsyncSubject();
        this.store.select((s: any) => s.state[idValue])
            .subscribe((state: any) => {
                if (state) {
                    const data = state.data;
                    subject.next(data);
                    subject.complete();
                    if (state.isAppLevel === false) {
                        this.store.dispatch({ type: ActionTypes.delete.toString(), payload: idValue });
                    }
                } else {
                    subject.complete();
                }
            }).unsubscribe();
        return subject;
    }
}
