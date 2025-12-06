
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



const CATEGORIES: SeedCategory[] = [
    {
        id: "cat_frontend",
        title: "Frontend Development",
        icon: "🎨",
        order: 1,
        isActive: true,
        color: ["#4F46E5", "#6366F1"]
    },
    {
        id: "cat_backend",
        title: "Backend Development",
        icon: "⚙️",
        order: 2,
        isActive: true,
        color: ["#059669", "#10B981"]
    },
    {
        id: "cat_javascript",
        title: "JavaScript Core",
        icon: "🧠",
        order: 3,
        isActive: true,
        color: ["#F59E0B", "#FBBF24"]
    },
    {
        id: "cat_react",
        title: "React & SPA",
        icon: "⚛️",
        order: 4,
        isActive: true,
        color: ["#0EA5E9", "#38BDF8"]
    },
    {
        id: "cat_node",
        title: "Node & Express",
        icon: "🌿",
        order: 5,
        isActive: true,
        color: ["#16A34A", "#22C55E"]
    },
    {
        id: "cat_database",
        title: "Databases",
        icon: "🗄️",
        order: 6,
        isActive: true,
        color: ["#7C3AED", "#8B5CF6"]
    },
    {
        id: "cat_mobile",
        title: "Mobile Development",
        icon: "📱",
        order: 7,
        isActive: true,
        color: ["#EC4899", "#F472B6"]
    },
    {
        id: "cat_devops",
        title: "DevOps & Cloud",
        icon: "☁️",
        order: 8,
        isActive: true,
        color: ["#06B6D4", "#22D3EE"]
    },
    {
        id: "cat_testing",
        title: "Testing & Debugging",
        icon: "🐞",
        order: 9,
        isActive: true,
        color: ["#EF4444", "#F87171"]
    },
    {
        id: "cat_git",
        title: "Git & Collaboration",
        icon: "🔱",
        order: 10,
        isActive: true,
        color: ["#F97316", "#FB923C"]
    }
];

const TOPICS: SeedTopic[] = [
    /* ============================
 FRONTEND DEVELOPMENT (5)
============================ */
    {
        id: "topic_html_basics",
        categoryId: "cat_frontend",
        title: "HTML Fundamentals",
        slug: "html-fundamentals",
        shortSummary: "Learn structure of web pages using HTML.",
        content: "HTML is the building block of the web. Learn tags, headings, lists, forms, and semantic elements.",
        difficulty: "Beginner",
        estimatedReadTime: 10,
        order: 1,
        isActive: true
    },
    {
        id: "topic_css_basics",
        categoryId: "cat_frontend",
        title: "CSS Styling Basics",
        slug: "css-styling-basics",
        shortSummary: "Style your UI using CSS.",
        content: "CSS is used to control layout, colors, fonts, responsive designs, flexbox, and grid.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 2,
        isActive: true
    },
    {
        id: "topic_responsive_ui",
        categoryId: "cat_frontend",
        title: "Responsive UI Design",
        slug: "responsive-ui-design",
        shortSummary: "Design layouts for all screen sizes.",
        content: "Learn media queries, mobile-first approach, and fluid grids.",
        difficulty: "Intermediate",
        estimatedReadTime: 14,
        order: 3,
        isActive: true
    },
    {
        id: "topic_tailwind",
        categoryId: "cat_frontend",
        title: "Tailwind CSS",
        slug: "tailwind-css",
        shortSummary: "Utility-first CSS framework.",
        content: "Build modern UI rapidly using Tailwind classes.",
        difficulty: "Intermediate",
        estimatedReadTime: 12,
        order: 4,
        isActive: true
    },
    {
        id: "topic_ui_accessibility",
        categoryId: "cat_frontend",
        title: "Accessibility & UX",
        slug: "accessibility-ux",
        shortSummary: "Make websites usable for everyone.",
        content: "Learn ARIA roles, contrast rules, keyboard navigation, and UX basics.",
        difficulty: "Advanced",
        estimatedReadTime: 16,
        order: 5,
        isActive: true
    },

    /* ============================
     JAVASCRIPT CORE (5)
    ============================ */
    {
        id: "topic_js_basics",
        categoryId: "cat_javascript",
        title: "JavaScript Basics",
        slug: "javascript-basics",
        shortSummary: "Learn JS syntax and data structures.",
        content: "Cover variables, loops, conditions, arrays, and functions.",
        difficulty: "Beginner",
        estimatedReadTime: 15,
        order: 1,
        isActive: true
    },
    {
        id: "topic_js_async",
        categoryId: "cat_javascript",
        title: "Async & Await",
        slug: "async-await",
        shortSummary: "Handle async operations.",
        content: "Promises, async/await, API calls, error handling patterns.",
        difficulty: "Intermediate",
        estimatedReadTime: 14,
        order: 2,
        isActive: true
    },
    {
        id: "topic_js_closures",
        categoryId: "cat_javascript",
        title: "Closures & Scope",
        slug: "closures-scope",
        shortSummary: "Deep dive into JS functions and scope.",
        content: "Understand closures, lexical environments, and hoisting.",
        difficulty: "Intermediate",
        estimatedReadTime: 12,
        order: 3,
        isActive: true
    },
    {
        id: "topic_js_eventloop",
        categoryId: "cat_javascript",
        title: "Event Loop",
        slug: "event-loop",
        shortSummary: "JS concurrency model.",
        content: "Call stack, task queue, microtasks, and event loop behavior.",
        difficulty: "Advanced",
        estimatedReadTime: 18,
        order: 4,
        isActive: true
    },
    {
        id: "topic_js_patterns",
        categoryId: "cat_javascript",
        title: "JS Design Patterns",
        slug: "js-design-patterns",
        shortSummary: "Organize scalable JS code.",
        content: "Observer, module, factory, singleton patterns.",
        difficulty: "Advanced",
        estimatedReadTime: 16,
        order: 5,
        isActive: true
    },

    /* ============================
     REACT (5)
    ============================ */
    {
        id: "topic_react_intro",
        categoryId: "cat_react",
        title: "React Basics",
        slug: "react-basics",
        shortSummary: "Components and JSX intro.",
        content: "Learn components, props, and JSX structure.",
        difficulty: "Beginner",
        estimatedReadTime: 15,
        order: 1,
        isActive: true
    },
    {
        id: "topic_react_state",
        categoryId: "cat_react",
        title: "State & Props",
        slug: "state-props",
        shortSummary: "Data handling in React.",
        content: "useState, props flow, lifting state up.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 2,
        isActive: true
    },
    {
        id: "topic_react_hooks",
        categoryId: "cat_react",
        title: "Hooks",
        slug: "react-hooks",
        shortSummary: "Side effects and lifecycle.",
        content: "useEffect, useRef, custom hooks.",
        difficulty: "Intermediate",
        estimatedReadTime: 16,
        order: 3,
        isActive: true
    },
    {
        id: "topic_react_routing",
        categoryId: "cat_react",
        title: "Routing",
        slug: "react-routing",
        shortSummary: "SPA navigation.",
        content: "React Router concepts: routes, params, layouts.",
        difficulty: "Intermediate",
        estimatedReadTime: 12,
        order: 4,
        isActive: true
    },
    {
        id: "topic_react_optimization",
        categoryId: "cat_react",
        title: "Performance Optimization",
        slug: "react-performance",
        shortSummary: "Speed improvements.",
        content: "Memoization, lazy loading, code splitting.",
        difficulty: "Advanced",
        estimatedReadTime: 18,
        order: 5,
        isActive: true
    },

    /* ============================
     NODE & EXPRESS (5)
    ============================ */
    {
        id: "topic_node_intro",
        categoryId: "cat_node",
        title: "Node Basics",
        slug: "node-basics",
        shortSummary: "Server-side JavaScript intro.",
        content: "Event-driven architecture and core modules.",
        difficulty: "Beginner",
        estimatedReadTime: 14,
        order: 1,
        isActive: true
    },
    {
        id: "topic_express_api",
        categoryId: "cat_node",
        title: "REST APIs with Express",
        slug: "express-apis",
        shortSummary: "Build APIs.",
        content: "Routing, controllers, middleware.",
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        order: 2,
        isActive: true
    },
    {
        id: "topic_auth",
        categoryId: "cat_node",
        title: "Authentication",
        slug: "node-authentication",
        shortSummary: "User login systems.",
        content: "JWT, OAuth, bcrypt.",
        difficulty: "Intermediate",
        estimatedReadTime: 16,
        order: 3,
        isActive: true
    },
    {
        id: "topic_error_handling",
        categoryId: "cat_node",
        title: "Error Handling",
        slug: "api-error-handling",
        shortSummary: "Handle API failures.",
        content: "Async error wrappers and global handlers.",
        difficulty: "Advanced",
        estimatedReadTime: 13,
        order: 4,
        isActive: true
    },
    {
        id: "topic_scaling",
        categoryId: "cat_node",
        title: "API Scaling",
        slug: "api-scaling",
        shortSummary: "Scale Node servers.",
        content: "Load balancing, clustering, caching.",
        difficulty: "Advanced",
        estimatedReadTime: 18,
        order: 5,
        isActive: true
    },

    /* ============================
     DATABASES (5)
    ============================ */
    {
        id: "topic_db_intro",
        categoryId: "cat_database",
        title: "Database Basics",
        slug: "database-basics",
        shortSummary: "SQL vs NoSQL.",
        content: "Introduction to relational and document databases.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 1,
        isActive: true
    },
    {
        id: "topic_mongodb",
        categoryId: "cat_database",
        title: "MongoDB",
        slug: "mongodb-basics",
        shortSummary: "NoSQL database basics.",
        content: "Collections, schemas, queries.",
        difficulty: "Beginner",
        estimatedReadTime: 14,
        order: 2,
        isActive: true
    },
    {
        id: "topic_postgresql",
        categoryId: "cat_database",
        title: "PostgreSQL",
        slug: "postgresql-basics",
        shortSummary: "SQL fundamentals.",
        content: "Tables, joins, indexing.",
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        order: 3,
        isActive: true
    },
    {
        id: "topic_query_optimization",
        categoryId: "cat_database",
        title: "Query Optimization",
        slug: "query-optimization",
        shortSummary: "Speed up DB queries.",
        content: "Indexing strategies & query tuning.",
        difficulty: "Advanced",
        estimatedReadTime: 17,
        order: 4,
        isActive: true
    },
    {
        id: "topic_data_modeling",
        categoryId: "cat_database",
        title: "Data Modeling",
        slug: "data-modeling",
        shortSummary: "Design scalable schemas.",
        content: "Normalization & document modeling.",
        difficulty: "Advanced",
        estimatedReadTime: 16,
        order: 5,
        isActive: true
    },
    /* ============================
 MOBILE DEVELOPMENT (5)
============================ */
    {
        id: "topic_rn_intro",
        categoryId: "cat_mobile",
        title: "React Native Basics",
        slug: "react-native-basics",
        shortSummary: "Build native apps with React.",
        content: "Setup Expo, components, styling & navigation.",
        difficulty: "Beginner",
        estimatedReadTime: 14,
        order: 1,
        isActive: true
    },
    {
        id: "topic_mobile_ui",
        categoryId: "cat_mobile",
        title: "Mobile UI Design",
        slug: "mobile-ui-design",
        shortSummary: "Design smooth mobile experiences.",
        content: "Layouts, gestures, animations.",
        difficulty: "Intermediate",
        estimatedReadTime: 14,
        order: 2,
        isActive: true
    },
    {
        id: "topic_rn_navigation",
        categoryId: "cat_mobile",
        title: "Navigation",
        slug: "react-native-navigation",
        shortSummary: "Multi screen routing.",
        content: "Stacks, tabs and drawer navigation.",
        difficulty: "Intermediate",
        estimatedReadTime: 12,
        order: 3,
        isActive: true
    },
    {
        id: "topic_rn_api",
        categoryId: "cat_mobile",
        title: "API Integration",
        slug: "mobile-api-integration",
        shortSummary: "Consume APIs in apps.",
        content: "Fetch, axios, and auth headers.",
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        order: 4,
        isActive: true
    },
    {
        id: "topic_mobile_build",
        categoryId: "cat_mobile",
        title: "Build & Deployment",
        slug: "mobile-build-deploy",
        shortSummary: "Publish apps.",
        content: "Expo builds, Play Store releases.",
        difficulty: "Advanced",
        estimatedReadTime: 18,
        order: 5,
        isActive: true
    },

    /* ============================
     DEVOPS & CLOUD (5)
    ============================ */
    {
        id: "topic_devops_intro",
        categoryId: "cat_devops",
        title: "DevOps Basics",
        slug: "devops-basics",
        shortSummary: "DevOps philosophy.",
        content: "CI/CD concepts and automation.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 1,
        isActive: true
    },
    {
        id: "topic_docker",
        categoryId: "cat_devops",
        title: "Docker",
        slug: "docker-basics",
        shortSummary: "Containerization.",
        content: "Dockerfile and containers.",
        difficulty: "Intermediate",
        estimatedReadTime: 16,
        order: 2,
        isActive: true
    },
    {
        id: "topic_ci_cd",
        categoryId: "cat_devops",
        title: "CI/CD Pipelines",
        slug: "ci-cd-pipelines",
        shortSummary: "Automated deployment.",
        content: "GitHub Actions & pipelines.",
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        order: 3,
        isActive: true
    },
    {
        id: "topic_cloud_deploy",
        categoryId: "cat_devops",
        title: "Cloud Deployment",
        slug: "cloud-deployment",
        shortSummary: "Host your applications.",
        content: "AWS, Vercel & Firebase.",
        difficulty: "Advanced",
        estimatedReadTime: 18,
        order: 4,
        isActive: true
    },
    {
        id: "topic_monitoring",
        categoryId: "cat_devops",
        title: "Monitoring",
        slug: "application-monitoring",
        shortSummary: "Track uptime.",
        content: "Logs, metrics & alert systems.",
        difficulty: "Advanced",
        estimatedReadTime: 14,
        order: 5,
        isActive: true
    },

    /* ============================
     TESTING & DEBUGGING (5)
    ============================ */
    {
        id: "topic_testing_intro",
        categoryId: "cat_testing",
        title: "Testing Basics",
        slug: "testing-basics",
        shortSummary: "Why testing matters.",
        content: "Manual vs automated testing.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 1,
        isActive: true
    },
    {
        id: "topic_jest",
        categoryId: "cat_testing",
        title: "Jest Unit Testing",
        slug: "jest-unit-testing",
        shortSummary: "Test JS code.",
        content: "Jest syntax & assertions.",
        difficulty: "Intermediate",
        estimatedReadTime: 15,
        order: 2,
        isActive: true
    },
    {
        id: "topic_cypress",
        categoryId: "cat_testing",
        title: "Cypress E2E Testing",
        slug: "cypress-e2e",
        shortSummary: "End-to-end testing.",
        content: "E2E flows for web apps.",
        difficulty: "Intermediate",
        estimatedReadTime: 16,
        order: 3,
        isActive: true
    },
    {
        id: "topic_debugging",
        categoryId: "cat_testing",
        title: "Debugging",
        slug: "debugging-techniques",
        shortSummary: "Find bugs fast.",
        content: "Chrome dev tools & logging.",
        difficulty: "Intermediate",
        estimatedReadTime: 14,
        order: 4,
        isActive: true
    },
    {
        id: "topic_test_strategy",
        categoryId: "cat_testing",
        title: "Test Strategy",
        slug: "testing-strategy",
        shortSummary: "Plan test coverage.",
        content: "Test pyramids and coverage tools.",
        difficulty: "Advanced",
        estimatedReadTime: 17,
        order: 5,
        isActive: true
    },

    /* ============================
     GIT & COLLABORATION (5)
    ============================ */
    {
        id: "topic_git_intro",
        categoryId: "cat_git",
        title: "Git Basics",
        slug: "git-basics",
        shortSummary: "Version control intro.",
        content: "Commits, branches, merges.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 1,
        isActive: true
    },
    {
        id: "topic_github",
        categoryId: "cat_git",
        title: "GitHub Workflow",
        slug: "github-workflow",
        shortSummary: "Team collaboration.",
        content: "PRs & issues.",
        difficulty: "Beginner",
        estimatedReadTime: 12,
        order: 2,
        isActive: true
    },
    {
        id: "topic_branching",
        categoryId: "cat_git",
        title: "Branching Strategies",
        slug: "git-branching",
        shortSummary: "Manage code changes.",
        content: "Git flow and trunk based dev.",
        difficulty: "Intermediate",
        estimatedReadTime: 13,
        order: 3,
        isActive: true
    },
    {
        id: "topic_resolving_conflict",
        categoryId: "cat_git",
        title: "Merge Conflicts",
        slug: "merge-conflicts",
        shortSummary: "Fix conflicts safely.",
        content: "Manual conflict resolving.",
        difficulty: "Intermediate",
        estimatedReadTime: 14,
        order: 4,
        isActive: true
    },
    {
        id: "topic_release",
        categoryId: "cat_git",
        title: "Release Management",
        slug: "release-management",
        shortSummary: "Tagging & deployments.",
        content: "Semantic versioning & tagging.",
        difficulty: "Advanced",
        estimatedReadTime: 15,
        order: 5,
        isActive: true
    }
];

const MCQS: SeedMCQ[] = [
    /* ---------------- HTML ---------------- */
    {
        id: "mcq_html_1",
        topicId: "topic_html_basics",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<heading>", "<h1>", "<h6>", "<head>"],
        correctAnswer: "<h1>",
        explanation: "<h1> defines the most important and largest heading.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_html_2",
        topicId: "topic_html_basics",
        question: "Which tag is used to create a hyperlink?",
        options: ["<a>", "<link>", "<url>", "<href>"],
        correctAnswer: "<a>",
        explanation: "The <a> tag creates hyperlinks in HTML.",
        difficulty: "Beginner"
    },

    /* ---------------- CSS ---------------- */
    {
        id: "mcq_css_1",
        topicId: "topic_css_basics",
        question: "Which property is used to change text color?",
        options: ["font-color", "text-color", "color", "bgcolor"],
        correctAnswer: "color",
        explanation: "CSS color property changes text color.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_css_2",
        topicId: "topic_css_basics",
        question: "Which CSS layout system is best for 1D layout?",
        options: ["Grid", "Flexbox", "Float", "Box Model"],
        correctAnswer: "Flexbox",
        explanation: "Flexbox specializes in one-direction layouts.",
        difficulty: "Intermediate"
    },

    /* ---------------- Responsive ---------------- */
    {
        id: "mcq_responsive_1",
        topicId: "topic_responsive_ui",
        question: "What does media query do?",
        options: [
            "Change device type",
            "Apply CSS based on screen size",
            "Resize images",
            "Handle user input"
        ],
        correctAnswer: "Apply CSS based on screen size",
        explanation: "Media queries adapt layout to screen size.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_responsive_2",
        topicId: "topic_responsive_ui",
        question: "Which unit is best for responsive font sizing?",
        options: ["px", "em", "rem", "%"],
        correctAnswer: "rem",
        explanation: "rem scales relative to root font size.",
        difficulty: "Intermediate"
    },

    /* ---------------- Tailwind ---------------- */
    {
        id: "mcq_tailwind_1",
        topicId: "topic_tailwind",
        question: "What type of framework is Tailwind?",
        options: ["Component-based", "Utility-first", "CSS-in-JS", "Bootstrap fork"],
        correctAnswer: "Utility-first",
        explanation: "Tailwind uses utility classes approach.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_tailwind_2",
        topicId: "topic_tailwind",
        question: "Which class centers content horizontally?",
        options: ["text-center", "items-center", "justify-center", "mx-auto"],
        correctAnswer: "mx-auto",
        explanation: "mx-auto centers block elements.",
        difficulty: "Intermediate"
    },

    /* ---------------- Accessibility ---------------- */
    {
        id: "mcq_a11y_1",
        topicId: "topic_ui_accessibility",
        question: "What is ARIA used for?",
        options: [
            "Animations",
            "Accessibility roles",
            "Layouts",
            "Images"
        ],
        correctAnswer: "Accessibility roles",
        explanation: "ARIA improves accessibility for screen readers.",
        difficulty: "Advanced"
    },
    {
        id: "mcq_a11y_2",
        topicId: "topic_ui_accessibility",
        question: "Which contrast is recommended?",
        options: ["2:1", "3:1", "4.5:1", "10:1"],
        correctAnswer: "4.5:1",
        explanation: "WCAG recommends 4.5:1 contrast ratio.",
        difficulty: "Advanced"
    },

    /* ---------------- JavaScript ---------------- */
    {
        id: "mcq_js_1",
        topicId: "topic_js_basics",
        question: "Which keyword declares a constant?",
        options: ["var", "let", "const", "define"],
        correctAnswer: "const",
        explanation: "const prevents reassignment.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_js_2",
        topicId: "topic_js_basics",
        question: "What does typeof null return?",
        options: ["null", "object", "undefined", "number"],
        correctAnswer: "object",
        explanation: "JavaScript bug — typeof null is object.",
        difficulty: "Intermediate"
    },

    /* ---------------- Async ---------------- */
    {
        id: "mcq_async_1",
        topicId: "topic_js_async",
        question: "Which keyword waits for Promise?",
        options: ["resolve", "wait", "await", "then"],
        correctAnswer: "await",
        explanation: "await pauses execution until Promise resolves.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_async_2",
        topicId: "topic_js_async",
        question: "Promise.all fails when:",
        options: [
            "Any promise fails",
            "All finish",
            "Only first resolves",
            "Timeout occurs"
        ],
        correctAnswer: "Any promise fails",
        explanation: "Promise.all rejects if any promise fails.",
        difficulty: "Advanced"
    },

    /* ---------------- Closures ---------------- */
    {
        id: "mcq_closure_1",
        topicId: "topic_js_closures",
        question: "What is closure?",
        options: [
            "A loop type",
            "Function with memory",
            "Callback",
            "Async handler"
        ],
        correctAnswer: "Function with memory",
        explanation: "Closure remembers outer scope variables.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_closure_2",
        topicId: "topic_js_closures",
        question: "Which enables closure?",
        options: ["Scope", "Lexical environment", "Event loop", "Hoisting"],
        correctAnswer: "Lexical environment",
        explanation: "Closures depend on lexical scoping.",
        difficulty: "Advanced"
    },
    /* ---------------- REACT ---------------- */
    {
        id: "mcq_react_1",
        topicId: "topic_react_intro",
        question: "What is JSX?",
        options: [
            "JavaScript XML",
            "Template engine",
            "HTML file",
            "CSS framework"
        ],
        correctAnswer: "JavaScript XML",
        explanation: "JSX allows writing HTML-like syntax inside JavaScript.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_react_2",
        topicId: "topic_react_intro",
        question: "Which function renders components?",
        options: ["render()", "ReactDOM.render()", "mount()", "show()"],
        correctAnswer: "ReactDOM.render()",
        explanation: "ReactDOM.render mounts component to DOM.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_state_1",
        topicId: "topic_react_state",
        question: "State is used to:",
        options: [
            "Store static data",
            "Pass data to parent",
            "Handle dynamic data",
            "Initialize CSS"
        ],
        correctAnswer: "Handle dynamic data",
        explanation: "State manages component-changing data.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_state_2",
        topicId: "topic_react_state",
        question: "Props are:",
        options: [
            "Mutable",
            "Read only",
            "Async",
            "Private variables"
        ],
        correctAnswer: "Read only",
        explanation: "Props are immutable.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_hooks_1",
        topicId: "topic_react_hooks",
        question: "Which hook handles lifecycle effects?",
        options: [
            "useState",
            "useReducer",
            "useEffect",
            "useContext"
        ],
        correctAnswer: "useEffect",
        explanation: "useEffect replaces lifecycle methods.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_hooks_2",
        topicId: "topic_react_hooks",
        question: "Custom hooks must start with:",
        options: ["hook", "create", "use", "React"],
        correctAnswer: "use",
        explanation: "React enforces naming convention.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_router_1",
        topicId: "topic_react_routing",
        question: "Which library is used for routing?",
        options: [
            "Redux",
            "Next.js",
            "React Router",
            "Axios"
        ],
        correctAnswer: "React Router",
        explanation: "React Router handles SPA navigation.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_router_2",
        topicId: "topic_react_routing",
        question: "Which hook reads route params?",
        options: [
            "useParams",
            "useRoute",
            "useRouter",
            "useLocation"
        ],
        correctAnswer: "useParams",
        explanation: "useParams returns dynamic route values.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_perf_1",
        topicId: "topic_react_optimization",
        question: "What does React.memo do?",
        options: [
            "Memoize state",
            "Skip re-renders",
            "Cache API calls",
            "Optimize CSS"
        ],
        correctAnswer: "Skip re-renders",
        explanation: "Memo avoids unnecessary renders on same props.",
        difficulty: "Advanced"
    },
    {
        id: "mcq_perf_2",
        topicId: "topic_react_optimization",
        question: "Which enables code-splitting?",
        options: [
            "useCallback",
            "Suspense",
            "lazy()",
            "Profiler"
        ],
        correctAnswer: "lazy()",
        explanation: "React.lazy loads components on demand.",
        difficulty: "Advanced"
    },

    /* ---------------- NODE ---------------- */
    {
        id: "mcq_node_1",
        topicId: "topic_node_intro",
        question: "Node.js is:",
        options: [
            "Framework",
            "Runtime",
            "Language",
            "Compiler"
        ],
        correctAnswer: "Runtime",
        explanation: "Node.js runs JS outside browser.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_node_2",
        topicId: "topic_node_intro",
        question: "Which handles async events?",
        options: [
            "Thread pool",
            "Event loop",
            "DOM",
            "Callbacks"
        ],
        correctAnswer: "Event loop",
        explanation: "Event loop manages concurrency.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_api_1",
        topicId: "topic_express_api",
        question: "Express middleware is:",
        options: [
            "Route only",
            "Function chain",
            "API key",
            "Async hook"
        ],
        correctAnswer: "Function chain",
        explanation: "Middleware runs sequentially.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_api_2",
        topicId: "topic_express_api",
        question: "Which method fetches data?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "GET",
        explanation: "GET retrieves server data.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_auth_1",
        topicId: "topic_auth",
        question: "JWT stands for:",
        options: [
            "Java Web Token",
            "JSON Web Token",
            "JavaScript Web Tool",
            "JSON Workflow Token"
        ],
        correctAnswer: "JSON Web Token",
        explanation: "JWT secures APIs with tokens.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_auth_2",
        topicId: "topic_auth",
        question: "bcrypt is used for:",
        options: [
            "JWT signing",
            "Encryption",
            "Hashing passwords",
            "Compression"
        ],
        correctAnswer: "Hashing passwords",
        explanation: "bcrypt hashes passwords securely.",
        difficulty: "Intermediate"
    },

    /* ---------------- DATABASE ---------------- */
    {
        id: "mcq_db_1",
        topicId: "topic_db_intro",
        question: "SQL databases are:",
        options: [
            "Schema-less",
            "Table based",
            "Document based",
            "Graph based"
        ],
        correctAnswer: "Table based",
        explanation: "SQL data is structured in tables.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_db_2",
        topicId: "topic_db_intro",
        question: "NoSQL is best for:",
        options: [
            "Static data",
            "Unstructured data",
            "Financial records",
            "Transactions"
        ],
        correctAnswer: "Unstructured data",
        explanation: "NoSQL handles dynamic data models well.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_mongo_1",
        topicId: "topic_mongodb",
        question: "MongoDB uses:",
        options: [
            "Tables",
            "Rows",
            "Documents",
            "Schemas"
        ],
        correctAnswer: "Documents",
        explanation: "Mongo stores JSON-like docs.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_mongo_2",
        topicId: "topic_mongodb",
        question: "Which method inserts data?",
        options: ["add()", "insertOne()", "push()", "saveAll()"],
        correctAnswer: "insertOne()",
        explanation: "insertOne creates documents.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_sql_1",
        topicId: "topic_postgresql",
        question: "Which joins return matched rows?",
        options: [
            "LEFT JOIN",
            "RIGHT JOIN",
            "INNER JOIN",
            "FULL JOIN"
        ],
        correctAnswer: "INNER JOIN",
        explanation: "INNER JOIN matches rows from both tables.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_sql_2",
        topicId: "topic_postgresql",
        question: "Indexing improves:",
        options: [
            "Insert speed",
            "Query performance",
            "Security",
            "Storage"
        ],
        correctAnswer: "Query performance",
        explanation: "Indexes speed up lookups.",
        difficulty: "Intermediate"
    },

    /* ---------------- MOBILE ---------------- */
    {
        id: "mcq_rn_1",
        topicId: "topic_rn_intro",
        question: "What is Expo?",
        options: [
            "Database",
            "Toolchain",
            "Framework",
            "IDE"
        ],
        correctAnswer: "Toolchain",
        explanation: "Expo simplifies RN development.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_rn_2",
        topicId: "topic_rn_intro",
        question: "Which is not RN core component?",
        options: [
            "View",
            "Text",
            "Button",
            "Div"
        ],
        correctAnswer: "Div",
        explanation: "Div exists only in HTML.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_mobile_api_1",
        topicId: "topic_rn_api",
        question: "API calls use:",
        options: [
            "Redux",
            "Axios",
            "React Router",
            "Graph"
        ],
        correctAnswer: "Axios",
        explanation: "Axios handles HTTP requests.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_mobile_api_2",
        topicId: "topic_rn_api",
        question: "Bearer token used for:",
        options: [
            "UI state",
            "Auth headers",
            "Encryption",
            "Caching"
        ],
        correctAnswer: "Auth headers",
        explanation: "Bearer token used for authentication.",
        difficulty: "Intermediate"
    },
    /* ================= DEVOPS ================= */
    {
        id: "mcq_devops_1",
        topicId: "topic_devops_intro",
        question: "DevOps mainly focuses on:",
        options: [
            "Only development",
            "Only operations",
            "Collaboration between dev & ops",
            "Cloud hosting"
        ],
        correctAnswer: "Collaboration between dev & ops",
        explanation: "DevOps unifies dev and ops teams for faster delivery.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_devops_2",
        topicId: "topic_devops_intro",
        question: "CI stands for:",
        options: [
            "Continuous Integration",
            "Cloud Infrastructure",
            "Continuous Improvement",
            "Code Inspection"
        ],
        correctAnswer: "Continuous Integration",
        explanation: "CI automates building and testing.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_docker_1",
        topicId: "topic_docker",
        question: "Docker is used to:",
        options: [
            "Write code",
            "Deploy containers",
            "Design UI",
            "Test APIs"
        ],
        correctAnswer: "Deploy containers",
        explanation: "Docker packages applications into containers.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_docker_2",
        topicId: "topic_docker",
        question: "Dockerfile contains:",
        options: [
            "Server code",
            "Build steps",
            "Database schema",
            "Routing info"
        ],
        correctAnswer: "Build steps",
        explanation: "Dockerfile defines container build instructions.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_ci_cd_1",
        topicId: "topic_ci_cd",
        question: "CI/CD pipelines automate:",
        options: [
            "Coding",
            "Design",
            "Testing & Deployment",
            "Monitoring"
        ],
        correctAnswer: "Testing & Deployment",
        explanation: "CI/CD automates testing + releases.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_ci_cd_2",
        topicId: "topic_ci_cd",
        question: "GitHub Actions is a:",
        options: [
            "Hosting platform",
            "CI/CD tool",
            "Code editor",
            "Testing library"
        ],
        correctAnswer: "CI/CD tool",
        explanation: "GitHub Actions handles workflows.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_cloud_1",
        topicId: "topic_cloud_deploy",
        question: "Which is NOT a cloud provider?",
        options: ["AWS", "Azure", "Firebase", "React"],
        correctAnswer: "React",
        explanation: "React is a front-end library.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_cloud_2",
        topicId: "topic_cloud_deploy",
        question: "Vercel is best suited for:",
        options: [
            "DB hosting",
            "Static and frontend apps",
            "Docker management",
            "Auth servers"
        ],
        correctAnswer: "Static and frontend apps",
        explanation: "Vercel serves frontend frameworks.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_monitor_1",
        topicId: "topic_monitoring",
        question: "Monitoring checks:",
        options: [
            "Code quality",
            "App uptime & logs",
            "CSS styles",
            "API routing"
        ],
        correctAnswer: "App uptime & logs",
        explanation: "Monitoring tools track health.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_monitor_2",
        topicId: "topic_monitoring",
        question: "Alerts trigger on:",
        options: [
            "Build failure",
            "Downtime & errors",
            "Slow typing",
            "PR merge"
        ],
        correctAnswer: "Downtime & errors",
        explanation: "Alerts notify dev teams.",
        difficulty: "Advanced"
    },

    /* ================= TESTING ================= */
    {
        id: "mcq_test_1",
        topicId: "topic_testing_intro",
        question: "Unit testing validates:",
        options: [
            "Whole app",
            "Single function",
            "UI flows",
            "User sessions"
        ],
        correctAnswer: "Single function",
        explanation: "Unit tests verify small isolated units.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_test_2",
        topicId: "topic_testing_intro",
        question: "Automated testing saves:",
        options: [
            "Memory",
            "Time",
            "Servers",
            "Bandwidth"
        ],
        correctAnswer: "Time",
        explanation: "Automation reduces manual effort.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_jest_1",
        topicId: "topic_jest",
        question: "Which assertion library comes with Jest?",
        options: ["Chai", "Expect", "AVA", "Testify"],
        correctAnswer: "Expect",
        explanation: "Jest bundies expect() assertions.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_jest_2",
        topicId: "topic_jest",
        question: "Which is mock function?",
        options: [
            "jest.mock()",
            "mock()",
            "shadow()",
            "stub()"
        ],
        correctAnswer: "jest.mock()",
        explanation: "Mocks external dependencies.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_cypress_1",
        topicId: "topic_cypress",
        question: "Cypress is used for:",
        options: [
            "Unit testing",
            "Load testing",
            "E2E testing",
            "Debugging"
        ],
        correctAnswer: "E2E testing",
        explanation: "Cypress tests real user flows.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_cypress_2",
        topicId: "topic_cypress",
        question: "Which command selects DOM element?",
        options: [
            "cy.pick()",
            "cy.select()",
            "cy.get()",
            "cy.findDOM()"
        ],
        correctAnswer: "cy.get()",
        explanation: "cy.get queries DOM nodes.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_debug_1",
        topicId: "topic_debugging",
        question: "console.log is used for:",
        options: [
            "Testing",
            "Debugging",
            "Performance",
            "Deployment"
        ],
        correctAnswer: "Debugging",
        explanation: "Helps inspect values at runtime.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_debug_2",
        topicId: "topic_debugging",
        question: "Breakpoints pause:",
        options: [
            "Execution",
            "Monitoring",
            "Compilation",
            "Deployment"
        ],
        correctAnswer: "Execution",
        explanation: "Breakpoints halt execution to inspect state.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_strategy_1",
        topicId: "topic_test_strategy",
        question: "Testing pyramid emphasizes:",
        options: [
            "More E2E",
            "More unit tests",
            "More manual tests",
            "No testing"
        ],
        correctAnswer: "More unit tests",
        explanation: "Unit tests form base of pyramid.",
        difficulty: "Advanced"
    },
    {
        id: "mcq_strategy_2",
        topicId: "topic_test_strategy",
        question: "Coverage measures:",
        options: [
            "User traffic",
            "Server cost",
            "Tested code %",
            "Security"
        ],
        correctAnswer: "Tested code %",
        explanation: "Coverage shows how much code is tested.",
        difficulty: "Advanced"
    },

    /* ================= GIT ================= */
    {
        id: "mcq_git_1",
        topicId: "topic_git_intro",
        question: "git init does:",
        options: [
            "Clone repo",
            "Create repo",
            "Push code",
            "Install git"
        ],
        correctAnswer: "Create repo",
        explanation: "Initializes a new git repo.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_git_2",
        topicId: "topic_git_intro",
        question: "Which commits changes?",
        options: [
            "git save",
            "git push",
            "git commit",
            "git send"
        ],
        correctAnswer: "git commit",
        explanation: "git commit saves snapshot.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_gh_1",
        topicId: "topic_github",
        question: "Pull request is used to:",
        options: [
            "Create repo",
            "Deploy app",
            "Merge code",
            "Install packages"
        ],
        correctAnswer: "Merge code",
        explanation: "PR merges changes safely.",
        difficulty: "Beginner"
    },
    {
        id: "mcq_gh_2",
        topicId: "topic_github",
        question: "Issues are used for:",
        options: [
            "Tracking bugs & tasks",
            "Code writing",
            "Deployments",
            "Branching"
        ],
        correctAnswer: "Tracking bugs & tasks",
        explanation: "Issues manage work items.",
        difficulty: "Beginner"
    },

    {
        id: "mcq_branch_1",
        topicId: "topic_branching",
        question: "Main concept of branching:",
        options: [
            "History deletion",
            "Parallel development",
            "Merging code",
            "Tagging release"
        ],
        correctAnswer: "Parallel development",
        explanation: "Branches allow safe parallel work.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_branch_2",
        topicId: "topic_branching",
        question: "git checkout is used for:",
        options: [
            "Delete branch",
            "Switch branches",
            "Commit code",
            "Push repo"
        ],
        correctAnswer: "Switch branches",
        explanation: "Changes active branch.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_conflict_1",
        topicId: "topic_resolving_conflict",
        question: "Merge conflicts happen when:",
        options: [
            "Branches change same code",
            "Repo is large",
            "Pushing force",
            "Incorrect password"
        ],
        correctAnswer: "Branches change same code",
        explanation: "Conflicts happen when edits overlap.",
        difficulty: "Intermediate"
    },
    {
        id: "mcq_conflict_2",
        topicId: "topic_resolving_conflict",
        question: "Conflict resolved by:",
        options: [
            "Deleting files",
            "Manual editing",
            "Reinstalling git",
            "Force pulling"
        ],
        correctAnswer: "Manual editing",
        explanation: "Conflicting marks must be edited manually.",
        difficulty: "Intermediate"
    },

    {
        id: "mcq_release_1",
        topicId: "topic_release",
        question: "Semantic version format:",
        options: [
            "v1",
            "v1.2",
            "v1.2.3",
            "version1.2"
        ],
        correctAnswer: "v1.2.3",
        explanation: "Major.Minor.Patch",
        difficulty: "Advanced"
    },
    {
        id: "mcq_release_2",
        topicId: "topic_release",
        question: "Git tags mark:",
        options: [
            "Branches",
            "Commits",
            "PRs",
            "Releases"
        ],
        correctAnswer: "Releases",
        explanation: "Tags mark milestones/releases.",
        difficulty: "Advanced"
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
        // try {
        //     const testRef = doc(collection(db, 'connection_test'));
        //     await Promise.race([
        //         // just a dummy write
        //         // @ts-ignore
        //         require('firebase/firestore').setDoc(testRef, { status: 'ok', time: new Date() }),
        //         new Promise((_, reject) => setTimeout(() => reject(new Error('Connectivity Test Timeout')), 5000))
        //     ]);
        // } catch (e) {
        //     console.error("Connectivity check failed:", e);
        //     throw e;
        // }

        const batch = writeBatch(db);
        let count = 0;



        // 2. Seed Categories

        // CATEGORIES.forEach(cat => {
        //     const ref = doc(db, 'categories', cat.id);
        //     // Map 'title' to 'name' if existing app uses 'name'
        //     batch.set(ref, { ...cat, name: cat.title });
        //     count++;
        // });

        // 3. Seed Topics
        // TOPICS.forEach(topic => {
        //     const ref = doc(db, 'topics', topic.id);
        //     batch.set(ref, topic);
        //     count++;
        // });

        // 4. Seed MCQs
        // MCQS.forEach(mcq => {
        //     const ref = doc(db, 'mcqs', mcq.id);
        //     batch.set(ref, mcq);
        //     count++;
        // });

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
