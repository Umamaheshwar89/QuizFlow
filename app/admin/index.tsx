
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Database, ArrowLeft, Trash2 } from 'lucide-react-native';
import UIButton from '../../components/UIButton';
import { seedDatabase } from '../../utils/seedFirestore';
import { LinearGradient } from 'expo-linear-gradient';
import CustomModal from '../../components/CustomModal';

export default function AdminPanel() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string>('Ready');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ type: 'success' | 'error' | 'info', title: string, message: string }>({
        type: 'info',
        title: '',
        message: ''
    });

    const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setModalConfig({ type, title, message });
        setModalVisible(true);
    };

    const handleSeed = async () => {
        setLoading(true);
        setStatus('Seeding database...');
        try {
            const success = await seedDatabase();
            if (success) {
                setStatus('Success! Database populated with test data.');
                showModal('success', 'Success', 'Database has been seeded.');
            } else {
                setStatus('Failed to seed database. Check logs.');
                showModal('error', 'Error', 'Seeding failed. See status for details.');
            }
        } catch (error: any) {
            console.error("Seeding error:", error);
            setStatus(`Error: ${error.message || 'Unknown error'}`);
            showModal('error', 'Seeding Error', error.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <UIButton
                    title="Back"
                    onPress={() => router.back()}
                    variant="outline"
                    icon={ArrowLeft}
                    colors={['#fff', '#fff']}
                    style={{ width: 'auto', paddingHorizontal: 15 }}
                />
                <Text style={styles.headerTitle}>Admin Control Panel</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.statusBox}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={styles.statusText}>{status}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Database Management</Text>
                    <Text style={styles.sectionDesc}>
                        Use these tools to populate your Firestore database with initial data for development and testing.
                    </Text>

                    <UIButton
                        title="Seed All Data"
                        onPress={handleSeed}
                        loading={loading}
                        icon={Database}
                        colors={['#4facfe', '#00f2fe']}
                    />

                    <Text style={styles.warningText}>
                        Warning: This will add/overwrite Categories, Questions, and Study Materials.
                        It avoids deleting existing User data.
                    </Text>
                </View>

            </ScrollView>

            <CustomModal
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalVisible(false)}
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
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#333',
    },
    content: {
        padding: 20,
    },
    statusBox: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
    },
    statusLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    statusText: {
        color: '#00ff00',
        fontFamily: 'monospace',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    sectionDesc: {
        color: '#666',
        marginBottom: 20,
        lineHeight: 20,
    },
    warningText: {
        color: '#e67e22',
        fontSize: 12,
        marginTop: 15,
        fontStyle: 'italic',
    },
});
