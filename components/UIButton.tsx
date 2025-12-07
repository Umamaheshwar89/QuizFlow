import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { LucideIcon } from 'lucide-react-native';
import CustomLoader from './CustomLoader';

interface UIButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    colors?: [string, string, ...string[]];
    variant?: 'primary' | 'secondary' | 'outline';
    style?: StyleProp<ViewStyle>;
    icon?: LucideIcon;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function UIButton({
    title,
    onPress,
    loading = false,
    disabled = false,
    colors = ['#4c669f', '#3b5998', '#192f6a'],
    variant = 'primary',
    style,
    icon: Icon
}: UIButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
            opacity: withTiming(disabled || loading ? 0.7 : 1, { duration: 200 }),
        };
    }, [disabled, loading]);

    const handlePressIn = () => {
        if (disabled || loading) return;
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        if (disabled || loading) return;
        scale.value = withSpring(1);
    };

    if (variant === 'outline') {
        return (
            <AnimatedTouchable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading || disabled}
                style={[styles.container, styles.outline, animatedStyle, style]}
            >
                {loading ? (
                    <CustomLoader size={24} color="#4c669f" />
                ) : (
                    <>
                        {Icon && <Icon size={20} color="#4c669f" style={{ marginRight: 8 }} />}
                        <Text style={[styles.text, styles.textOutline]}>{title}</Text>
                    </>
                )}
            </AnimatedTouchable>
        )
    }

    return (
        <AnimatedTouchable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={loading || disabled}
            style={[styles.container, animatedStyle, style]}
        >
            <LinearGradient
                colors={colors}
                style={[styles.gradient, { flexDirection: 'row' }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                {loading ? (
                    <CustomLoader size={24} color="white" />
                ) : (
                    <>
                        {Icon && <Icon size={20} color="white" style={{ marginRight: 8 }} />}
                        <Text style={styles.text}>{title}</Text>
                    </>
                )}
            </LinearGradient>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        borderRadius: 12,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 0.5,
    },
    outline: {
        borderWidth: 2,
        borderColor: '#4c669f',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        elevation: 0,
        shadowOpacity: 0,
    },
    textOutline: {
        color: '#4c669f'
    }
});
