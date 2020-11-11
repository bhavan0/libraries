import { ActionTypes, ActionEx } from './ngrx-store.actions';

export const initialState: any = {};

export function RootReducer(state = initialState, action: ActionEx): any {

    if (action.type === ActionTypes.save.toString()) {
        return Object.assign(state, action.payload);
    }
    if (action.type === ActionTypes.delete.toString()) {
        delete state[action.payload];
        return state;
    }
    return state;
}
