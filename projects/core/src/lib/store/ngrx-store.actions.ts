import { Action } from '@ngrx/store';

export enum ActionTypes {
    save,
    delete
}
export class ActionEx implements Action {

    readonly type: any;
    payload: any;
}

export class SetStoreState implements ActionEx {
    readonly type = ActionTypes.save.toString();
    constructor(public payload: any) { }
}
