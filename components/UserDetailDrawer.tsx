import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { X, Award, Flame, Target, BookOpen } from 'lucide-react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { UserProfile } from '../hooks/useUserProfile';
import Animated, { FadeIn, SlideInDown, FadeOut, SlideOutDown } from 'react-native-reanimated';

interface UserDetailProps {
    visible: boolean;
    user: {
        id: string;
        displayName: string;
        photoURL?: string;
        xp: number;
    } | null;
    onClose: () => void;
}

const UserDetailDrawer = React.memo(({ visible, user, onClose }: UserDetailProps) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (visible && user?.id) {
            // Only set loading if it's not already true (though with state reset it should be)
            // But we'll keep it simple.
            // Note: If we reset loading in the 'else', it will be true when we open.

            const fetchProfile = async () => {
                try {
                    const docRef = doc(db, 'users', user.id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setProfile(docSnap.data() as UserProfile);
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchProfile();
        } else {
            // Reset state when drawer is closed
            setProfile(null);
            setLoading(true);
        }
    }, [visible, user?.id]); // Depend on user.id instead of user object to avoid ref churn issues

    if (!visible) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return 'Unknown';
        }
    };

    if (!user) return null;
    console.log(user);

    return (
        <View style={[styles.overlay, StyleSheet.absoluteFillObject]} pointerEvents="box-none">
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={[styles.backdrop, StyleSheet.absoluteFillObject]}
            >
                <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1} />
            </Animated.View>

            <Animated.View
                entering={SlideInDown.springify().damping(15)}
                exiting={SlideOutDown}
                style={styles.drawer}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Player Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            {user.photoURL ? (
                                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatar, styles.placeholderAvatar]}>
                                    <Text style={styles.avatarText}>{user.displayName[0]}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.name}>{user.displayName}</Text>
                    </View>

                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#4c669f" />
                        </View>
                    ) : (
                        <View style={styles.statsGrid}>
                            <View style={styles.statItem}>
                                <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                    <Award size={24} color="#2196F3" />
                                </View>
                                <Text style={styles.statValue}>{user.xp}</Text>
                                <Text style={styles.statLabel}>Total XP</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                                    <Flame size={24} color="#F44336" />
                                </View>
                                <Text style={styles.statValue}>{profile?.streak || 0}</Text>
                                <Text style={styles.statLabel}>Day Streak</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                                    <Target size={24} color="#4CAF50" />
                                </View>
                                <Text style={styles.statValue}>{profile?.accuracy || 0}%</Text>
                                <Text style={styles.statLabel}>Accuracy</Text>
                            </View>

                            <View style={styles.statItem}>
                                <View style={[styles.iconBox, { backgroundColor: '#FFF3E0' }]}>
                                    <BookOpen size={24} color="#FF9800" />
                                </View>
                                <Text style={styles.statValue}>{profile?.quizAttempts || 0}</Text>
                                <Text style={styles.statLabel}>Quizzes</Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.levelContainer}>
                        <Text style={styles.levelLabel}>Current Level</Text>
                        <View style={styles.levelBadge}>
                            <Text style={styles.levelValue}>{profile?.level || 1}</Text>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
        </View>
    );
});

export default UserDetailDrawer;

const styles = StyleSheet.create({
    overlay: {
        zIndex: 1000,
        elevation: 1000,
        justifyContent: 'flex-end',
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    drawer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '70%',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    content: {
        padding: 20,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#f0f0f0',
    },
    placeholderAvatar: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4c669f',
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    joined: {
        fontSize: 14,
        color: '#666',
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    statItem: {
        width: '47%',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 10,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    levelContainer: {
        marginTop: 20,
        alignItems: 'center',
        backgroundColor: '#4c669f',
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    levelLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    levelBadge: {
        backgroundColor: 'white',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4c669f',
    }
});
