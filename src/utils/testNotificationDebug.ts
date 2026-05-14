import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

/**
 * Simple test to verify notifications are working
 */
export async function testNotificationSystem(): Promise<void> {
  console.log('=== Testing Notification System ===');
  console.log('Platform:', Capacitor.getPlatform());
  console.log('Is native:', Capacitor.isNativePlatform());
  
  try {
    // Check permissions first
    console.log('1. Checking permissions...');
    const permStatus = await LocalNotifications.checkPermissions();
    console.log('Permission status:', permStatus);
    
    if (permStatus.display !== 'granted') {
      console.log('2. Requesting permissions...');
      const requestResult = await LocalNotifications.requestPermissions();
      console.log('Permission request result:', requestResult);
      
      if (requestResult.display !== 'granted') {
        console.error('❌ Permission denied! Cannot test notifications.');
        return;
      }
    }
    
    // Create Android channel if needed
    if (Capacitor.getPlatform() === 'android') {
      console.log('3. Creating Android channel...');
      await LocalNotifications.createChannel({
        id: 'pregnancy_checkup_reminders',
        name: 'Pregnancy Checkup Reminders',
        description: 'High priority pregnancy checkup reminders with sound and vibration',
        importance: 5,
        visibility: 1,
        vibration: true,
        sound: 'default',
        lights: true,
        lightColor: '#E91E63',
      });
      console.log('✅ Android channel created');
    }
    
    // Schedule a test notification for 5 seconds from now
    console.log('4. Scheduling test notification...');
    const testTime = new Date(Date.now() + 5000); // 5 seconds from now
    
    const result = await LocalNotifications.schedule({
      notifications: [{
        id: 999999,
        title: 'Test Notification',
        body: 'This is a test notification to verify the system is working',
        schedule: { at: testTime, allowWhileIdle: true },
        sound: 'default',
        channelId: Capacitor.getPlatform() === 'android' ? 'pregnancy_checkup_reminders' : undefined,
        smallIcon: Capacitor.getPlatform() === 'android' ? 'ic_stat_matrusneh' : undefined,
        largeIcon: Capacitor.getPlatform() === 'android' ? 'ic_launcher_foreground' : undefined,
        iconColor: '#E91E63',
        autoCancel: true,
        ongoing: false,
      }]
    });
    
    console.log('✅ Test notification scheduled:', result);
    console.log('🎉 You should receive a notification in 5 seconds!');
    
    // Check pending notifications
    setTimeout(async () => {
      const pending = await LocalNotifications.getPending();
      console.log('📋 Pending notifications:', pending);
    }, 1000);
    
  } catch (error) {
    console.error('❌ Notification test failed:', error);
  }
}

/**
 * Check what notifications are currently pending
 */
export async function checkPendingNotifications(): Promise<void> {
  try {
    const pending = await LocalNotifications.getPending();
    console.log('📋 Current pending notifications:', pending.notifications.length);
    pending.notifications.forEach((notif, index) => {
      console.log(`${index + 1}. ID: ${notif.id}, Title: ${notif.title}, Scheduled: ${notif.schedule?.at}`);
    });
  } catch (error) {
    console.error('❌ Failed to check pending notifications:', error);
  }
}
