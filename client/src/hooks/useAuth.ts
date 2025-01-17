import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser, setUser, userData, UserState } from '@/store/slices/userSlice';
import { useRouter } from 'next/navigation';

interface AuthState {
    isAuthenticated: boolean;
    user: UserState | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null,
    });

    const userInfo = useSelector(userData); // state from redux-store

    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(() => {
        // check if user data exists on initial load
        const token = localStorage.getItem('token');
        if (userInfo && userInfo.email && userInfo.name && token) {
            setAuthState({ isAuthenticated: true, user: userInfo });
            router.push('/dashboard');
        }
    }, []);

    // method to save userdata to ls and update auth state
    const loginUser = (userData: UserState, token?: string) => {
        dispatch(setUser({ email: userData?.email, name: userData?.name }));
        if (token) {
            localStorage.setItem('token', token);
        }
        setAuthState({ isAuthenticated: true, user: userData });
    };

    // method to update userdata to ls and update auth state
    const logoutUser = async () => {
        dispatch(clearUser());
        localStorage.removeItem('token');
        setAuthState({ isAuthenticated: false, user: null });
    };

    return { ...authState, loginUser, logoutUser };
}
