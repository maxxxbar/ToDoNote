import {ADD_ALL_LISTS, ADD_LIST, ADD_TASK, DELETE_LIST, DELETE_TASK, UPDATE_LIST, UPDATE_TASK} from "../action-types";
import {Lists} from "../../entities/lists";
import {Category} from "../../entities/category";
import {Task} from "../../entities/task";

export const addAllLists = (lists: Lists[]) => (
    {type: ADD_ALL_LISTS, payload: lists} as const)

export const deleteList = (list: Lists) => (
    {type: DELETE_LIST, payload: list} as const)

export const addList = (list: Lists) => (
    {type: ADD_LIST, payload: list} as const
)

export const updateList = (category: Category) => (
    {type: UPDATE_LIST, payload: category} as const
)

export const addTask = (task: Task, listId: number) => (
    {type: ADD_TASK, payload: task, listId: listId} as const
)

export const deleteTask = (task: Task) => (
    {type: DELETE_TASK, payload: task} as const
)

export const updateTask = (task: Task) => (
    {type: UPDATE_TASK, payload: task} as const
)

export type ListsActions = ReturnType<typeof addAllLists>
    | ReturnType<typeof deleteList>
    | ReturnType<typeof addList>
    | ReturnType<typeof updateList>
    | ReturnType<typeof addTask>
    | ReturnType<typeof deleteTask>
    | ReturnType<typeof updateTask>
