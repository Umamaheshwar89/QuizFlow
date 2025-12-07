import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import UIButton from '../../components/UIButton';
import { useRouter } from 'expo-router';
import { ArrowLeft, Trash2, User as UserIcon } from 'lucide-react-native';
import { UserProfile } from '../../hooks/useUserProfile';
import CustomLoader from '../../components/CustomLoader';

export default function AdminUsersScreen() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, 'users'));
            const userList: any[] = [];
            querySnapshot.forEach((doc) => {
                userList.push({ id: doc.id, ...doc.data() });
            });
            setUsers(userList);
        } catch (error) {
            console.error("Error fetching users:", error);
            Alert.alert("Error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string, userName: string) => {
        Alert.alert(
            "Delete User",
            `Are you sure you want to delete ${userName}? This only removes the Firestore profile, not the Auth account.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'users', userId));
                            setUsers(prev => prev.filter(u => u.id !== userId));
                            Alert.alert("Success", "User profile deleted");
                        } catch (error) {
                            console.error("Error deleting user:", error);
                            Alert.alert("Error", "Failed to delete user");
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <View style={styles.avatar}>
                    <UserIcon size={20} color="#fff" />
                </View>
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.displayName || "No Name"}</Text>
                    <Text style={styles.userEmail}>{item.email || "No Email"}</Text>
                    <Text style={styles.userId}>{item.id}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id, item.displayName || "User")}>
                <Trash2 size={24} color="#FF6B6B" />
            </TouchableOpacity>
        </View>
    );

    if (loading && users.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.loadingContainer]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>All Users (Dev)</Text>
                </View>
                <CustomLoader text="Loading users..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>All Users (Dev)</Text>
            </View>

            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={loading}
                onRefresh={fetchUsers}
                ListEmptyComponent={
                    !loading ? <Text style={styles.emptyText}>No users found.</Text> : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        paddingRight: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    listContent: {
        padding: 20,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    userId: {
        fontSize: 10,
        color: '#999',
        fontFamily: 'monospace',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        marginTop: 50,
    },
    loadingContainer: {
        justifyContent: 'flex-start', // Allows header to stay at top, loader in center effectively if we use another view or just margin
        alignItems: 'center',
    }
});
