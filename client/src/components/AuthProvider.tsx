"use client"
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';


const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <>
            {children}
        </>
    );
}

export default AuthProvider;
