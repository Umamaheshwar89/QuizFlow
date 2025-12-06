
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export interface Topic {
    id: string;
    categoryId: string;
    title: string;
    slug: string;
    shortSummary: string;
    content: string;
    difficulty: string;
    estimatedReadTime: number;
    order: number;
    isActive: boolean;
}

export function useTopics(categoryId?: string) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!categoryId) {
            setTopics([]);
            setLoading(false);
            return;
        }

        try {
            const q = query(
                collection(db, 'topics'),
                where('categoryId', '==', categoryId),
                where('isActive', '==', true)
                // orderBy('order', 'asc') // Requires index, remove if not indexed yet
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const results: Topic[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as Topic);
                });
                // Manual sort if index is missing
                results.sort((a, b) => a.order - b.order);
                setTopics(results);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching topics:", error);
                setLoading(false);
            });

            return unsubscribe;
        } catch (err) {
            console.error("Query error:", err);
            setLoading(false);
        }
    }, [categoryId]);

    return { topics, loading };
}
