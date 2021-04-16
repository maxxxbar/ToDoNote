import {Task} from "./task";

export interface Lists {
    id: number;
    title: string;
    candidate_id: number;
    created_at: string;
    updated_at: string;
    todos: Task[];
}
