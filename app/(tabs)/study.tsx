
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useCategories } from '../../hooks/useCategories';
import CustomLoader from '../../components/CustomLoader';

export default function StudyTab() {
    const router = useRouter();
    const { categories, loading } = useCategories();

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Loading library..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Study Room</Text>
                <Text style={styles.subtitle}>Read up on topics before taking quizzes</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.categoriesGrid}>
                    {categories.map((cat, index) => (
                        <Animated.View
                            key={cat.id}
                            entering={FadeInDown.delay(100 + (index * 100)).duration(800)}
                            style={styles.categoryWrapper}
                        >
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/topics/[categoryId]', params: { categoryId: cat.id, title: cat.name } })}
                                activeOpacity={0.8}
                                style={styles.categoryCard}
                            >
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    scrollContent: {
        padding: 20,
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
        height: 140,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    categoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    categoryName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 10,
        textAlign: 'center',
    }
});
