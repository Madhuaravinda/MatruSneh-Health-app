import { Capacitor } from '@capacitor/core';
import { CapacitorSocialLogin } from '@capgo/capacitor-social-login/dist/plugin';

/**
 * Test function to verify Google Sign-In functionality works in native platforms
 */
export async function testGoogleSignIn(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Google Sign-In testing is only available on native platforms');
    return;
  }

  try {
    console.log('Testing Google Sign-In...');
    
    // Test if plugin is available
    const response = await CapacitorSocialLogin.signIn({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });

    console.log('Google Sign-In test successful:', response);
    
    if (response && response.idToken) {
      console.log('ID Token received:', response.idToken.substring(0, 20) + '...');
    } else {
      console.warn('No ID token received from Google Sign-In test');
    }
    
  } catch (error) {
    console.error('Google Sign-In test failed:', error);
    
    // Check for common errors
    if (error instanceof Error) {
      if (error.message.includes('Network')) {
        console.error('Network error - check internet connection');
      } else if (error.message.includes('canceled') || error.message.includes('cancelled')) {
        console.log('User cancelled sign-in');
      } else {
        console.error('Unknown error:', error.message);
      }
    }
  }
}

/**
 * Test function to check if Google Sign-In plugin is properly configured
 */
export async function checkGoogleSignInConfiguration(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Configuration check is only available on native platforms');
    return;
  }

  try {
    console.log('Checking Google Sign-In configuration...');
    
    // This will fail if plugin is not properly configured
    await CapacitorSocialLogin.signIn({
      provider: 'google',
      options: {
        scopes: ['email'],
      },
    });
    
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('configuration') || error.message.includes('configured')) {
        console.error('Google Sign-In plugin not properly configured:', error.message);
        console.log('Please check:');
        console.log('1. Firebase project has Google Sign-In enabled');
        console.log('2. OAuth 2.0 Client ID is correctly set in capacitor.config.ts');
        console.log('3. Android package name matches Firebase project configuration');
      }
    }
  }
}
