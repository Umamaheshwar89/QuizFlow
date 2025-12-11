
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export interface StudyMaterial {
    id: string;
    categoryId: string;
    title: string;
    content: string;
    readTime: string;
}

export function useStudyMaterials() {
    const [materials, setMaterials] = useState<StudyMaterial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'study_materials'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mat: StudyMaterial[] = [];
            snapshot.forEach((doc) => {
                mat.push({ id: doc.id, ...doc.data() } as StudyMaterial);
            });
            setMaterials(mat);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching study materials:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { materials, loading };
}
