import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCeK6Zfn-d1bn7sBY7UMSuUtPA849NTEqQ",
    authDomain: "react-native-app-909c5.firebaseapp.com",
    projectId: "react-native-app-909c5",
    storageBucket: "react-native-app-909c5.firebasestorage.app",
    messagingSenderId: "415281564190",
    appId: "1:415281564190:web:a2295f814b2277abf13c0f",
    measurementId: "G-J0LY5C81GG"
};

import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);

    if (Platform.OS === 'web') {
        auth = getAuth(app);
    } else {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    }
} else {
    app = getApp();
    auth = getAuth(app);
}

db = getFirestore(app);

export { auth, db };
