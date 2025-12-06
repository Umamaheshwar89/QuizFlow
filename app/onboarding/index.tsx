import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Master Your Skills',
        description: 'Practice thousands of MCQs across various topics and difficulty levels.',
        image: require('../../assets/adaptive-icon.png'), // Placeholder, using app icon for now
        color: '#4c669f'
    },
    {
        id: '2',
        title: 'Track Progress',
        description: 'Visualize your improvement with detailed analytics and performance insights.',
        image: require('../../assets/adaptive-icon.png'),
        color: '#3b5998'
    },
    {
        id: '3',
        title: 'Complete Quizzes',
        description: 'Challenge yourself with timed quizzes and climb the global leaderboard.',
        image: require('../../assets/adaptive-icon.png'),
        color: '#192f6a'
    }
];

export default function Onboarding() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            // Scroll to next slide logic would go here if we had a ref
        } else {
            await AsyncStorage.setItem('hasLaunched', 'true');
            router.replace('/(auth)/login');
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasLaunched', 'true');
        router.replace('/(auth)/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <FlatList
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        <View style={styles.imageContainer}>
                            <View style={[styles.circle, { backgroundColor: item.color + '20' }]}>
                                {/* Replace with actual illustrations later */}
                                <Image source={item.image} style={styles.mockImage} resizeMode="contain" />
                            </View>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    {currentIndex < SLIDES.length - 1 ? (
                        <>
                            <TouchableOpacity onPress={handleSkip}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.nextButton]}
                                disabled // We rely on swipe for now or add ref later
                            >
                                <Text style={styles.buttonText}>Swipe</Text>
                                <ArrowRight size={20} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={[styles.button, styles.getStartedButton]} onPress={handleNext}>
                            <Text style={styles.buttonText}>Get Started</Text>
                            <Check size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    slide: {
        width,
        height: '100%',
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mockImage: {
        width: 150,
        height: 150,
    },
    textContainer: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 24,
    },
    footer: {
        height: 150,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 50,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#4c669f',
    },
    inactiveDot: {
        width: 8,
        backgroundColor: '#ccc',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 30,
        elevation: 2,
    },
    nextButton: {
        backgroundColor: '#4c669f',
        opacity: 0.5
    },
    getStartedButton: {
        backgroundColor: '#4c669f',
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    skipText: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
});
