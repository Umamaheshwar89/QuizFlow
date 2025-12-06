import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { SvgXml } from 'react-native-svg';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    iconSVG: string;
    condition: {
        type: string;
        count: number;
    };
    rewardXP: number;
    badgeType: string;
    isActive: boolean;
}

export function useAchievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'achievements'),
            where('isActive', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: Achievement[] = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as Achievement);
            });
            setAchievements(results);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching achievements:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { achievements, loading };
}
