import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {

    public log(msg: string, msgObject?: any): void {
        console.log(msg, msgObject);
    }

}
