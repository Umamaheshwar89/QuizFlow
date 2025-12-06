
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Target, Zap, Trophy, PieChart } from 'lucide-react-native';
import { useUserProfile } from '../../hooks/useUserProfile';
import CustomLoader from '../../components/CustomLoader';
import UIButton from '../../components/UIButton';
import { LinearGradient } from 'expo-linear-gradient';

export default function UserStats() {
    const router = useRouter();
    const { profile, loading } = useUserProfile();

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Crunching the numbers..." />
            </SafeAreaView>
        );
    }

    // Real data from UserProfile
    const totalQuizzes = profile?.quizAttempts || 0;
    const totalXP = profile?.xp || 0;
    const accuracy = profile?.accuracy || 0;
    const streak = profile?.streak || 0;
    const level = profile?.level || 1;
    const topicsCompleted = profile?.topicsCompleted || 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                    activeOpacity={0.8}
                >
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Statistics</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Main Accuracy Card */}
                <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.mainCard}>
                    <View style={styles.accuracyCircle}>
                        <Text style={styles.accuracyText}>{accuracy}%</Text>
                        <Text style={styles.accuracyLabel}>Accuracy</Text>
                    </View>
                    <View style={styles.mainInfo}>
                        <Text style={styles.mainTitle}>Level {level}</Text>
                        <Text style={styles.mainSubtitle}>
                            {accuracy > 80 ? "You're a master!" : accuracy > 50 ? "Good progress!" : "Keep practicing!"}
                        </Text>
                    </View>
                </LinearGradient>

                {/* Grid Stats */}
                <View style={styles.grid}>
                    <View style={styles.statBox}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f7fa' }]}>
                            <Target size={24} color="#00bcd4" />
                        </View>
                        <Text style={styles.statValue}>{totalQuizzes}</Text>
                        <Text style={styles.statLabel}>Quizzes Taken</Text>
                    </View>

                    <View style={styles.statBox}>
                        <View style={[styles.iconBox, { backgroundColor: '#fff3e0' }]}>
                            <Zap size={24} color="#ff9800" />
                        </View>
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>Current Streak</Text>
                    </View>

                    <View style={styles.statBox}>
                        <View style={[styles.iconBox, { backgroundColor: '#f3e5f5' }]}>
                            <Trophy size={24} color="#9c27b0" />
                        </View>
                        <Text style={styles.statValue}>{totalXP}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>

                    <View style={styles.statBox}>
                        <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}>
                            <PieChart size={24} color="#4caf50" />
                        </View>
                        <Text style={styles.statValue}>{topicsCompleted}</Text>
                        <Text style={styles.statLabel}>Topics Done</Text>
                    </View>
                </View>

                {/* Category Breakdown Placeholder - To be implemented with user_category_progress */}
                <View style={styles.categoryRow}>
                    <Text style={{ color: '#666', textAlign: 'center', flex: 1 }}>
                        Detailed category analytics coming soon!
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    content: {
        padding: 20,
    },
    mainCard: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    accuracyCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        marginRight: 20,
    },
    accuracyText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    accuracyLabel: {
        color: 'white',
        fontSize: 10,
    },
    mainInfo: {
        flex: 1,
    },
    mainTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    mainSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statBox: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconBox: {
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        textTransform: 'uppercase',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
    },
    catName: {
        width: 100,
        fontWeight: '600',
        color: '#333',
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginHorizontal: 15,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    catPercent: {
        width: 40,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'right',
    },
});
