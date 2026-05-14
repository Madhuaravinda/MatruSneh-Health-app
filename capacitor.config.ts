import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.Matrusneh.health',
  appName: 'MatruSneh',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_matrusneh',
      iconColor: '#E91E63',
    },
    CapacitorSocialLogin: {
      google: {
        webClientId: '1:412899986517:web:0bbe17ae82fee7086b58dc',
        androidClientId: '412899986517-9q4u5g8u7j8g9k9j2ur5812i7.apps.googleusercontent.com',
        scopes: ['email', 'profile'],
        serverClientId: '1:412899986517:web:0bbe17ae82fee7086b58dc',
        forceCodeForRefreshToken: true,
      },
    },
  },
};

export default config;
