import { Tabs } from 'expo-router';
import { Home, BookOpen, Trophy, User, Gamepad2, Layers } from 'lucide-react-native';
import { Platform } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#4c669f',
            tabBarInactiveTintColor: '#999',
            headerShown: false,
            tabBarStyle: {
                height: Platform.OS === 'ios' ? 85 : 60,
                paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                paddingTop: 10,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600'
            }
        }}>
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />
                }}
            />

            <Tabs.Screen
                name="study"
                options={{
                    title: 'Study',
                    tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name="leaderboard"
                options={{
                    title: 'Rank',
                    tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />
                }}
            />
        </Tabs>
    );
}
