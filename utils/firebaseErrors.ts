export const getFriendlyErrorMessage = (error: any): string => {
    if (!error) return 'An unknown error occurred.';

    const code = error.code || '';
    const message = error.message || '';

    switch (code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid credentials. Please check your login details.';
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/operation-not-allowed':
            return 'This sign-in method is not enabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many login attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/requires-recent-login':
            return 'Please login again to verify your identity before performing this action.';
        default:
            // If it's a generic Firebase error with a raw message, try to clean it up or just return it if it looks readable
            if (message.includes('Firebase:')) {
                return 'An authentication error occurred. Please try again.';
            }
            return message || 'Something went wrong. Please try again.';
    }
};
