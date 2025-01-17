import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userData, UserState } from '@/store/slices/userSlice';
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

    const router = useRouter();

    useEffect(() => {
        // check if user data exists on initial load
        if (userInfo && userInfo.email && userInfo.name) {
            setAuthState({ isAuthenticated: true, user: userInfo });
            router.push('/dashboard');
        }
    }, []);

    // method to save userdata to ls and update auth state
    const loginUser = (userData: UserState) => {
        setAuthState({ isAuthenticated: true, user: userData });
    };

    // method to update userdata to ls and update auth state
    const logoutUser = async () => {
        setAuthState({ isAuthenticated: false, user: null });
    };

    return { ...authState, loginUser, logoutUser };
}
