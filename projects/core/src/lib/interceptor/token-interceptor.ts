import { Injectable } from '@angular/core';
import { HttpHandler, HttpRequest, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { map, catchError } from 'rxjs/operators';
import { InterceptorMessageService } from './interceptor.message.service';
import { HttpCacheService } from '../cache/http-cache-service';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

    constructor(
        private oauthService: OAuthService,
        private loggerService: LoggerService,
        private interceptorMsgService: InterceptorMessageService,
        private cacheService: HttpCacheService) {
    }

    intercept(request: HttpRequest<void>, next: HttpHandler): Observable<HttpEvent<void>> {
        this.loggerService.log('request', request);
        request = request.clone({
            setHeaders: {
                Authorization: 'Bearer ' + this.oauthService.getAccessToken()
            }
        });

        // Don't cache if it's not a GET request
        if (request.method !== 'GET') {
            if (!request.headers.has('no-loading')) {
                this.sendLoadingValue(true);
            }
            return from(next.handle(request).pipe(
                map((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        this.sendLoadingValue(false);
                        this.loggerService.log('response', event);
                    }
                    return event;
                }),
                catchError((errorResp) => {
                    this.sendLoadingValue(false);
                    throw errorResp;
                })
            ).toPromise());
        }

        return from(this.handle(request, next));
    }

    async handle(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<void>> {
        if (request.headers.get('cache-response')) {
            const cachedResponse = await this.cacheService.getFromCache(request).toPromise();
            // Checked if there is cached data for this URI
            if (cachedResponse) {
                this.loggerService.log('cache', cachedResponse);
                return (cachedResponse instanceof Observable) ? cachedResponse : of(cachedResponse.clone()).toPromise();
            }
        }

        if (!request.headers.has('no-loading')) {
            this.sendLoadingValue(true);
        }
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (request.headers.get('cache-response')) {
                        // Cache Response if header contains cache-response
                        this.cacheService.addToCache(request, event);
                    }
                    this.sendLoadingValue(false);
                    this.loggerService.log('response', event);
                }
                return event;
            }),
            catchError((errorResp) => {
                this.sendLoadingValue(false);
                throw errorResp;
            })
        ).toPromise();
    }

    sendLoadingValue(value: boolean): void {
        this.interceptorMsgService.isLoading.next(value);
    }
}
