import {combineReducers} from 'redux';
import {createStore} from '@reduxjs/toolkit';
import {listsReducer} from "./reducers/lists-reducer";

const reducers = combineReducers({
    lists: listsReducer
})
export const store = createStore(reducers)
