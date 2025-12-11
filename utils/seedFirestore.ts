
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';

// --- Data Interfaces ---

interface SeedUser {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    level: number;
    xp: number;
    topicsCompleted: number;
    quizAttempts: number;
    accuracy: number;
    joinedAt: string;
}

interface SeedCategory {
    id: string;
    title: string;
    icon: string;
    order: number;
    isActive: boolean;
    color?: string[];
}

interface SeedTopic {
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

interface SeedMCQ {
    id: string;
    topicId: string;
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    difficulty: string;
}

interface SeedAchievement {
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
    createdAt: string;
}

// --- Sample Data ---
const CATEGORIES: SeedCategory[] = [];

const TOPICS: SeedTopic[] = [];

const MCQS: SeedMCQ[] = [];

const ACHIEVEMENTS: SeedAchievement[] = [];


// --- Seeding Function ---
export const seedDatabase = async () => {
    try {
        console.log("Starting RICH seed process...");
        const batch = writeBatch(db);
        let count = 0;

        // 1. Seed Categories
        CATEGORIES.forEach(cat => {
            const ref = doc(db, 'categories', cat.id);
            // Map 'title' to 'name' if existing app uses 'name'
            batch.set(ref, { ...cat, name: cat.title });
            count++;
        });

        // 2. Seed Topics
        TOPICS.forEach(topic => {
            const ref = doc(db, 'topics', topic.id);
            batch.set(ref, topic);
            count++;
        });

        // 3. Seed MCQs
        MCQS.forEach(mcq => {
            const ref = doc(db, 'mcqs', mcq.id);
            batch.set(ref, mcq);
            count++;
        });

        // 4. Seed Other Collections
        ACHIEVEMENTS.forEach(item => { batch.set(doc(db, 'achievements', item.id), item); count++; });

        console.log(`Committing batch with ${count} operations...`);

        await Promise.race([
            batch.commit(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Batch Commit Timeout (15s)')), 15000))
        ]);

        console.log(`Successfully seeded ${count} documents!`);
        return true;
    } catch (error) {
        console.error("Error seeding database: " + error);
        throw error;
    }
};

export const clearDatabase = async () => {
    console.log("Clear function not implemented.");
};
