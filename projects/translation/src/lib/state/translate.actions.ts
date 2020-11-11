import { Action } from '@ngrx/store';
import { Translation } from '../models/translation.model';

export enum TranslateActionTypes {
    LoadTranslations = '[string] Load All Translation',
    LoadCurrentTranslation = '[string] Load Current Translation'
}

// Action Creators
export class LoadAllTranslation implements Action {
    readonly type = TranslateActionTypes.LoadTranslations;

    constructor(public payload: { moduleName: string, translation: { [key: string]: Translation[] } }) { }
}

export class LoadCurrentTranslation implements Action {
    readonly type = TranslateActionTypes.LoadCurrentTranslation;

    constructor(public payload: string) { }
}

export type TranslateActions = LoadAllTranslation
    | LoadCurrentTranslation;
