import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, updateDoc, increment, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { calculateLevel } from '../../utils/leveling';
import { useAuth } from '../../context/AuthContext';
import UIButton from '../../components/UIButton';
import { Trophy, Home } from 'lucide-react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

export default function ResultScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const score = Number(params.score);
    const total = Number(params.total);
    const xp = Number(params.xp);
    const percentage = (score / total) * 100;

    const hasUpdated = React.useRef(false);

    useEffect(() => {
        if (user && !hasUpdated.current) {
            hasUpdated.current = true;
            updateStats();
        }
    }, [user]);

    const updateStats = async () => {
        try {
            const isDaily = params.isDaily === 'true';
            const userRef = doc(db, 'users', user!.uid);


            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                console.error("User doc not found");
                return;
            }

            const currentData = userDoc.data();
            const currentXP = currentData.xp || 0;
            const currentLevel = currentData.level || 1;

            const newXP = currentXP + xp;
            const newLevel = calculateLevel(newXP);

            const updates: any = {
                xp: newXP,
                level: newLevel,
                quizAttempts: increment(1),
                lastActiveAt: new Date().toISOString()
            };

            if (isDaily) {
                updates.streak = increment(1);
            }

            await setDoc(userRef, updates, { merge: true });

            if (newLevel > currentLevel) {



            }

        } catch (e) {
            console.error("Failed to update stats", e);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Animated.View entering={ZoomIn.duration(1000)} style={styles.trophyContainer}>
                    <Trophy size={100} color={percentage > 50 ? "#FFD700" : "#C0C0C0"} />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(500)} style={styles.textContainer}>
                    <Text style={styles.congratsText}>{percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}</Text>
                    <Text style={styles.scoreText}>{score} / {total}</Text>
                    <Text style={styles.xpText}>+{xp} XP Earned</Text>
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(1000)} style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Accuracy</Text>
                        <Text style={styles.statValue}>{percentage.toFixed(0)}%</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Questions</Text>
                        <Text style={styles.statValue}>{total}</Text>
                    </View>
                </Animated.View>
            </View>

            <View style={styles.footer}>
                <UIButton title="Back to Home" onPress={() => router.navigate('/(tabs)/home')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    trophyContainer: {
        marginBottom: 30,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    congratsText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#4c669f',
        marginBottom: 5,
    },
    xpText: {
        fontSize: 18,
        color: '#FFD700',
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
        borderRadius: 16,
        width: '40%',
    },
    statLabel: {
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    footer: {
        padding: 20,
    },
});
