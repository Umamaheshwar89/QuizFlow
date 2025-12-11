import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import { useAuth } from '../context/AuthContext';

export interface UserProfile {
    email: string;
    displayName?: string;
    xp: number;
    streak: number;
    lastDailyQuizDate?: string;
    role?: 'user' | 'admin';
    level: number;
    topicsCompleted: number;
    quizAttempts: number;
    accuracy: number;
    joinedAt: string;
    photoURL?: string;
    hasOnboarded?: boolean;
}

export function useUserProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as UserProfile;
                setProfile({
                    ...data,
                    displayName: data.displayName || user.displayName || undefined,
                    photoURL: data.photoURL || user.photoURL || undefined,
                    joinedAt: data.joinedAt || (data as any).createdAt || new Date().toISOString(),
                    hasOnboarded: data.hasOnboarded
                });
            } else {
                auth.signOut();
                setProfile(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching user profile:", error);
            if (error.code === 'permission-denied') {
                auth.signOut();
            }
            setLoading(false);
        });
        return unsub;
    }, [user]);

    return { profile, loading };
}
