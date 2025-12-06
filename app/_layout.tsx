import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <AuthProvider>
            <StatusBar style="auto" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="quiz/[id]" options={{ presentation: 'fullScreenModal' }} />
                <Stack.Screen name="quiz/result" options={{ presentation: 'modal' }} />
            </Stack>
        </AuthProvider>
    );
}
