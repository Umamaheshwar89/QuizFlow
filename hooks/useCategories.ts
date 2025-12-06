import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string[];
}

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'categories'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const cats: Category[] = [];
            snapshot.forEach((doc) => {
                cats.push(doc.data() as Category);
            });
            setCategories(cats);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching categories:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return { categories, loading };
}
