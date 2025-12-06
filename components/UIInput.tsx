import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface UIInputProps extends TextInputProps {
    icon?: LucideIcon;
}

export default function UIInput({ icon: Icon, style, ...props }: UIInputProps) {
    return (
        <View style={styles.container}>
            {Icon && <Icon size={20} color="#666" style={styles.icon} />}
            <TextInput
                style={[styles.input, Icon ? { paddingLeft: 40 } : null, style]}
                placeholderTextColor="#999"
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 8,
        position: 'relative',
        justifyContent: 'center',
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        color: '#333',
    },
    icon: {
        position: 'absolute',
        left: 12,
        zIndex: 1,
    },
});
