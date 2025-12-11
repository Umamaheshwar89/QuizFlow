
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
import { useToast } from '../../context/ToastContext';
import CustomLoader from '../../components/CustomLoader';
import { getFriendlyErrorMessage } from '../../utils/firebaseErrors';

export default function EditProfile() {
    const router = useRouter();
    const { profile, loading: profileLoading } = useUserProfile();
    const [name, setName] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();


    useEffect(() => {
        if (profile) {
            setName(profile.displayName || auth.currentUser?.displayName || '');

            setImage(auth.currentUser?.photoURL || null);
        }
    }, [profile]);

    const pickImage = async () => {

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


            if (image && image !== auth.currentUser.photoURL) {


                try {
                    const response = await fetch(image);
                    const blob = await response.blob();
                    const storage = getStorage();
                    const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
                    await uploadBytes(storageRef, blob);
                    photoURL = await getDownloadURL(storageRef);
                } catch (storageError) {
                    console.error("Storage upload failed (maybe bucket not configured?):", storageError);


                    showToast('error', "Could not upload image to cloud. Saving other changes.");
                }
            }


            await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: photoURL
            });


            const userRef = doc(db, 'users', auth.currentUser.uid);
            await updateDoc(userRef, {
                displayName: name,
                photoURL: photoURL
            });

            showToast('success', 'Profile updated successfully');
            router.back();
        } catch (error: any) {
            showToast('error', getFriendlyErrorMessage(error));
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
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
