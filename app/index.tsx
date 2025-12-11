import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { View, StyleSheet, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import CustomLoader from '../components/CustomLoader';

export default function Index() {
    const { user, loading: authLoading } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        const checkUserStatus = async () => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData.hasOnboarded === false) {
                            setNeedsOnboarding(true);
                        } else {
                            setNeedsOnboarding(false);
                        }
                    } else {
                        setNeedsOnboarding(false);
                    }
                } catch (e) {
                    console.error("Error checking user status", e);
                }
            }
            setIsReady(true);
        };

        checkUserStatus();
    }, [user, authLoading]);

    if (authLoading || (!isReady && user)) {
        return (
            <View style={styles.container}>
                <CustomLoader text="Loading..." color="#4c669f" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    if (needsOnboarding) {
        return <Redirect href="/onboarding" />;
    }

    return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
