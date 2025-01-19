import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface INotification {
    _id: string;
    type: string;
    description: string;
}

interface NotificationState {
    data: INotification[];
}

const initialState: NotificationState = {
    data: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<INotification[]>) => {
            state.data = action.payload;
        },
        addNotification: (state, action: PayloadAction<INotification>) => {
            state.data.push(action.payload);
        },
        deleteNotification: (state, action: PayloadAction<string>) => {
            state.data = state.data.filter(notification => notification._id !== action.payload);
        },
    },
});

export const { setNotifications, addNotification, deleteNotification } = notificationSlice.actions;
export const notificationsData = (state: RootState) => state.notifications.data;
export default notificationSlice.reducer;