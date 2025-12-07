import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from 'react-native';
import UserDetailDrawer from '../../components/UserDetailDrawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { Trophy, Medal } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import CustomLoader from '../../components/CustomLoader';

import { useUserProfile } from '../../hooks/useUserProfile';

interface UserRank {
    id: string;
    displayName: string;
    xp: number;
    photoURL?: string;
}

export default function Leaderboard() {
    const [users, setUsers] = useState<UserRank[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user } = useAuth()
    const { profile } = useUserProfile();

    const fetchLeaderboard = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(20));
            const querySnapshot = await getDocs(q);
            const ranks: UserRank[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Check for displayName, then name (seed data), then email part, then fallback
                const nameToDisplay = data.displayName || data.name || data.email?.split('@')[0] || 'Anonymous';

                ranks.push({
                    id: doc.id,
                    displayName: nameToDisplay,
                    xp: data.xp || 0,
                    photoURL: data.photoURL
                });
            });
            setUsers(ranks);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const [selectedUser, setSelectedUser] = useState<UserRank | null>(null);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLeaderboard();
    };

    const renderItem = ({ item, index }: { item: UserRank, index: number }) => {
        let icon;
        let color;
        if (index === 0) { icon = <Medal color="#FFD700" size={24} />; color = '#FFF9C4'; }
        else if (index === 1) { icon = <Medal color="#C0C0C0" size={24} />; color = '#F5F5F5'; }
        else if (index === 2) { icon = <Medal color="#CD7F32" size={24} />; color = '#FFE0B2'; }
        else { icon = <Text style={styles.rankText}>{index + 1}</Text>; color = 'white'; }

        // Use local profile data if it's the current user to ensure instant updates
        const isCurrentUser = item.id === user?.uid;
        const displayItem = isCurrentUser && profile ? {
            ...item,
            displayName: profile.displayName || item.displayName,
            photoURL: profile.photoURL || item.photoURL,
            xp: profile.xp // Also update XP if it changes locally? Maybe safer to stick to name/photo for now, but XP likely syncs well.
        } : item;

        return (
            <Animated.View entering={FadeInDown.delay(index * 50)}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSelectedUser(displayItem)}
                    style={[styles.rankItem, { backgroundColor: color }]}
                >
                    <View style={styles.leftSection}>
                        <View style={styles.rankIcon}>{icon}</View>
                        <View style={styles.avatar}>
                            {displayItem.photoURL ? (
                                <Image
                                    source={{ uri: displayItem.photoURL }}
                                    style={{ width: 40, height: 40, borderRadius: 20 }}
                                />
                            ) : (
                                <Text style={styles.avatarText}>{displayItem.displayName[0]}</Text>
                            )}
                        </View>
                        <Text style={styles.name}>{displayItem.displayName} {isCurrentUser && '(You)'}</Text>
                    </View>
                    <Text style={styles.xp}>{displayItem.xp} XP</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Leaderboard</Text>
                </View>
                <CustomLoader text="Loading ranks..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Leaderboard</Text>
            </View>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            />

            <UserDetailDrawer
                visible={!!selectedUser}
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 20,
    },
    rankItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rankIcon: {
        width: 30,
        alignItems: 'center',
        marginRight: 10,
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: 'white',
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    xp: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4c669f',
    },
    loadingContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});
