import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock } from 'lucide-react-native';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';
import UIButton from '../../components/UIButton';
import UIInput from '../../components/UIInput';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import CustomModal from '../../components/CustomModal';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ type: 'success' | 'error', title: string, message: string }>({
        type: 'success',
        title: '',
        message: ''
    });

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: '769611697598-oiattim9t34gonr6p9e10360r4c6e8vn.apps.googleusercontent.com',
        iosClientId: '769611697598-oiattim9t34gonr6p9e10360r4c6e8vn.apps.googleusercontent.com',
        androidClientId: '769611697598-oiattim9t34gonr6p9e10360r4c6e8vn.apps.googleusercontent.com',
    });

    const showModal = (type: 'success' | 'error', title: string, message: string) => {
        setModalConfig({ type, title, message });
        setModalVisible(true);
    };

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            setLoading(true);
            signInWithCredential(auth, credential)
                .then(async (userCredential) => {
                    // Check if user doc exists
                    const userDocRef = doc(db, "users", userCredential.user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (!userDoc.exists()) {
                        // Create new profile for Google user
                        await setDoc(userDocRef, {
                            email: userCredential.user.email,
                            displayName: userCredential.user.displayName || 'User',
                            xp: 0,
                            streak: 0,
                            quizAttempts: 0,
                            createdAt: new Date().toISOString(),
                            role: 'user'
                        });
                    }
                })
                .catch((error) => {
                    showModal('error', 'Google Auth Error', error.message);
                })
                .finally(() => setLoading(false));
        }
    }, [response]);

    const handleLogin = async () => {
        if (!email || !password) {
            showModal('error', 'Missing Fields', 'Please fill in all fields to continue.');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            showModal('error', 'Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const isValid = React.useMemo(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) && password.length >= 6;
    }, [email, password]);

    return (
        <LinearGradient colors={['#ffffff', '#f3f4f6']} style={styles.container}>
            <StatusBar style="dark" />
            <CustomModal
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => setModalVisible(false)}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Animated.View entering={FadeInUp.delay(100).duration(400)} style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/adaptive-icon.png')} style={styles.logo} resizeMode="contain" />
                        </View>
                        <Text style={styles.appName}>Quiz Flow</Text>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Sign in to continue your progress</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.form}>
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

                        <View style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </View>

                        <UIButton
                            title="Sign In"
                            onPress={handleLogin}
                            loading={loading}
                            colors={['#4c669f', '#3b5998']}
                            disabled={!isValid}
                        />

                        <View style={styles.divider}>
                            <View style={styles.line} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.line} />
                        </View>

                        <UIButton
                            title="Continue with Google"
                            onPress={() => promptAsync()}
                            variant="outline"
                            loading={!request}
                            disabled={!request}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Link href="/(auth)/register" asChild>
                                <Text style={styles.link}>Sign Up</Text>
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
        alignItems: 'center',
        marginBottom: 40,
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
        color: '#4c669f',
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
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: 24,
        marginTop: 8,
    },
    forgotText: {
        color: '#4c669f',
        fontSize: 14,
        fontWeight: '600',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#e1e4e8',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '600',
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
        color: '#4c669f',
        fontWeight: 'bold',
        fontSize: 15,
    },
});
