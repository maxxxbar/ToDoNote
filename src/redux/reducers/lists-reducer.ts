import {Lists} from "../../entities/lists";
import {ADD_ALL_LISTS, ADD_LIST, ADD_TASK, DELETE_LIST, DELETE_TASK, UPDATE_LIST, UPDATE_TASK} from "../action-types";
import {ListsActions} from "../actions/lists-actions";
import rfdc from "rfdc";

interface ReducerType {
    lists: Lists[]
}

const INITIAL_STATE = {lists: []}
const clone = rfdc({proto: true})

export const listsReducer = (state: ReducerType = INITIAL_STATE, action: ListsActions) => {
    switch (action.type) {
        case ADD_ALL_LISTS: {
            return {
                ...state, lists: [...action.payload]
            }
        }
        case ADD_LIST: {
            return {...state, lists: [...state.lists, action.payload]}
        }
        case UPDATE_LIST: {
            const lists = clone(state.lists)
            const index = lists
                .findIndex(value => value.id === action.payload.id)
            lists[index].title = action.payload.title
            return {...state, lists: lists}
        }
        case DELETE_LIST: {
            return {
                ...state, lists: [...state.lists.filter(value => value.id !== action.payload)]
            }
        }
        case ADD_TASK: {
            const lists = clone(state.lists)
            const index = lists.findIndex(value => value.id === action.listId)
            lists[index].todos.push(action.payload)
            return {
                ...state, lists: lists
            }
        }
        case DELETE_TASK: {
            const lists = clone(state.lists)
            const index = lists.findIndex(value => value.id === action.payload.list_id)
            lists[index].todos = lists[index].todos.filter(value => value.id !== action.payload.id)
            return {...state, lists: lists}
        }
        case UPDATE_TASK: {
            const lists = clone(state.lists)
            const listIndex = lists.findIndex(value => value.id === action.payload.list_id)
            const list = lists[listIndex]
            const itemIndex = list.todos.findIndex(value => value.id === action.payload.id)
            lists[listIndex].todos[itemIndex] = action.payload
            return {...state, lists: lists}
        }
        default:
            return state
    }
}
