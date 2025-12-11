
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export interface MCQ {
    id: string;
    topicId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
}

export function useMCQs(topicId?: string) {
    const [mcqs, setMcqs] = useState<MCQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!topicId) {
            setMcqs([]);
            setLoading(false);
            return;
        }

        if (topicId === 'daily') {
            const q = query(
                collection(db, 'mcqs'),
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const results: MCQ[] = [];
                snapshot.forEach((doc) => {
                    results.push({ id: doc.id, ...doc.data() } as MCQ);
                });

                const shuffled = results.sort(() => 0.5 - Math.random());
                setMcqs(shuffled.slice(0, 5));
                setLoading(false);
            });
            return unsubscribe;
        }

        const q = query(
            collection(db, 'mcqs'),
            where('topicId', '==', topicId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results: MCQ[] = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as MCQ);
            });
            setMcqs(results);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching MCQs:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [topicId]);

    return { mcqs, loading };
}
