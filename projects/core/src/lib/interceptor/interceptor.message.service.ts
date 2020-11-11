import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class InterceptorMessageService {

    constructor() { }

    public isLoading = new BehaviorSubject(false);
}
