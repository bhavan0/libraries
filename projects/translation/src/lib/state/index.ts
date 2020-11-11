import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from './app.state';
import { TranslateState } from './translate.reducer';

// Extends the app state to include the Translate feature.
// This is required because Translate are lazy loaded.
// So the reference to TranslateState cannot be added to app.state.ts directly.
export interface State extends fromRoot.AppState {
    translate: TranslateState;
}

// Selector functions
const getTranslateFeatureState = createFeatureSelector<TranslateState>('translate');

export const getTranslation = createSelector(
    getTranslateFeatureState,
    state => state.translation
);

export const getCurrentTranslation = createSelector(
    getTranslateFeatureState,
    state => state.currentTranslation
);
