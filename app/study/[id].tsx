
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import CustomLoader from '../../components/CustomLoader';
import { Topic } from '../../hooks/useTopics';

export default function StudyDetail() {
    const { id, title } = useLocalSearchParams();
    const router = useRouter();
    const [material, setMaterial] = useState<Topic | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchMaterial = async () => {
            try {
                // Fetch from 'topics' now
                const docRef = doc(db, 'topics', id as string);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setMaterial({ id: docSnap.id, ...docSnap.data() } as Topic);
                }
            } catch (error) {
                console.error("Error fetching material", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMaterial();
    }, [id]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Loading content..." />
            </SafeAreaView>
        );
    }

    if (!material) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Topic not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title || material.title}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.metaContainer}>
                    <View style={styles.chip}>
                        <BookOpen size={14} color="#845ec2" />
                        <Text style={styles.chipText}>Topic</Text>
                    </View>
                    <View style={styles.chip}>
                        <Clock size={14} color="#845ec2" />
                        <Text style={styles.chipText}>{material.estimatedReadTime} min read</Text>
                    </View>
                </View>

                <Text style={styles.title}>{material.title}</Text>

                <Text style={styles.body}>{material.content}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3e5f5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 10,
    },
    chipText: {
        color: '#845ec2',
        fontSize: 12,
        marginLeft: 5,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    body: {
        fontSize: 16,
        lineHeight: 26,
        color: '#444',
    },
});
