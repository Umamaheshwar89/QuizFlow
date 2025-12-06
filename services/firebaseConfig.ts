import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-ignore
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCDK5p27p0PvVLAThNkP__oE0dmtb9Ryd0",
    authDomain: "react-native-app-58d0e.firebaseapp.com",
    projectId: "react-native-app-58d0e",
    storageBucket: "react-native-app-58d0e.firebasestorage.app",
    messagingSenderId: "769611697598",
    appId: "1:769611697598:web:140664135b3e73ec0b3def",
    measurementId: "G-VLCNE5GB8M"
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
