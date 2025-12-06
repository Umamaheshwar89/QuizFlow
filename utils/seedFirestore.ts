
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
    color?: string[]; // Keeping color for UI compatibility if needed
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



const CATEGORIES: SeedCategory[] = [
    {
        id: "cat_js",
        title: "JavaScript",
        icon: "🟨",
        order: 1,
        isActive: true,
        color: ['#f7df1e', '#c4b200']
    },
    {
        id: "cat_rn",
        title: "React Native",
        icon: "📱",
        order: 2,
        isActive: true,
        color: ['#61dafb', '#4facfe']
    },
    {
        id: "cat_py",
        title: "Python",
        icon: "🐍",
        order: 3,
        isActive: true,
        color: ['#306998', '#FFD43B']
    },
    {
        id: "cat_ts",
        title: "TypeScript",
        icon: "📘",
        order: 4,
        isActive: true,
        color: ['#007acc', '#0047fa']
    }
];

const TOPICS: SeedTopic[] = [
    {
        id: "topic_001",
        categoryId: "cat_js",
        title: "JavaScript Hoisting",
        slug: "js-hoisting",
        shortSummary: "Understanding how variables & functions are hoisted.",
        content: "Hoisting moves declarations to top of scope at compile phase...",
        difficulty: "medium",
        estimatedReadTime: 5,
        order: 1,
        isActive: true
    },
    {
        id: "topic_002",
        categoryId: "cat_rn",
        title: "Core Components",
        slug: "rn-core-components",
        shortSummary: "Learn about View, Text, Image, and ScrollView.",
        content: "React Native provides several built-in components...",
        difficulty: "easy",
        estimatedReadTime: 4,
        order: 1,
        isActive: true
    },
    {
        id: "topic_003",
        categoryId: "cat_js",
        title: "Closures",
        slug: "js-closures",
        shortSummary: "Mastering function scopes and lexical environments.",
        content: "A closure is the combination of a function bundled together...",
        difficulty: "hard",
        estimatedReadTime: 8,
        order: 2,
        isActive: true
    },
    {
        id: "topic_004",
        categoryId: "cat_py",
        title: "List Comprehensions",
        slug: "py-list-comp",
        shortSummary: "Writing concise lists in Python.",
        content: "List methods allow cleaner syntax for creating lists...",
        difficulty: "easy",
        estimatedReadTime: 3,
        order: 1,
        isActive: true
    },
    {
        id: "topic_005",
        categoryId: "cat_ts",
        title: "Interfaces vs Types",
        slug: "ts-interfaces",
        shortSummary: "When to use which definition style.",
        content: "Type aliases and interfaces can be very similar...",
        difficulty: "medium",
        estimatedReadTime: 6,
        order: 1,
        isActive: true
    }
];

const MCQS: SeedMCQ[] = [
    {
        id: "mcq_001",
        topicId: "topic_001",
        question: "Which keyword is hoisted but not initialized?",
        options: [
            "var",
            "let",
            "const",
            "function"
        ],
        correctAnswer: "let",
        explanation: "let is hoisted but remains in TDZ.",
        difficulty: "medium"
    },
    {
        id: "mcq_002",
        topicId: "topic_002",
        question: "Which component renders a scrollable container?",
        options: ["View", "ScrollView", "Text", "Image"],
        correctAnswer: "ScrollView",
        explanation: "ScrollView enables scrolling for its children.",
        difficulty: "easy"
    },
    {
        id: "mcq_003",
        topicId: "topic_003",
        question: "What does a closure give you access to?",
        options: ["Outer function's scope", "Global scope only", "Parent's private vars", "DOM elements"],
        correctAnswer: "Outer function's scope",
        explanation: "Closures allow access to an outer function's scope from an inner function.",
        difficulty: "medium"
    },
    {
        id: "mcq_004",
        topicId: "topic_004",
        question: "What is the output of [x*2 for x in range(3)]?",
        options: ["[0, 1, 2]", "[0, 2, 4]", "[1, 2, 3]", "[2, 4, 6]"],
        correctAnswer: "[0, 2, 4]",
        explanation: "Range(3) gives 0,1,2. Doubling them gives 0,2,4.",
        difficulty: "easy"
    },
    {
        id: "mcq_005",
        topicId: "topic_005",
        question: "Can Interfaces extend Types?",
        options: ["Yes", "No", "Only in strict mode", "Only classes"],
        correctAnswer: "Yes",
        explanation: "Interfaces can extend types if the type acts like an object.",
        difficulty: "medium"
    }
];



const ACHIEVEMENTS: SeedAchievement[] = [
    // --- Quiz Milestones (25) ---
    ...Array.from({ length: 25 }, (_, i) => {
        const count = i === 0 ? 1 : (i + 1) * 5; // 1, 10, 15... (simplified logic for variety)
        // Better progression: 1, 5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500...
        const levels = [1, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125, 150, 175, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000];
        const val = levels[i] || (i * 100);
        return {
            id: `quiz_count_${val}`,
            title: `Quiz Warrior ${val}`,
            description: `Complete ${val} quizzes`,
            iconSVG: "", // Fallback to Trophy icon
            condition: { type: "quiz_count", count: val },
            rewardXP: val * 10,
            badgeType: val >= 500 ? "gold" : val >= 100 ? "silver" : "bronze",
            isActive: true,
            createdAt: "2025-01-01"
        };
    }),

    // --- XP Milestones (25) ---
    ...Array.from({ length: 25 }, (_, i) => {
        const levels = [100, 500, 1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 2000000, 5000000];
        const val = levels[i] || (i * 1000);
        return {
            id: `xp_milestone_${val}`,
            title: `XP Hunter ${val / 1000}k`,
            description: `Earn ${val} total XP`,
            iconSVG: "", // Fallback to Award icon
            condition: { type: "xp", count: val },
            rewardXP: Math.floor(val * 0.1),
            badgeType: val >= 100000 ? "gold" : val >= 10000 ? "silver" : "bronze",
            isActive: true,
            createdAt: "2025-01-01"
        };
    }),

    // --- Streak Milestones (25) ---
    ...Array.from({ length: 25 }, (_, i) => {
        // 3, 7, 14, 21, 30, 45, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365, 400, 500...
        const levels = [3, 7, 10, 14, 21, 30, 40, 50, 60, 75, 90, 100, 120, 150, 180, 200, 240, 270, 300, 330, 365, 400, 500, 730, 1000];
        const val = levels[i] || (i * 10);
        return {
            id: `streak_${val}`,
            title: `${val} Day Streak`,
            description: `Maintain a streak for ${val} days`,
            iconSVG: "", // Fallback to Flame icon
            condition: { type: "streak", count: val },
            rewardXP: val * 20,
            badgeType: val >= 100 ? "gold" : val >= 30 ? "silver" : "bronze",
            isActive: true,
            createdAt: "2025-01-01"
        };
    }),

    // --- Topic Completions (25) ---
    ...Array.from({ length: 25 }, (_, i) => {
        const levels = [1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 140, 160, 180, 200, 250, 300, 500];
        const val = levels[i] || (i * 5);
        return {
            id: `topic_${val}`,
            title: `Scholar ${val}`,
            description: `Complete ${val} topics`,
            iconSVG: "", // Fallback to Book/Star icon
            condition: { type: "topic_completed", count: val },
            rewardXP: val * 50,
            badgeType: val >= 50 ? "gold" : val >= 20 ? "silver" : "bronze",
            isActive: true,
            createdAt: "2025-01-01"
        };
    })
];

// --- Seeding Function ---

export const seedDatabase = async () => {
    try {
        console.log("Starting RICH seed process...");

        // 0. Connectivity Test
        try {
            const testRef = doc(collection(db, 'connection_test'));
            await Promise.race([
                // just a dummy write
                // @ts-ignore
                require('firebase/firestore').setDoc(testRef, { status: 'ok', time: new Date() }),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Connectivity Test Timeout')), 5000))
            ]);
        } catch (e) {
            console.error("Connectivity check failed:", e);
            throw e;
        }

        const batch = writeBatch(db);
        let count = 0;



        // 2. Seed Categories

        CATEGORIES.forEach(cat => {
            const ref = doc(db, 'categories', cat.id);
            // Map 'title' to 'name' if existing app uses 'name'
            batch.set(ref, { ...cat, name: cat.title });
            count++;
        });

        // 3. Seed Topics
        TOPICS.forEach(topic => {
            const ref = doc(db, 'topics', topic.id);
            batch.set(ref, topic);
            count++;
        });

        // 4. Seed MCQs
        MCQS.forEach(mcq => {
            const ref = doc(db, 'mcqs', mcq.id);
            batch.set(ref, mcq);
            count++;
        });

        // 5. Seed Other Collections
        // ACHIEVEMENTS.forEach(item => { batch.set(doc(db, 'achievements', item.id), item); count++; });

        console.log(`Committing batch with ${count} operations...`);

        await Promise.race([
            batch.commit(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Batch Commit Timeout (15s)')), 15000))
        ]);

        console.log(`Successfully seeded ${count} documents!`);
        return true;
    } catch (error) {
        // console.error("Error seeding database:", error); // Don't log full error object to console in production
        console.error("Error seeding database: " + error);
        throw error;
    }
};

export const clearDatabase = async () => {
    console.log("Clear function not implemented.");
};
