import { Injectable } from '@angular/core';
import { HttpResponse, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

declare const indexedDB_helper: any;

@Injectable({
    providedIn: 'root'
})
export class HttpCacheService {
    constructor() {
        indexedDB_helper.init();
    }

    getFromCache(req: HttpRequest<any>): Observable<HttpResponse<any>> {
        const url = req.urlWithParams;
        return from(indexedDB_helper.read(url)).pipe(map((cached: any) => {
            if (!cached) {
                return undefined;
            }

            const isExpired = (Date.now() - cached.timestamp) > (MaxCacheTime.time * 60 * 60 * 60);
            if (isExpired) {
                indexedDB_helper.remove(url);
                return null;
            }

            return new HttpResponse(JSON.parse(cached.data));
        }));
    }


    addToCache(req: HttpRequest<any>, response: HttpResponse<any>): void {
        indexedDB_helper.add({
            url: req.urlWithParams,
            data: JSON.stringify(response),
            timestamp: Date.now()
        });
    }
}

// Max Cache Time is to be set using this exposed class
// Usually right after reading the assets folder
export class MaxCacheTime {
    static time = 0;
}
