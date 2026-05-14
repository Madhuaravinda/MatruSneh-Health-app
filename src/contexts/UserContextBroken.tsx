import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/src/hooks/useLocalStorage';
import { auth, db } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  browserPopupRedirectResolver,
  signInWithCredential,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';
import { Capacitor } from '@capacitor/core';
// Dynamic import to avoid blocking app startup
let CapacitorSocialLogin: any = null;

async function loadSocialLoginPlugin() {
  if (!CapacitorSocialLogin && Capacitor.isNativePlatform()) {
    try {
      const module = await import('@capgo/capacitor-social-login/dist/plugin');
      CapacitorSocialLogin = module.CapacitorSocialLogin;
    } catch (error) {
      console.warn('Social login plugin not available:', error);
    }
  }
  return CapacitorSocialLogin;
}

interface UserProfile {
  uid?: string;
  name: string;
  age?: string;
  dob?: string;
  bloodGroup?: string;
  dueDate: string;
  language: 'kn' | 'en';
  onboardingComplete: boolean;
  profileSetupComplete: boolean;
  contactNumber?: string;
  emergencyContact?: string;
}

interface UserContextType {
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
  firebaseUser: FirebaseUser | null;
  authError: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const defaultUser: UserProfile = {
  name: '',
  age: '',
  dob: '',
  bloodGroup: '',
  dueDate: '',
  language: 'en',
  onboardingComplete: false,
  profileSetupComplete: false,
  contactNumber: '',
  emergencyContact: '',
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useLocalStorage<UserProfile>('matru_sneh_user', defaultUser);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync user state to local storage AND Firestore if logged in
  const setUser = async (newUser: Partial<UserProfile>) => {
    setUserState((prev) => {
      const mergedUser = { ...prev, ...newUser };
      
      if (firebaseUser) {
        setDoc(doc(db, 'users', firebaseUser.uid), {
          ...mergedUser,
          uid: firebaseUser.uid,
          updatedAt: serverTimestamp()
        }, { merge: true }).catch(error => {
          handleFirestoreError(error, OperationType.WRITE, `users/${firebaseUser.uid}`);
        });
      }
      
      return mergedUser;
    });
  };

  useEffect(() => {
    void getRedirectResult(auth).catch(() => {
      /* no pending redirect */
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setAuthError(null);
        // When logging in, try to fetch profile from Firestore
        try {
          const docRef = doc(db, 'users', fUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const firestoreData = docSnap.data() as UserProfile;
            setUserState((currentUser) => {
              // Only overwrite with defined fields from Firestore to avoid losing local data during sync
              const cleanFirestoreData: Partial<UserProfile> = {};
              Object.keys(firestoreData).forEach((key) => {
                const k = key as keyof UserProfile;
                if (firestoreData[k] !== undefined && firestoreData[k] !== null && firestoreData[k] !== '') {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (cleanFirestoreData as Record<string, any>)[k] = firestoreData[k];
                }
              });
              return { ...defaultUser, ...currentUser, ...cleanFirestoreData };
            });
          } else {
            // First time login, sync local user if it has data
            setUserState((currentUser) => {
              const mergedUser = { ...defaultUser, ...currentUser };
              if (mergedUser.onboardingComplete) {
                setDoc(docRef, {
                  ...mergedUser,
                  uid: fUser.uid,
                  updatedAt: serverTimestamp()
                }).catch(err => {
                   handleFirestoreError(err, OperationType.WRITE, `users/${fUser.uid}`);
                });
              }
              return mergedUser;
            });
          }
        } catch (error) {
          console.warn("Firestore profile fetch failed, using local data:", error);
          // handleFirestoreError(error, OperationType.GET, `users/${fUser.uid}`);
        }
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [setUserState]);

  const signIn = async () => {
    setAuthError(null);
    const isKn = user.language === 'kn';

    try {
      if (Capacitor.isNativePlatform()) {
        // Use Capacitor Social Login for native platforms - no browser popup
        const SocialLogin = await loadSocialLoginPlugin();
        if (!SocialLogin) {
          throw new Error('Google Sign-In not available on this device');
        }
        
        const response = await SocialLogin.signIn({
          provider: 'google',
          options: {
            scopes: ['email', 'profile'],
          },
        });
        
        // Create Firebase credential from Google Sign-In result
        if (response && response.idToken) {
          const credential = GoogleAuthProvider.credential(response.idToken);
          await signInWithCredential(auth, credential);
        } else {
          throw new Error('No ID token received from Google Sign-In');
        }
      } else {
        // Use Firebase web Sign-In for browsers only
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');

      }
    } catch (error) {
      console.error('Sign In Error:', error);
      const err = error as { code?: string; message?: string };

      // Handle Capacitor Social Login specific errors
      if (err.message?.includes('Network')) {
        setAuthError(
          isKn
            ? 'ಇಂಟರ್ನೆಟ್ ಬೇಕು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ.'
            : 'Network error. Please check your internet connection.'
        );
        return;
      }
        
      if (err.message?.includes('canceled') || err.message?.includes('cancelled')) {
        return; // User cancelled sign-in
      }

      // Firebase error handling
      if (err.code === 'auth/network-request-failed') {
        setAuthError(
          isKn
            ? 'ಇಂಟರ್ನೆಟ್ ಬೇಕು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ.'
            : 'Network error. Please check your internet connection.'
        );
        return;
      }

      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(
          isKn
            ? 'Firebase ನಲ್ಲ Google ಸೈನ್ ಇನ್‌ಗೆ ಇಂಟರ್ನೆಟ್ ಬೇಕು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ.'
            : 'Google sign-in is disabled for this Firebase project. In Firebase Console → Authentication → Sign-in method, enable Google.'
        );
        return;
      }

      if (err.code === 'auth/invalid-api-key') {
        setAuthError(
          isKn
            ? 'API ಕೀ ತಪ್ಪದೆ. firebase-applet-config.json ಪರೀಕಿಸಿ.'
            : 'Invalid API key. Check firebase-applet-config.json matches your Firebase project.'
        );
        return;
      }

      const detail = err.message ? ` ${err.message}` : '';
      setAuthError(
        isKn
          ? `ಸೈನ್ ಇನ್ ವಿರಿ${detail} ಆಫ್ಲೈನ್ ಇಂಟರ್ನೆಟ್ ಬೇಕು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ಲಿ.'
          : `Sign-in failed.${detail} Try "Continue offline", or verify Firebase Auth (Google enabled).`
      );
    }
  };

  const logout = async () => {
    try {
      if (firebaseUser) {
        await signOut(auth);
      }
      setFirebaseUser(null);
      
      // Clear all app-specific storage for a full reset
      const appKeys = [
        'matru_sneh_user',
        'matru_sneh_kicks',
        'matru_sneh_nutrition',
        'matru_sneh_appointments',
        'matru_sneh_health_alerts'
      ];
      appKeys.forEach(key => window.localStorage.removeItem(key));
      
      // Reset user state to default
      setUserState(defaultUser);
      
      // Force a fresh load to landing
      window.location.href = '/';
    } catch (error) {
      console.error("Logout Error:", error);
      window.localStorage.clear(); // Nuclear option on error
      window.location.href = '/';
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, firebaseUser, authError, signIn, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
