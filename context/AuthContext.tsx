import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            router.replace('/');
        }
    }, [user, loading, segments]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
