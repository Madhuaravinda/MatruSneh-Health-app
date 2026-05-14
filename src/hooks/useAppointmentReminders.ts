import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { useUser } from "@/src/contexts/UserContext";
import {
  scheduleAppointmentReminders,
  resyncNativeAppointmentReminders,
  type AppointmentReminderInput,
} from "@/src/utils/appointmentNotifications";

/**
 * Keeps appointment reminders in sync with stored appointments.
 * Runs from Layout so it survives route changes.
 * On Android/iOS, also reschedules when the app returns to the foreground (battery / OEM quirks).
 */
export function useAppointmentReminders(appointments: AppointmentReminderInput[]) {
  const { user } = useUser();
  const lang = user.language === "kn" ? "kn" : "en";
  const appointmentsRef = useRef(appointments);
  const langRef = useRef(lang);
  appointmentsRef.current = appointments;
  langRef.current = lang;

  useEffect(() => {
    const dispose = scheduleAppointmentReminders(appointments, lang);

    if (!Capacitor.isNativePlatform()) {
      return dispose;
    }

    let debounce: ReturnType<typeof setTimeout> | undefined;
    const onForeground = () => {
      if (document.visibilityState !== "visible") return;
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        void resyncNativeAppointmentReminders(appointmentsRef.current, langRef.current);
      }, 400);
    };

    document.addEventListener("visibilitychange", onForeground);
    window.addEventListener("focus", onForeground);

    return () => {
      dispose();
      clearTimeout(debounce);
      document.removeEventListener("visibilitychange", onForeground);
      window.removeEventListener("focus", onForeground);
    };
  }, [appointments, lang]);
}
