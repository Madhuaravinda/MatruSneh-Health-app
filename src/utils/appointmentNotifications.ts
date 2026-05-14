import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";

/**
 * Appointment reminders:
 * - **Android / iOS (Capacitor APK)**: `@capacitor/local-notifications` uses OS `AlarmManager` with
 *   `setExactAndAllowWhileIdle` when `allowWhileIdle: true`. Notifications fire while the app is
 *   **minimized, in the background, or not running**, as long as the OS has not force-stopped the app
 *   and notification + exact-alarm permissions are granted. After reboot, the plugin restores
 *   stored schedules; opening the app once also reschedules from Firestore/local data.
 * - **Browser / website**: timers only run while the page is loaded. For “closed app” reminders you
 *   must use the **Android APK** (or a server push solution).
 */

export type AppointmentReminderInput = {
  id: string;
  date: string;
  time: string;
  type: string;
  provider?: string;
  reminders?: boolean;
  completed: boolean;
};

const webTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/** Parse `YYYY-MM-DD` + HTML time as local wall-clock. */
export function parseAppointmentAt(dateStr: string, timeStr: string): Date | null {
  if (!dateStr?.trim() || !timeStr?.trim()) return null;
  let t = timeStr.trim();
  if (/^\d{1,2}:\d{2}$/.test(t)) t = `${t}:00`;
  
  // Parse date and time separately to ensure local time interpretation
  const dateParts = dateStr.trim().split('-');
  const timeParts = t.split(':');
  
  if (dateParts.length !== 3 || timeParts.length !== 3) return null;
  
  const year = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
  const day = parseInt(dateParts[2], 10);
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);
  
  const d = new Date(year, month, day, hours, minutes, seconds);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function wantsReminder(appt: AppointmentReminderInput): boolean {
  return appt.reminders !== false;
}

function notificationIdForAppointment(apptId: string): number {
  const digits = apptId.replace(/\D/g, "");
  const n = parseInt(digits, 10);
  if (Number.isFinite(n) && n > 0) return n % 2147483647;
  let h = 0;
  for (let i = 0; i < apptId.length; i++) {
    h = (Math.imul(31, h) + apptId.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % 2147483647;
}

export async function ensureNotificationPermission(): Promise<string> {
  console.log('Checking notification permissions...');
  
  if (Capacitor.isNativePlatform()) {
    console.log('Native platform detected');
    const status = await LocalNotifications.checkPermissions();
    console.log('Current permission status:', status);
    if (status.display === 'granted') {
      console.log('Permission already granted');
      return 'granted';
    }

    console.log('Requesting notification permissions...');
    const request = await LocalNotifications.requestPermissions();
    console.log('Permission request result:', request);
    if (request.display === 'granted') {
      console.log('Permission granted');
      return 'granted';
    }
    console.log('Permission denied:', request.display);
    return request.display ?? 'denied';
  }
  
  if (typeof Notification === 'undefined') {
    console.log('Notification API not available');
    return 'denied';
  }
  
  console.log('Web platform, current permission:', Notification.permission);
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission !== 'denied') {
    console.log('Requesting web notification permission...');
    return Notification.requestPermission();
  }
  return Notification.permission;
}

export async function cancelAllAppointmentReminders(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length === 0) return;
  await LocalNotifications.cancel({
    notifications: pending.notifications.map((n) => ({ id: n.id })),
  });
}

async function showWebReminder(appt: AppointmentReminderInput, lang: "kn" | "en"): Promise<void> {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

  const when = parseAppointmentAt(appt.date, appt.time);
  if (!when) return;
  const title = lang === "kn" ? "ಗರ್ಭಧಾರಣೆ ತಪಾಸಣೆ ಜ್ಞಾಪನೆ" : "Pregnancy Checkup Reminder";
  const appointmentName = appt.type.trim() || (lang === "kn" ? "ನೇಮಕಾತಿ" : "Appointment");
  const body = `${appointmentName} - ${formatBodyDateTime(when, lang)}`;
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/appointment` : "/appointment";

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        tag: `matru-appt-${appt.id}`,
        data: url,
        requireInteraction: true,
      });
    } else {
      new Notification(title, { body, icon: "/pwa-192x192.png", tag: `matru-appt-${appt.id}`, requireInteraction: true });
    }
  } catch (e) {
    console.warn("Web appointment reminder failed:", e);
  }
}

function scheduleWebReminders(
  appointments: AppointmentReminderInput[],
  lang: "kn" | "en"
): () => void {
  webTimeouts.forEach(clearTimeout);
  webTimeouts.clear();

  const now = Date.now();
  for (const appt of appointments) {
    if (!wantsReminder(appt) || appt.completed) continue;
    const when = parseAppointmentAt(appt.date, appt.time);
    if (!when) continue;
    const delay = when.getTime() - now;
    if (delay <= 0) continue;
    if (delay > 2147483647) continue;

    const tid = setTimeout(() => {
      webTimeouts.delete(appt.id);
      void showWebReminder(appt, lang);
    }, delay);
    webTimeouts.set(appt.id, tid);
  }

  return () => {
    webTimeouts.forEach(clearTimeout);
    webTimeouts.clear();
  };
}

async function ensureAndroidChannel(): Promise<void> {
  if (Capacitor.getPlatform() !== "android") return;
  await LocalNotifications.createChannel({
    id: "pregnancy_checkup_reminders",
    name: "Pregnancy Checkup Reminders",
    description: "High priority pregnancy checkup reminders with sound and vibration",
    importance: 5,
    visibility: 1,
    vibration: true,
    sound: "default",
    lights: true,
    lightColor: "#E91E63",
  });
}

function formatBodyDateTime(when: Date, lang: "kn" | "en"): string {
  const day = String(when.getDate()).padStart(2, "0");
  const month = String(when.getMonth() + 1).padStart(2, "0");
  const year = when.getFullYear();
  const dateStr = `${day}/${month}/${year}`;
  const timeStr = when.toLocaleTimeString(lang === "kn" ? "kn-IN" : undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return lang === "kn" ? `${dateStr}, ${timeStr}` : `${dateStr} at ${timeStr}`;
}

async function scheduleNativeNotification(
  appt: AppointmentReminderInput,
  lang: "kn" | "en",
  when: Date
): Promise<void> {
  console.log('Scheduling native notification for appointment:', appt.id, 'at:', when);
  
  const title = lang === "kn" ? "ಗರ್ಭಧಾರಣೆ ತಪಾಸಣೆ ಜ್ಞಾಪನೆ" : "Pregnancy Checkup Reminder";
  const appointmentName = appt.type.trim() || (lang === "kn" ? "ನೇಮಕಾತಿ" : "Appointment");
  const body = `${appointmentName} - ${formatBodyDateTime(when, lang)}`;
  const numericId = notificationIdForAppointment(appt.id);
  
  console.log('Notification details:', { title, body, id: numericId });

  const payload: {
    title: string;
    body: string;
    id: number;
    schedule: { at: Date; allowWhileIdle: boolean };
    sound: string;
    extra: { url: string };
    channelId?: string;
    smallIcon?: string;
    largeIcon?: string;
    iconColor?: string;
    autoCancel?: boolean;
    ongoing?: boolean;
    priority?: number;
    visibility?: number;
  } = {
    title,
    body,
    id: numericId,
    schedule: { at: when, allowWhileIdle: true },
    sound: "default",
    extra: { url: "/appointments" },
    autoCancel: true,
    ongoing: false,
    priority: 2,
    visibility: 1,
  };

  if (Capacitor.getPlatform() === "android") {
    console.log('Adding Android-specific properties');
    payload.channelId = "pregnancy_checkup_reminders";
    payload.smallIcon = "ic_stat_matrusneh";
    payload.largeIcon = "ic_launcher_foreground";
    payload.iconColor = "#E91E63";
  }

  console.log('Final notification payload:', payload);
  
  try {
    const result = await LocalNotifications.schedule({
      notifications: [payload],
    });
    console.log('Notification scheduled successfully:', result);
  } catch (error) {
    console.error('Failed to schedule notification:', error);
    throw error;
  }
}

async function syncNativeReminders(
  appointments: AppointmentReminderInput[],
  lang: "kn" | "en"
): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const perm = await LocalNotifications.checkPermissions();
    console.log('Native permission check result:', perm);
    if (perm.display !== 'granted') {
      console.log('Permission not granted, requesting...');
      const req = await LocalNotifications.requestPermissions();
      console.log('Permission request result:', req);
      if (req.display !== 'granted') {
        console.warn("LocalNotifications: permission not granted");
        return;
      }
    }

    await ensureAndroidChannel();
    await cancelAllAppointmentReminders();

    const now = new Date();
    const currentTime = now.getTime();
    
    for (const appt of appointments) {
      if (!wantsReminder(appt) || appt.completed) continue;
      const target = parseAppointmentAt(appt.date, appt.time);
      if (!target) continue;
      
      const appointmentTime = target.getTime();
      
      // Only schedule future appointments
      if (appointmentTime > currentTime) {
        console.log(`Scheduling notification for ${appt.id} at ${target.toISOString()}`);
        await scheduleNativeNotification(appt, lang, target);
      } else {
        console.log(`Skipping past appointment ${appt.id} at ${target.toISOString()}`);
      }
    }
  } catch (e) {
    console.warn("Native appointment reminder sync failed:", e);
  }
}

/**
 * Re-run native alarm scheduling (e.g. when the app returns to the foreground).
 * No-op on web.
 */
export async function resyncNativeAppointmentReminders(
  appointments: AppointmentReminderInput[],
  lang: "kn" | "en"
): Promise<void> {
  await syncNativeReminders(appointments, lang);
}

/**
 * Syncs reminders whenever appointments or language change.
 * Returns a disposer (clears web timers; native pending list is rescheduled on next sync).
 */
export function scheduleAppointmentReminders(
  appointments: AppointmentReminderInput[],
  lang: "kn" | "en"
): () => void {
  console.log('Scheduling appointment reminders for', appointments.length, 'appointments');
  
  if (Capacitor.isNativePlatform()) {
    console.log('Using native notification system');
    void syncNativeReminders(appointments, lang);
    return () => {};
  }
  
  console.log('Using web notification system');
  return scheduleWebReminders(appointments, lang);
}
