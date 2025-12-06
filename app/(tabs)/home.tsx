import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { Zap, Trophy, Target, ChevronRight, CloudCog } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useCategories } from '../../hooks/useCategories';
import CustomLoader from '../../components/CustomLoader';
import { seedDatabase } from '../../utils/seedFirestore';

export default function Home() {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile();
    const { categories, loading: categoriesLoading } = useCategories();
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate a network request or allow hooks to update if they were poll-based.
        // Since we use onSnapshot, data is already fresh, but this gives the user feedback.
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    }, []);

    const [timeToNextDaily, setTimeToNextDaily] = useState<string>('');
    const [isDailyDone, setIsDailyDone] = useState(false);

    // Check Daily Quiz Status
    useEffect(() => {
        if (profile?.lastDailyQuizDate) {
            const today = new Date().toISOString().split('T')[0];
            if (profile.lastDailyQuizDate === today) {
                setIsDailyDone(true);
            } else {
                setIsDailyDone(false);
            }
        }
    }, [profile]);

    // Timer Logic
    useEffect(() => {
        if (!isDailyDone) return;

        const updateTimer = () => {
            const now = new Date();
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);

            const diff = tomorrow.getTime() - now.getTime();

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeToNextDaily(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateTimer(); // Initial call
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [isDailyDone]);

    const handleCategoryPress = (category: any) => {
        router.push({ pathname: '/topics/[categoryId]', params: { categoryId: category.id, title: category.name } })
    }

    const handleDailyQuiz = () => {
        if (isDailyDone) {
            // Optional: Show alert
            return;
        }
        router.push({ pathname: '/quiz/daily' });
    };

    if (profileLoading || categoriesLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <CustomLoader text="Loading your dashboard..." />
            </SafeAreaView>
        );
    }

    // ... (rest of render)

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#845ec2', '#d65db1']} // Android
                        tintColor="#845ec2" // iOS
                        title="Reloading..." // iOS
                        titleColor="#845ec2"
                    />
                }
            >

                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(800)} style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello,</Text>
                        <Text style={styles.username}>{profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Learner'}</Text>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>{profile?.displayName?.[0] || user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</Text>
                    </View>
                </Animated.View>

                {/* Stats Cards */}
                <Animated.View entering={FadeInDown.delay(200).duration(800)} style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e0f7fa' }]}>
                            <Zap size={24} color="#00bcd4" />
                        </View>
                        <Text style={styles.statValue}>{profile?.streak || 0}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={[styles.iconBox, { backgroundColor: '#e1bee7' }]}>
                            <Trophy size={24} color="#9c27b0" />
                        </View>
                        <Text style={styles.statValue}>{profile?.xp || 0}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>
                </Animated.View>

                {/* Daily Challenge */}
                <Animated.View entering={FadeInDown.delay(300).duration(800)}>
                    <TouchableOpacity onPress={handleDailyQuiz} activeOpacity={isDailyDone ? 1 : 0.9} disabled={isDailyDone}>
                        <LinearGradient
                            colors={isDailyDone ? ['#cfd9df', '#e2ebf0'] : ['#845ec2', '#d65db1']}
                            style={styles.dailyCard}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View>
                                <Text style={[styles.dailyTitle, isDailyDone && { color: '#555' }]}>
                                    {isDailyDone ? 'Challenge Completed' : 'Daily Challenge'}
                                </Text>
                                <Text style={[styles.dailySubtitle, isDailyDone && { color: '#777' }]}>
                                    {isDailyDone ? 'Come back tomorrow for more!' : 'Win 50 XP • 10 Questions'}
                                </Text>
                                <View style={[styles.startButton, isDailyDone && { backgroundColor: 'rgba(0,0,0,0.1)' }]}>
                                    {isDailyDone ? (
                                        <Text style={[styles.startText, { color: '#555' }]}>Next in: {timeToNextDaily}</Text>
                                    ) : (
                                        <>
                                            <Text style={styles.startText}>Start Now</Text>
                                            <ChevronRight color="white" size={16} />
                                        </>
                                    )}
                                </View>
                            </View>
                            <Target color={isDailyDone ? "#999" : "white"} size={60} style={{ opacity: 0.8 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>

                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Browse Categories</Text>
                </View>

                <View style={styles.categoriesGrid}>
                    {categories.map((cat, index) => (
                        <Animated.View
                            key={cat.id}
                            entering={FadeInDown.delay(400 + (index * 100)).duration(800)}
                            style={styles.categoryWrapper}
                        >
                            <TouchableOpacity onPress={() => handleCategoryPress(cat)} activeOpacity={0.8} style={styles.categoryCard}>
                                <LinearGradient colors={cat.color as any || ['#ccc', '#999']} style={styles.categoryGradient}>
                                    <Text style={{ fontSize: 32 }}>{cat.icon}</Text>
                                    <Text style={styles.categoryName}>{cat.name}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    greeting: {
        fontSize: 16,
        color: '#666',
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 15,
        marginHorizontal: 5,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
    },
    dailyCard: {
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: "#845ec2",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    dailyTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    dailySubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginTop: 5,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    startText: {
        color: 'white',
        fontWeight: '600',
        marginRight: 5,
    },
    sectionHeader: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryWrapper: {
        width: '48%',
        marginBottom: 15,
    },
    categoryCard: {
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    categoryName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    }
});
