import { TranslateActions, TranslateActionTypes } from './translate.actions';
import { Translation } from '../models/translation.model';

// State for this feature (Translate)
export interface TranslateState {
    translation: { moduleName: string, translation: { [key: string]: Translation[] } }[];
    currentTranslation: { [key: string]: Translation[] };
}

const initialState: TranslateState = {
    translation: null,
    currentTranslation: null
};

export function reducer(state = initialState, action: TranslateActions): TranslateState {

    switch (action.type) {
        case TranslateActionTypes.LoadTranslations:
            return {
                ...state,
                translation: state.translation !== null ? state.translation.concat(action.payload) : [action.payload]
            };

        case TranslateActionTypes.LoadCurrentTranslation:
            return {
                ...state,
                currentTranslation: state.translation !== null ?
                    state.translation.filter(x => x.moduleName === action.payload).shift().translation : state.currentTranslation
            };

        default:
            return state;
    }
}
