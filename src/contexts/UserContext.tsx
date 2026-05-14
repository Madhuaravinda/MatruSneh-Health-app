import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, GoogleAuthProvider, signOut, signInWithCredential, signInWithPopup, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';

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

interface UserContextValue {
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  authError: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>({
    name: '',
    age: '',
    dob: '',
    bloodGroup: '',
    dueDate: '',
    language: 'en',
    onboardingComplete: false,
    profileSetupComplete: false,
  });

  const setUser = (user: Partial<UserProfile>) => {
    const updatedUser = { ...user };
    setUserState(prev => ({ ...prev, ...user }));
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    
    // Update Firestore if user is authenticated
    if (firebaseUser) {
      setDoc(doc(db, 'users', firebaseUser.uid), updatedUser);
    }
  };

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const signIn = async () => {
    setAuthError(null);
    const isKn = user.language === 'kn';

    try {
      if (Capacitor.isNativePlatform()) {
        console.log('Starting native Google Sign-In...');
        const SocialLogin = await loadSocialLoginPlugin();
        if (!SocialLogin) {
          throw new Error('Google Sign-In plugin not available');
        }
        
        console.log('Calling SocialLogin.signIn...');
        const response = await SocialLogin.signIn({
          provider: 'google',
          options: { scopes: ['email', 'profile'] },
        });
        
        console.log('SocialLogin response:', response);
        
        if (response && response.idToken) {
          console.log('Creating Firebase credential...');
          const credential = GoogleAuthProvider.credential(response.idToken);
          await signInWithCredential(auth, credential);
          console.log('Firebase sign-in successful');
        } else {
          console.error('No ID token received:', response);
          throw new Error('No ID token received from Google Sign-In');
        }
      } else {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        await signInWithPopup(auth, provider);
      }
    } catch (error) {
      console.error('Sign In Error:', error);
      const err = error as { code?: string; message?: string };

      if (Capacitor.isNativePlatform()) {
        if (err.message?.includes('canceled') || err.message?.includes('cancelled')) {
          return; // User cancelled sign-in
        }
        
        if (err.message?.includes('Network')) {
          setAuthError(isKn ? 'ಇಂಟರ್ನೆಟ್ ಬೇಕು' : 'Network error. Please check your internet connection.');
          return;
        }
      }

      if (err.code === 'auth/network-request-failed') {
        setAuthError(isKn ? 'ಇಂಟರ್ನೆಟ್ ಬೇಕು' : 'Network error. Please check your internet connection.');
        return;
      }

      if (err.code === 'auth/operation-not-allowed') {
        setAuthError(isKn ? 'Google ಸೈನ್ ಇನ್ ಅನುಮತಿಸಿಲ್ಲ' : 'Google sign-in is disabled. Enable in Firebase Console.');
        return;
      }

      setAuthError(isKn ? 'ಸೈನ್ ಇನ್ ವಿಫಲವಾಗಿದೆ' : 'Sign-in failed. Try again or use Offline login.');
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      if (firebaseUser) {
        await signOut(auth);
      }
      setFirebaseUser(null);
      setAuthError(null);
      // Reset user state to force onboarding
      setUser({
        name: '',
        age: '',
        dob: '',
        bloodGroup: '',
        dueDate: '',
        language: 'en',
        onboardingComplete: false,
        profileSetupComplete: false,
        contactNumber: '',
        emergencyContact: ''
      });
      // Reset logout flag after a delay
      setTimeout(() => setIsLoggingOut(false), 1000);
    } catch (error) {
      setIsLoggingOut(false);
      console.error('Logout Error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      setIsLoading(false);
      
      if (firebaseUser) {
        // First try to get from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          // Store locally for persistence
          localStorage.setItem('userProfile', JSON.stringify(userData));
          setUser(userData);
        } else {
          // If no Firestore data, try to get from localStorage
          const localData = localStorage.getItem('userProfile');
          if (localData) {
            const userData = JSON.parse(localData) as UserProfile;
            setUser(userData);
            // Create Firestore document if doesn't exist
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
          }
        }
      } else {
        // No Firebase user - check if there's a valid offline user in localStorage
        // Only reset state if not currently logging out (to prevent conflicts)
        if (!isLoggingOut) {
          const localData = localStorage.getItem('userProfile');
          if (localData) {
            const userData = JSON.parse(localData) as UserProfile;
            // Restore offline user state if they completed onboarding
            if (userData.onboardingComplete) {
              setUser(userData);
            } else {
              // User hasn't completed onboarding, reset to default
              setUser({
                name: '',
                age: '',
                dob: '',
                bloodGroup: '',
                dueDate: '',
                language: 'en',
                onboardingComplete: false,
                profileSetupComplete: false,
                contactNumber: '',
                emergencyContact: ''
              });
            }
          } else {
            // No local data, reset to default
            setUser({
              name: '',
              age: '',
              dob: '',
              bloodGroup: '',
              dueDate: '',
              language: 'en',
              onboardingComplete: false,
              profileSetupComplete: false,
              contactNumber: '',
              emergencyContact: ''
            });
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const value: UserContextValue = { user, setUser, firebaseUser, isLoading, authError, signIn, logout };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
