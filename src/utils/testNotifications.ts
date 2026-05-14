import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { scheduleAppointmentReminders, ensureNotificationPermission } from "./appointmentNotifications";

export interface TestAppointment {
  id: string;
  date: string;
  time: string;
  type: string;
  reminders: boolean;
  completed: boolean;
}

/**
 * Test function to verify notification functionality
 * Creates a test appointment 1 minute in the future
 */
export async function testNotificationSystem(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.log("Notification testing is only available on native platforms");
    return;
  }

  try {
    // Request permissions first
    const permission = await ensureNotificationPermission();
    if (permission !== "granted") {
      console.error("Notification permission not granted:", permission);
      return;
    }

    // Create test appointment 1 minute from now
    const now = new Date();
    const testTime = new Date(now.getTime() + 60000); // 1 minute from now
    
    const testAppointment: TestAppointment = {
      id: "test-" + Date.now(),
      date: testTime.toISOString().split('T')[0], // YYYY-MM-DD format
      time: testTime.toTimeString().split(' ')[0].substring(0, 5), // HH:MM format
      type: "Test Checkup",
      reminders: true,
      completed: false,
    };

    console.log("Creating test appointment:", testAppointment);
    
    // Schedule the notification
    scheduleAppointmentReminders([testAppointment], "en");
    
    // Also check pending notifications
    const pending = await LocalNotifications.getPending();
    console.log("Pending notifications:", pending);
    
    console.log("Test notification scheduled! You should receive a notification in 1 minute.");
    
  } catch (error) {
    console.error("Error testing notification system:", error);
  }
}

/**
 * Cancel all test notifications
 */
export async function cancelTestNotifications(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  
  try {
    const pending = await LocalNotifications.getPending();
    const testNotifications = pending.notifications.filter(n => 
      n.title?.includes("Pregnancy Checkup Reminder") && 
      n.body?.includes("Test Checkup")
    );
    
    if (testNotifications.length > 0) {
      await LocalNotifications.cancel({
        notifications: testNotifications.map(n => ({ id: n.id }))
      });
      console.log("Cancelled test notifications");
    }
  } catch (error) {
    console.error("Error cancelling test notifications:", error);
  }
}
