import { ReactNode } from "react";
import { Header } from "./Header";
import { BottomNavigation } from "./BottomNavigation";
import { EmergencyFloatingButton } from "./EmergencyFloatingButton";
import { useLocation } from "react-router-dom";
import { useCollection } from "@/src/hooks/useCollection";
import { useAppointmentReminders } from "@/src/hooks/useAppointmentReminders";

interface LayoutProps {
  children: ReactNode;
}

type AppointmentForReminders = {
  id: string;
  date: string;
  time: string;
  type: string;
  provider?: string;
  reminders?: boolean;
  completed: boolean;
};

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const { data: appointments } = useCollection<AppointmentForReminders>("appointments", []);
  useAppointmentReminders(appointments);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-md mx-auto pb-24">
        {children}
      </main>
      {!isHome && <EmergencyFloatingButton />}
      <BottomNavigation />
    </div>
  );
}
