
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, X } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { doc, setDoc } from 'firebase/firestore';

import UIButton from '../../components/UIButton';
import { useMCQs, MCQ } from '../../hooks/useMCQs';
import CustomLoader from '../../components/CustomLoader';
import { auth, db } from '../../services/firebaseConfig';

export default function QuizScreen() {
    const { id } = useLocalSearchParams(); // This is topicId
    const router = useRouter();
    const { mcqs, loading } = useMCQs(id as string);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins
    const [isFinished, setIsFinished] = useState(false);

    // Animations
    const progress = useSharedValue(0);

    useEffect(() => {
        // Update progress bar
        if (mcqs.length > 0) {
            progress.value = withTiming((currentQuestionIndex + 1) / mcqs.length);
        }
    }, [currentQuestionIndex, mcqs.length]);

    useEffect(() => {
        if (loading || mcqs.length === 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleFinish(score); // Auto finish
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, mcqs.length]);

    const handleOptionPress = (index: number) => {
        setSelectedOption(index);
    };

    const handleNext = () => {
        // Check answer
        let newScore = score;
        const currentQ = mcqs[currentQuestionIndex];

        // Correct answer check
        const selectedText = currentQ.options[selectedOption!];

        if (selectedText === currentQ.correctAnswer) {
            newScore = score + 1;
            setScore(newScore);
        }

        if (currentQuestionIndex < mcqs.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            handleFinish(newScore);
        }
    };

    const handleFinish = async (finalScore: number) => {
        if (isFinished) return;
        setIsFinished(true);

        if (id === 'daily') {
            try {
                if (auth.currentUser) {
                    const today = new Date().toISOString().split('T')[0];
                    // Use setDoc with merge: true for safety
                    await setDoc(doc(db, 'users', auth.currentUser.uid), {
                        lastDailyQuizDate: today
                    }, { merge: true });
                }
            } catch (error) {
                console.error("Failed to update daily quiz status:", error);
            }
        }

        router.replace({
            pathname: '/quiz/result',
            params: {
                score: finalScore,
                total: mcqs.length,
                xp: finalScore * 10,
                isDaily: (id === 'daily').toString()
            }
        });
    };

    // Derived state / Render Helpers
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value * 100}%`
        };
    });

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Preparing your quiz..." />
            </SafeAreaView>
        );
    }

    if (mcqs.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No questions found for this topic yet.</Text>
                    <UIButton title="Go Back" onPress={() => router.back()} />
                </View>
            </SafeAreaView>
        );
    }

    const currentQuestion = mcqs[currentQuestionIndex];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                    <Animated.View style={[styles.progressBar, progressStyle]} />
                </View>
                <View style={styles.timerContainer}>
                    <Clock size={16} color={timeLeft < 60 ? 'red' : '#333'} />
                    <Text style={[styles.timerText, { color: timeLeft < 60 ? 'red' : '#333' }]}>{formatTime(timeLeft)}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.questionCounter}>Question {currentQuestionIndex + 1}/{mcqs.length}</Text>

                <Animated.View
                    key={currentQuestion.id}
                    entering={SlideInRight}
                    exiting={SlideOutLeft}
                    style={styles.questionContainer}
                >
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </Animated.View>

                <View style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionButton,
                                selectedOption === index && styles.selectedOption
                            ]}
                            onPress={() => handleOptionPress(index)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.optionCircle, selectedOption === index && styles.selectedOptionCircle]}>
                                {selectedOption === index && <View style={styles.innerCircle} />}
                            </View>
                            <Text style={[styles.optionText, selectedOption === index && styles.selectedOptionText]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <UIButton
                    title={currentQuestionIndex === mcqs.length - 1 ? "Finish Quiz" : "Next Question"}
                    onPress={handleNext}
                    loading={false}
                    disabled={selectedOption === null}
                />
            </View>

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
        padding: 15,
        borderBottomWidth: 1, // Optional
        borderBottomColor: '#f0f0f0',
    },
    closeButton: {
        padding: 5,
    },
    progressBarContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
        marginHorizontal: 15,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4c669f',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 60,
        justifyContent: 'flex-end',
    },
    timerText: {
        marginLeft: 5,
        fontWeight: 'bold',
        fontVariant: ['tabular-nums'],
    },
    content: {
        padding: 20,
        flexGrow: 1,
    },
    questionCounter: {
        color: '#666',
        marginBottom: 10,
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    questionContainer: {
        marginBottom: 30,
    },
    questionText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 30,
    },
    optionsContainer: {
        gap: 15,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    selectedOption: {
        borderColor: '#4c669f',
        backgroundColor: '#f0f4ff',
    },
    optionCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#ccc',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOptionCircle: {
        borderColor: '#4c669f',
    },
    innerCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4c669f',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedOptionText: {
        color: '#4c669f',
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20
    }
});
