
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Award, Star, Flame, Trophy } from 'lucide-react-native';
import { useUserProfile } from '../../hooks/useUserProfile';
import CustomLoader from '../../components/CustomLoader';
import UIButton from '../../components/UIButton';
import { LinearGradient } from 'expo-linear-gradient';
import { useAchievements } from '../../hooks/useAchievements';
import { SvgXml } from 'react-native-svg';

interface Badge {
    id: string;
    title: string;
    description: string;
    icon?: any;
    iconSVG?: string;
    color?: string[];
    badgeType?: string;
    rewardXP: number;
    condition: {
        type: string;
        count: number;
    };
}

const BadgeItem = React.memo(({ badge, unlocked }: { badge: Badge, unlocked: boolean }) => {

    let colors = ['#e0e0e0', '#bdbdbd'];
    if (unlocked) {
        if (badge.badgeType === 'gold') colors = ['#FFD700', '#FFA500'];
        else if (badge.badgeType === 'silver') colors = ['#C0C0C0', '#E5E4E2'];
        else if (badge.badgeType === 'bronze') colors = ['#CD7F32', '#8B4513'];
        else colors = ['#845ec2', '#d65db1'];
    }

    return (
        <View style={[styles.badgeCard, !unlocked && styles.lockedCard]}>
            <LinearGradient
                colors={colors as any}
                style={styles.iconContainer}
            >
                {unlocked ? (
                    badge.iconSVG ? (
                        <SvgXml xml={badge.iconSVG} width={32} height={32} />
                    ) : (
                        <Award size={32} color="white" />
                    )
                ) : (
                    <Lock size={24} color="#757575" />
                )}
            </LinearGradient>

            <View style={styles.info}>
                <Text style={[styles.title, !unlocked && styles.lockedText]}>{badge.title}</Text>
                <Text style={styles.desc}>{badge.description}</Text>
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ fontSize: 10, color: '#999', marginRight: 10 }}>
                        Goal: {badge.condition.count} {badge.condition.type.replace('_', ' ')}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#845ec2', fontWeight: 'bold' }}>
                        +{badge.rewardXP} XP
                    </Text>
                </View>
            </View>

            {unlocked && (
                <View style={styles.checkMark}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4caf50' }} />
                </View>
            )}
        </View>
    );
});

export default function Achievements() {
    const router = useRouter();
    const { profile, loading } = useUserProfile();

    const { achievements, loading: achievementsLoading } = useAchievements();


    const isUnlocked = (achievement: any) => {
        if (!profile) return false;
        const { type, count } = achievement.condition;

        switch (type) {
            case 'quiz_count':
            case 'quizzes_taken':
                return (profile.quizAttempts || 0) >= count;
            case 'streak':
                return (profile.streak || 0) >= count;
            case 'xp':
                return (profile.xp || 0) >= count;
            case 'topic_completed':
                return (profile.topicsCompleted || 0) >= count;
            default:
                return false;
        }
    };

    if (loading || achievementsLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Loading awards..." />
            </SafeAreaView>
        );
    }

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
                <Text style={styles.headerTitle}>Achievements</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={achievements}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.content}
                initialNumToRender={6}
                maxToRenderPerBatch={5}
                windowSize={5}
                renderItem={({ item }) => <BadgeItem badge={item} unlocked={isUnlocked(item)} />}
            />
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
    badgeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 16,
        marginBottom: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    lockedCard: {
        opacity: 0.8,
        backgroundColor: '#f5f5f5',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    lockedText: {
        color: '#757575',
    },
    desc: {
        fontSize: 14,
        color: '#666',
    },
    checkMark: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    }
});
