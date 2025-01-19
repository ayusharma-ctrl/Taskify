export interface IUser {
    name: string,
    email: string;
}

export interface IUserTask {
    id: string,
    title: string,
    description: string,
    status: string,
    priority: string,
    deadline: string,
    createdBy: string,
}