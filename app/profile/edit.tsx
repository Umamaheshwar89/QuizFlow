
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Image, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, Save, ArrowLeft, User, Mail } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../services/firebaseConfig';
// @ts-ignore
import { getStorage } from 'firebase/storage';
import UIButton from '../../components/UIButton';
import { useUserProfile } from '../../hooks/useUserProfile';
import CustomModal from '../../components/CustomModal';
import CustomLoader from '../../components/CustomLoader';

export default function EditProfile() {
    const router = useRouter();
    const { profile, loading: profileLoading } = useUserProfile();
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState<{ type: 'success' | 'error' | 'info', title: string, message: string }>({
        type: 'info',
        title: '',
        message: ''
    });

    const showModal = (type: 'success' | 'error' | 'info', title: string, message: string) => {
        setModalConfig({ type, title, message });
        setModalVisible(true);
    };

    // Initialize state when profile loads
    useEffect(() => {
        if (profile) {
            setName(profile.displayName || auth.currentUser?.displayName || '');
            // We don't have a photoURL in our UserProfile interface yet, but let's assume one or use auth
            setImage(auth.currentUser?.photoURL || null);
        }
    }, [profile]);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setSaving(true);
        try {
            let photoURL = auth.currentUser.photoURL;

            // Upload Image if changed
            if (image && image !== auth.currentUser.photoURL) {
                // Real implementation requires Firebase Storage bucket to be set up
                // For this MVP, if storage fails we might just warn or skip.
                try {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    const storage = getStorage();
                    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
                    await uploadBytes(storageRef, blob);
                    photoURL = await getDownloadURL(storageRef);
                } catch (storageError) {
                    console.error("Storage upload failed (maybe bucket not configured?):", storageError);
                    // Fallback: Just keep local uri for session or alert
                    // Alert.alert("Upload Failed", "Could not upload image to cloud. Saving text changes only.");
                }
            }

            // Update Auth Profile
            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });

            // Update Firestore Profile
            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                displayName: name,
                // photoURL: photoURL // Un-comment if we add this to schema
            });

            showModal('success', 'Success', 'Profile updated successfully');
            // router.back(); // Move this to modal close or delay? 
            // Actually usually we want the user to see success before leaving.
            // But strict replacement of Alert: Alert usually blocks? No, RN Alert is async/callback based.
            // Here distinct from Alert, CustomModal is in-component. 
            // Let's delay back navigation or let user close modal to go back.
            // For now, I'll keep router.back() but maybe wrapped in a timeout or just remove it and let user press a button?
            // The original code had: Alert.alert(...) then router.back() (which might happen immediately if not awaited properly, but Alert.alert returns void).
            // Alert.alert is non-blocking in JS thread but shows native dialog.
            // If I showModal, I shouldn't route back immediately or modal disappears.
            // I'll set a flag or handle navigation on modal close.
        } catch (error: any) {
            showModal('error', 'Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A'; // Invalid date
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    };

    if (profileLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <CustomLoader text="Loading profile..." />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarContainer}>
                        {image ? (
                            <Image source={{ uri: image }} style={styles.avatarImage} />
                        ) : (
                            <View style={[styles.avatarImage, styles.placeholderAvatar]}>
                                <Text style={styles.placeholderText}>{name?.[0] || 'U'}</Text>
                            </View>
                        )}
                        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                            <Camera size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.changePhotoText}>Change Profile Photo</Text>
                </View>

                {/* Read-Only Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Account Details</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Level</Text>
                            <Text style={styles.statValue}>{profile?.level || 1}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>XP</Text>
                            <Text style={styles.statValue}>{profile?.xp || 0}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>Joined</Text>
                            <Text style={styles.statValue}>{formatDate(profile?.joinedAt)}</Text>
                        </View>
                    </View>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <User size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Enter your name"
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={[styles.inputContainer, styles.disabledInput]}>
                            <Mail size={20} color="#999" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={auth.currentUser?.email || ''}
                                editable={false}
                                placeholderTextColor="#999"
                            />
                        </View>
                        <Text style={styles.helperText}>Email cannot be changed.</Text>
                    </View>
                </View>

                <UIButton
                    title="Save Changes"
                    onPress={handleSave}
                    loading={saving}
                    icon={Save}
                    colors={['#845ec2', '#d65db1']}
                />

            </ScrollView>

            <CustomModal
                visible={modalVisible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => {
                    setModalVisible(false);
                    if (modalConfig.type === 'success') {
                        router.back();
                    }
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#f0f0f0'
    },
    content: {
        padding: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
    },
    placeholderAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#845ec2',
    },
    placeholderText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    changePhotoText: {
        color: '#845ec2',
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        borderLeftWidth: 3,
        borderLeftColor: '#845ec2',
        paddingLeft: 10,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
    },
    form: {
        marginBottom: 30,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#f9f9f9',
    },
    disabledInput: {
        backgroundColor: '#f0f0f0',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    helperText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
        marginLeft: 5,
    },
});
