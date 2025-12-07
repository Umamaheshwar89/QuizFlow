import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, User } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import UIButton from '../../components/UIButton';
import UIInput from '../../components/UIInput';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useToast } from '../../context/ToastContext';
import { getFriendlyErrorMessage } from '../../utils/firebaseErrors';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();
    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !name) {
            showToast('error', 'Please fill in all fields to create your account.');
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            // Create user profile
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: email,
                displayName: name,
                xp: 0,
                level: 1,
                streak: 0,
                quizAttempts: 0,
                createdAt: new Date().toISOString(),
                role: 'user',
                hasOnboarded: false
            });
            showToast('success', 'Account created successfully!');
            // AuthContext handles redirect, but we might want to show success first? 
            // Usually AuthContext redirect is fast. Let's just rely on that.

        } catch (error: any) {
            showToast('error', getFriendlyErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    const isValid = React.useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return name.length >= 2 && emailRegex.test(email) && password.length >= 6;
    }, [name, email, password]);

    return (
        <LinearGradient colors={['#ffffff', '#f3f4f6']} style={styles.container}>
            <StatusBar style="dark" />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/adaptive_icon.png')} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Text style={styles.appName}>Quiz Flow</Text>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Start your learning journey today</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.form}>
                        <UIInput
                            placeholder="Full Name"
                            icon={User}
                            value={name}
                            onChangeText={setName}
                        />
                        <UIInput
                            placeholder="Email Address"
                            icon={Mail}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <UIInput
                            placeholder="Password"
                            icon={Lock}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <UIButton
                            title="Sign Up"
                            onPress={handleRegister}
                            loading={loading}
                            colors={['#FF512F', '#DD2476']}
                            disabled={!isValid}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Link href="/(auth)/login" asChild>
                                <Text style={styles.link}>Sign In</Text>
                            </Link>
                        </View>
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
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 30,
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
        width: 80,
        height: 80,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF512F',
        marginBottom: 8,
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 32,
    },
    footerText: {
        color: '#666',
        fontSize: 15,
    },
    link: {
        color: '#DD2476',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
