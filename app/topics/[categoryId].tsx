
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, BrainCircuit, ChevronRight, Clock, Star } from 'lucide-react-native';

import { useTopics } from '../../hooks/useTopics';
import CustomLoader from '../../components/CustomLoader';

export default function TopicList() {
    const { categoryId, title } = useLocalSearchParams();
    const router = useRouter();
    const { topics, loading } = useTopics(categoryId as string);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Loading topics..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{title || 'Topics'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={topics}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            {item.difficulty && (
                                <View style={[styles.badge, styles.badgeDifficulty]}>
                                    <Text style={styles.badgeText}>{item.difficulty}</Text>
                                </View>
                            )}
                        </View>

                        <Text style={styles.summary}>{item.shortSummary}</Text>

                        <View style={styles.metaRow}>
                            <Clock size={12} color="#999" style={{ marginRight: 4 }} />
                            <Text style={styles.metaText}>{item.estimatedReadTime} min read</Text>
                        </View>

                        <View style={styles.actions}>
                            {/* Study Button */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.studyButton]}
                                onPress={() => router.push({ pathname: '/study/[id]', params: { id: item.id, title: item.title } })}
                            >
                                <BookOpen size={16} color="#845ec2" style={{ marginRight: 6 }} />
                                <Text style={styles.studyText}>Study</Text>
                            </TouchableOpacity>

                            {/* Quiz Button */}
                            <TouchableOpacity
                                style={[styles.actionButton, styles.quizButton]}
                                onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: item.id, title: item.title } })}
                            >
                                <BrainCircuit size={16} color="#fff" style={{ marginRight: 6 }} />
                                <Text style={styles.quizText}>Quiz</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No topics found for this category.</Text>
                    </View>
                }
            />
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
    },
    listContent: {
        padding: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    badgeDifficulty: {
        backgroundColor: '#fff3e0',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#f57c00',
        textTransform: 'uppercase',
    },
    summary: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    metaText: {
        fontSize: 12,
        color: '#999',
    },
    actions: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    studyButton: {
        backgroundColor: '#f3e5f5',
    },
    quizButton: {
        backgroundColor: '#845ec2',
    },
    studyText: {
        color: '#845ec2',
        fontWeight: '600',
    },
    quizText: {
        color: '#fff',
        fontWeight: '600',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
    }
});
