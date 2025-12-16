import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebaseConfig';
import UIButton from '../../components/UIButton';
import UIInput from '../../components/UIInput';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useToast } from '../../context/ToastContext';
import { getFriendlyErrorMessage } from '../../utils/firebaseErrors';

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { showToast } = useToast();

    const handleReset = async () => {
        if (!email) {
            showToast('error', 'Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            setIsSent(true);
            showToast('success', 'Reset email sent successfully!');
        } catch (error: any) {
            showToast('error', getFriendlyErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <LinearGradient colors={['#ffffff', '#f3f4f6']} style={styles.container}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>

                    <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/icon.png')} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Text style={styles.title}>Forgot Password?</Text>
                        <Text style={styles.subtitle}>
                            {isSent
                                ? `We've sent a password reset link to ${email}`
                                : "Enter your email address and we'll send you a link to reset your password."}
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.form}>
                        {!isSent ? (
                            <>
                                <UIInput
                                    placeholder="Email Address"
                                    icon={Mail}
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />

                                <UIButton
                                    title="Send Reset Link"
                                    onPress={handleReset}
                                    loading={loading}
                                    colors={['#4c669f', '#3b5998']}
                                    style={{ marginTop: 20 }}
                                />
                            </>
                        ) : (
                            <View style={styles.successContainer}>
                                <CheckCircle size={64} color="#4CAF50" />
                                <Text style={styles.successText}>Check your inbox!</Text>
                                <UIButton
                                    title="Back to Login"
                                    onPress={() => router.replace('/(auth)/login')}
                                    colors={['#4c669f', '#3b5998']}
                                    variant="outline"
                                    style={{ marginTop: 30, width: '100%' }}
                                />
                            </View>
                        )}

                        {!isSent && (
                            <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                                <Text style={styles.backLinkText}>Back to Login</Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 24,
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 40,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 25,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 20,
    },
    form: {
        width: '100%',
    },
    successContainer: {
        alignItems: 'center',
        padding: 20,
    },
    successText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backLink: {
        alignItems: 'center',
        marginTop: 20,
        padding: 10,
    },
    backLinkText: {
        color: '#4c669f',
        fontWeight: '600',
        fontSize: 15,
    }
});
