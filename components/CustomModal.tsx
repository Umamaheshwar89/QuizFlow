import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';

type ModalType = 'success' | 'error' | 'info';

interface CustomModalProps {
    visible: boolean;
    type: ModalType;
    title: string;
    message: string;
    onClose: () => void;
}

export default function CustomModal({ visible, type, title, message, onClose }: CustomModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={60} color="#4CAF50" />;
            case 'error': return <XCircle size={60} color="#FF5252" />;
            case 'info': return <AlertCircle size={60} color="#2196F3" />;
            default: return <AlertCircle size={60} color="#2196F3" />;
        }
    };

    const getButtonColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#FF5252';
            case 'info': return '#2196F3';
            default: return '#2196F3';
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={onClose}
        >

            <Text>title</Text>
            {/* <View style={styles.container}>
                <View style={styles.backdrop}>
                    <TouchableOpacity style={styles.backdropPress} onPress={onClose} activeOpacity={1} />
                </View>

                <View style={[styles.modalContent]}>
                    <View style={styles.iconContainer}>
                        {getIcon()}
                    </View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: getButtonColor() }]}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdropPress: {
        flex: 1,
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 10,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 22,
    },
    button: {
        width: '100%',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
