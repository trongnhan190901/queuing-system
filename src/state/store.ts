import * as reduxThunk from 'redux-thunk/extend-redux';
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import itemsReducer from '../state/reducers';

export const store = configureStore({
    reducer: {
        items: itemsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
