import axios, {AxiosInstance} from "axios";
import {Lists} from "../entities/lists";
import {ResponseList} from "../entities/response-list";
import {addList, addTask, deleteTask, updateList, updateTask} from "../redux/actions/lists-actions";
import {Category} from "../entities/category";
import {Task} from "../entities/task";

export class Api {
    private instance: AxiosInstance

    constructor() {
        this.instance = axios.create({baseURL: 'http://mobile-dev.oblakogroup.ru/candidate/baryshpolmaxim'})
    }

    getAllLists() {
        return this.instance.get<Lists[]>('/list')
    }

    createList(title: string, add: typeof addList) {
        this.instance.post(
            '/list',
            {title: title})
            .then((value: { data: ResponseList }) => {
                add({...value.data, todos: []})
            })
            .catch(reason => console.log(reason))

    }

    updateList(category: Category, onUpdate: typeof updateList) {
        this.instance
            .patch(`/list/${category.id}`, {title: category.title})
            .then(() => {
                onUpdate(category)
            })
            .catch(reason => console.log(reason))
    }

    deleteCategory(id: number) {
        this.instance
            .delete(`/list/${id}`)
            .then(value => console.log(value))
            .catch(reason => console.log('API deleteCategory then', reason))
    }

    addTask(text: string, listId: number, addNote: typeof addTask) {
        this.instance
            .post(`/list/${listId}/todo`, {text: text})
            .then((value: { data: Task }) => {
                addNote(value.data, listId)
            })
            .catch(reason => console.log(reason))

    }

    updateTask(task: Task, updTask: typeof updateTask) {
        this.instance
            .patch(`/list/${task.list_id}/todo/${task.id}`, {...task})
            .then((value: { data: Task }) => {
                updTask(value.data)
                console.log(value)
            })
            .catch(reason => console.log(reason))
    }

    deleteTask(task: Task, delTask: typeof deleteTask) {
        this.instance
            .delete(`/list/${task.list_id}/todo/${task.id}`)
            .then(() => {
                delTask(task)
            })
            .catch(reason => console.log(reason))
    }
}
