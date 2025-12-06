
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    withSequence,
    Easing,
    cancelAnimation
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap } from 'lucide-react-native';

interface CustomLoaderProps {
    size?: number;
    color?: string;
    text?: string;
}

export default function CustomLoader({ size = 60, color = '#845ec2', text }: CustomLoaderProps) {
    const rotation = useSharedValue(0);
    const pulse = useSharedValue(1);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, { duration: 1500, easing: Easing.linear }),
            -1
        );

        pulse.value = withRepeat(
            withSequence(
                withTiming(1.2, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1,
            true
        );

        return () => {
            cancelAnimation(rotation);
            cancelAnimation(pulse);
        };
    }, []);

    const rotateStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotateZ: `${rotation.value}deg` }]
        };
    });

    const pulseStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: pulse.value }]
        };
    });

    return (
        <View style={styles.container}>
            <View style={[styles.loaderContainer, { width: size, height: size }]}>
                {/* Rotating Gradient Ring */}
                <Animated.View style={[styles.ringContainer, rotateStyle]}>
                    <LinearGradient
                        colors={['#845ec2', '#d65db1', 'transparent']}
                        style={[styles.ring, { borderRadius: size / 2 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                </Animated.View>

                {/* Center Icon */}
                <View style={styles.centerIcon}>
                    <Animated.View style={pulseStyle}>
                        <Zap size={size * 0.5} color={color} fill={color} />
                    </Animated.View>
                </View>
            </View>
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    ringContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ring: {
        width: '100%',
        height: '100%',
        borderWidth: 4,
        borderColor: 'transparent',
    },
    centerIcon: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: '80%',
        height: '80%',
        borderRadius: 100,
        zIndex: 1,
    },
    text: {
        marginTop: 15,
        fontSize: 14,
        color: '#666',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});
