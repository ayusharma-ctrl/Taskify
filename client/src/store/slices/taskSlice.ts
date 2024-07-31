import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface ITask {
    _id: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    deadline?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface TaskState {
    data: ITask[];
}

const testTasks: ITask[] = [
    {
        _id: "1",
        title: "Implement feature X",
        status: "to-do",
        priority: "medium",
        description: "bsajhbjhabh mnss as jsa  n sjabjsbja s hsbahbjsja jhsba shabsjhjab",
        createdAt: new Date(),
    },
    {
        _id: "2",
        title: "Fix bug Y",
        status: "in-progress",
        priority: "low",
        createdAt: new Date(),
    },
    {
        _id: "3",
        title: "Review design Z",
        status: "under-review",
        priority: "urgent",
        description: "bsajhbjhabh mnss as jsa  n sjabjsbja s hsbahbjsja jhsba shabsjhjab",
        createdAt: new Date(),
    },
    {
        _id: "4",
        title: "Complete report A",
        status: "finished",
        priority: "medium",
        createdAt: new Date(),
    },
    {
        _id: "5",
        title: "Update documentation B",
        status: "to-do",
        priority: "low",
        description: "bsajhbjhabh mnss as jsa  n sjabjsbja s hsbahbjsja jhsba shabsjhjab",
        createdAt: new Date(),
    },
];

const initialState: TaskState = {
    data: testTasks,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<ITask[]>) => {
            state.data = action.payload;
        },
        addTask: (state, action: PayloadAction<ITask>) => {
            state.data.push(action.payload);
        },
        updateTask: (state, action: PayloadAction<ITask>) => {
            const index = state.data.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state.data[index] = action.payload;
            }
        },
        updateStatus: (state, action: PayloadAction<{ id: string, status: string }>) => {
            const updatedTasks = state.data.map(task => {
                if (task._id === action.payload.id) {
                    return { ...task, status: action.payload.status };
                }
                return task;
            });
            state.data = updatedTasks;
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(task => task._id !== action.payload);
        },
    },
});

export const { setTasks, addTask, updateTask, deleteTask, updateStatus } = taskSlice.actions;
export const tasksData = (state: RootState) => state.tasks;
export default taskSlice.reducer;