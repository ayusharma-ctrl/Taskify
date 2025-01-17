import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

export interface UserState {
    name: string | null;
    email: string | null;
}

const initialState: UserState = {
    name: null,
    email: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<{ name: string, email: string }>) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
        },
        clearUser: (state) => {
            state.name = null;
            state.email = null;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export const userData = (state: RootState) => state.user;
export default userSlice.reducer;