import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../hooks/useUserProfile';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import { Settings, BarChart2, Award, Users } from 'lucide-react-native';
import UIButton from '../../components/UIButton';
import { useRouter } from 'expo-router';
import { useToast } from '../../context/ToastContext';

export default function Profile() {
    const { user } = useAuth();
    const { profile } = useUserProfile();
    const router = useRouter();
    const { showToast } = useToast();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            showToast('error', 'Failed to logout');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.push('/profile/edit')} activeOpacity={0.8}>
                        <View style={styles.avatar}>
                            {auth.currentUser?.photoURL ? (
                                <Image source={{ uri: auth.currentUser.photoURL }} style={{ width: 100, height: 100, borderRadius: 50 }} />
                            ) : (
                                <Text style={styles.avatarText}>{profile?.displayName?.[0] || user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</Text>
                            )}
                            <View style={styles.editBadge}>
                                <Settings size={12} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.name}>{profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User'}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{profile?.xp || 0}</Text>
                        <Text style={styles.statLabel}>Total XP</Text>
                    </View>
                    <View style={styles.statLine} />
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{profile?.streak || 0}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statLine} />
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{profile?.quizAttempts || 0}</Text>
                        <Text style={styles.statLabel}>Quizzes</Text>
                    </View>
                </View>

                <View style={styles.menu}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/stats')}>
                        <BarChart2 size={24} color="#333" />
                        <Text style={styles.menuText}>Statistics</Text>
                        <View style={{ flex: 1 }} />
                        <Settings size={16} color="#ccc" style={{ transform: [{ rotate: '-90deg' }] }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/achievements')}>
                        <Award size={24} color="#333" />
                        <Text style={styles.menuText}>Achievements</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/profile/edit')}>
                        <Settings size={24} color="#333" />
                        <Text style={styles.menuText}>Settings</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.logoutContainer}>

                    <UIButton title="Logout" onPress={handleLogout} variant="outline" colors={['#fff', '#fff']} />
                </View>
            </ScrollView>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
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
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
        flex: 1,
    },
    statLine: {
        width: 1,
        backgroundColor: '#e0e0e0',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    menu: {
        width: '100%',
        marginBottom: 30,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 18,
        marginLeft: 15,
        color: '#333',
    },
    logoutContainer: {
        width: '100%',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4c669f',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    }
});
