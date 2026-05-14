import { 
  Settings, 
  Phone, 
  LogOut,
  ChevronRight,
  User,
  Calendar,
  Activity,
  Contact2,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { computePregnancyFromDueDate } from "@/src/utils/pregnancy";

const menuItems = [
  { icon: Activity, label: "Health Insights", labelKn: "ಆರೋಗ್ಯ ಒಳನೋಟಗಳು", href: "/health-summary", color: "text-primary", bg: "bg-pink-50" },
  { icon: AlertTriangle, label: "Danger Signs", labelKn: "ಅಪಾಯದ ಚಿಹ್ನೆಗಳು", href: "/health-alerts", color: "text-red-500", bg: "bg-red-50" },
  { icon: Contact2, label: "Contacts", labelKn: "ಸಂಪರ್ಕಗಳು", href: "/emergency-contacts", color: "text-secondary", bg: "bg-green-50" },
  { icon: Calendar, label: "Appointments", labelKn: "ನೇಮಕಾತಿಗಳು", href: "/appointment", color: "text-blue-500", bg: "bg-blue-50" },
];

export default function MorePage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const profileWeek = useMemo(
    () => computePregnancyFromDueDate(user.dueDate)?.gestationalWeekNumber ?? 24,
    [user.dueDate]
  );

  const handleLogout = async () => {
    if (window.confirm(user.language === 'kn' ? "ನೀವು ಹೊರಬರಲು ಬಯಸುವಿರಾ?" : "Are you sure you want to logout?")) {
      await logout();
      navigate('/onboarding');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-24">
      {/* Profile Summary */}
      <section className="flex items-center gap-3.5 p-3 mt-1">
        <div className="w-14 h-14 bg-pink-100 rounded-2xl border-2 border-primary/10 overflow-hidden flex items-center justify-center">
          <User className="w-7 h-7 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold font-display text-gray-900 leading-tight">
            {user.name || (user.language === 'kn' ? "ಬಳಕೆದಾರರು" : "User Profile")}
          </h2>
          <div className="bg-primary/10 self-start px-2 py-0.5 rounded-lg inline-block mt-1">
            <p className="text-[9px] text-primary font-black uppercase tracking-wider">
              {user.language === 'kn' ? `ಗರ್ಭಧಾರಣೆಯ ವಾರ ${profileWeek}` : `Pregnancy Week ${profileWeek}`}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="w-9 h-9 rounded-xl border border-gray-100 shadow-sm bg-white">
          <Settings className="w-4 h-4 text-gray-400" />
        </Button>
      </section>

      {/* Grid of Options */}
      <div className="grid grid-cols-2 gap-3.5">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="flex flex-col items-center justify-center h-auto p-4 rounded-[24px] bg-white border border-slate-50 shadow-sm hover:border-primary/20 transition-all gap-2.5 active:scale-95"
            onClick={() => navigate(item.href)}
          >
            <div className={`p-2.5 rounded-xl ${item.bg}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div className="text-center">
              <p className="text-[11px] font-bold text-gray-900 tracking-tight leading-tight">{user.language === 'kn' ? item.labelKn : item.label}</p>
            </div>
          </Button>
        ))}
      </div>

      {/* Emergency Quick Actions */}
      <Card className="rounded-[24px] border-none shadow-sm bg-red-50/50">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-100 rounded-xl">
              <Phone className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-xs font-bold text-gray-900">
              {user.language === 'kn' ? "ತುರ್ತು ಸಂಪರ್ಕ" : "Emergency Contact"}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            {user.language === 'kn' 
              ? "ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಕೇವಲ ಒಂದು ಸ್ಪರ್ಶದ ಮೂಲಕ ಸಹಾಯ ಪಡೆಯಿರಿ." 
              : "Get immediate help with one-tap calling in case of emergencies."}
          </p>
          <Button 
            className="w-full rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 h-11 text-xs shadow-md shadow-red-200 border-none"
            onClick={() => window.location.href = `tel:${user.emergencyContact || "108"}`}
          >
            {user.language === 'kn' 
              ? (user.emergencyContact ? "ಸಂಪರ್ಕಕ್ಕೆ ಕರೆ ಮಾಡಿ" : "108 ಕೆರೆ ಮಾಡಿ") 
              : (user.emergencyContact ? "Call Emergency Contact" : "Call 108 Emergency")}
          </Button>
        </CardContent>
      </Card>

      {/* Preferences & Logout */}
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="w-full justify-between h-auto p-4 rounded-2xl bg-white border border-gray-50 shadow-sm text-gray-400"
          onClick={() => navigate("/settings")}
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5" />
            <span className="font-bold text-gray-700">{user.language === 'kn' ? "ಸಂಯೋಜನೆಗಳು" : "Settings"}</span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-center gap-3 p-4 text-gray-400 font-bold mt-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>{user.language === 'kn' ? "ಹೊರಬನ್ನಿ" : "Logout"}</span>
        </Button>
      </div>
      
      <div className="flex flex-col items-center gap-2 mt-4 opacity-30">
        <div className="h-1 w-8 bg-gray-300 rounded-full" />
        <p className="text-center text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          Matru-Sneh Health v1.1.0
        </p>
      </div>
    </div>
  );
}
