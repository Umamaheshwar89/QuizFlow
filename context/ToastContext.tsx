import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'info';

interface ToastData {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastData | null>(null);
    const insets = useSafeAreaInsets();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showToast = useCallback((type: ToastType, message: string) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const id = Math.random().toString(36).substr(2, 9);
        setToast({ id, type, message });

        timeoutRef.current = setTimeout(() => {
            setToast(null);
        }, 3000); // Auto hide after 3 seconds
    }, []);

    const hideToast = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setToast(null);
    };

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success': return <CheckCircle size={24} color="white" />;
            case 'error': return <XCircle size={24} color="white" />;
            case 'info': return <Info size={24} color="white" />;
            default: return <AlertCircle size={24} color="white" />;
        }
    };

    const getBackgroundColor = (type: ToastType) => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#FF5252';
            case 'info': return '#2196F3';
            default: return '#333';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <View style={[styles.container, { top: insets.top + 10 }]} pointerEvents="box-none">
                    <Animated.View
                        key={toast.id}
                        entering={FadeInUp}
                        exiting={FadeOutUp}
                        style={[styles.toast, { backgroundColor: getBackgroundColor(toast.type) }]}
                    >
                        <View style={styles.iconContainer}>
                            {getIcon(toast.type)}
                        </View>
                        <Text style={styles.message}>{toast.message}</Text>
                        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
                            <XCircle size={18} color="rgba(255,255,255,0.8)" />
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </ToastContext.Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 9999, // Ensure it's on top of everything
        alignItems: 'center',
    },
    toast: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: '100%',
        maxWidth: 400,
    },
    iconContainer: {
        marginRight: 12,
    },
    message: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    closeButton: {
        padding: 4,
        marginLeft: 8,
    }
});
