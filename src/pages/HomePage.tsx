import { PageContainer } from "@/src/components/layout/PageContainer";
import { useUser } from "@/src/contexts/UserContext";
import { Card, CardContent } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { 
  Calendar, Apple, Activity, BookHeart, 
  Phone, ChevronRight 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useCollection } from "@/src/hooks/useCollection";
import { useDoc } from "@/src/hooks/useDoc";
import { differenceInDays, startOfDay } from "date-fns";
import { computePregnancyFromDueDate, getPregnancyData } from "@/src/utils/pregnancy";
import { Button } from "@/src/components/ui/Button";

// Main Dashboard for Pregnancy Tracking
export default function HomePage() {
  const { user, firebaseUser, isLoading: isUserLoading } = useUser();
  const navigate = useNavigate();

  const { data: sessions, isLoading: isKickLoading } = useCollection<{ id: string, count: number, startTime: string }>("kick_sessions", []);
  const { data: appointments, isLoading: isApptLoading } = useCollection<{ id: string, date: string, type: string, completed: boolean }>("appointments", []);
  
  const today = new Date().toISOString().split('T')[0];
  const nutritionPath = firebaseUser ? `users/${firebaseUser.uid}/nutrition/${today}` : null;
  const { data: firebaseNutritionLog, isLoading: isNutritionLoading } = useDoc<Record<string, boolean>>(nutritionPath, {});
  
  // For offline users, read from localStorage (same as NutritionPage)
  const localStorageNutritionLog = !firebaseUser ? (() => {
    const item = localStorage.getItem('daily_nutrition');
    return item ? JSON.parse(item) : {};
  })() : {};
  
  const nutritionLog = firebaseUser ? firebaseNutritionLog : localStorageNutritionLog;

  // Only show full loading if we have NO user data at all and it's loading
  const isGlobalLoading = isUserLoading && !user.onboardingComplete;

  // We'll use local session data immediately while sync happens in background
  const kicksToday = sessions
    .filter(s => s.startTime.startsWith(today))
    .reduce((acc, s) => acc + s.count, 0);
  
  const nutritionCount = Object.values(nutritionLog).filter(Boolean).length;
  const nutritionProgress = Math.round((nutritionCount / 5) * 100);
  
  // Debug: Log nutrition data to check if it's resetting daily
  console.log('Nutrition Debug - Today:', today, 'Nutrition Log:', nutritionLog, 'Count:', nutritionCount, 'Progress:', nutritionProgress);

  const upcomingAppts = appointments
    .filter(a => !a.completed && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const nextAppt = upcomingAppts[0];

  const pregnancy = useMemo(
    () => computePregnancyFromDueDate(user.dueDate),
    [user.dueDate]
  );
  const week = pregnancy?.gestationalWeekNumber ?? 24;
  const currentSize = getPregnancyData(week);

  /** Calendar days until a date (appointments); not used for EDD display. */
  const daysUntilAppointment = (dateStr: string) =>
    Math.max(
      0,
      differenceInDays(startOfDay(new Date(dateStr)), startOfDay(new Date()))
    );

  const t = {
    kicksToday: user.language === 'kn' ? "ಇಂದಿನ ಒದೆತಗಳು" : "Kicks today",
    nextVisit: user.language === 'kn' ? "ಮುಂದಿನ ಭೇಟಿ" : "Next visit",
    nutritionToday: user.language === 'kn' ? "ಇಂದಿನ ಪೋಷಣೆ" : "Nutrition today",
    tapToLog: user.language === 'kn' ? "ದಾಖಲಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ" : "Tap to log a kick",
    emergency: user.language === 'kn' ? "ತುರ್ತು ಪರಿಸ್ಥಿತಿ • ಕರೆ ಮಾಡಿ 108" : "Emergency • Call 108",
    nutritionSub: user.language === 'kn' ? "ರಾಗಿ, ಸೊಪ್ಪು ಮತ್ತು ಕಾಳುಗಳನ್ನು ಹಸಿರುಮಾಡಿ" : "Add Ragi, Greens & Pulses to complete your plate",
    weekLabel: user.language === 'kn' ? "ವಾರ" : "WEEK",
    daysToGo: user.language === 'kn' ? "ಉಳಿದ ದಿನಗಳು" : "Days To Go",
    viewJourney: user.language === 'kn' ? "ಪಯಣ ನೋಡಿ" : "View Journey",
    babyHealthy: user.language === 'kn' ? "ನಿಮ್ಮ ಮಗು ಸುಸ್ಥಿತಿಯಲ್ಲಿದೆ ಮತ್ತು ದಿನದಿಂದ ದಿನಕ್ಕೆ ಬೆಳೆಯುತ್ತಿದೆ." : "Everything looks great! Baby is growing healthy."
  };

  const isSyncing = isKickLoading || isApptLoading || (!!firebaseUser && isNutritionLoading);

  if (isGlobalLoading) {
    return (
      <PageContainer className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-display font-medium animate-pulse">
            {user.language === 'kn' ? "ಮಾಹಿತಿಯನ್ನು ಸಿದ್ಧಪಡಿಸಲಾಗುತ್ತಿದೆ..." : "Setting up your dashboard..."}
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-32 bg-slate-50/50">
      {isSyncing && (
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded-lg text-[8px] font-bold uppercase animate-pulse border border-primary/10">
            <div className="w-1 h-1 bg-primary rounded-full animate-bounce" />
            {user.language === 'kn' ? 'ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ...' : 'Syncing data...'}
          </div>
        </div>
      )}
      {/* Hero Card: Baby Status */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 flex flex-col gap-5 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-50 rounded-full opacity-50" />
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-black text-black uppercase tracking-widest">
                  {t.weekLabel}
                </span>
                <span className="text-2xl font-bold text-primary leading-none">
                  {week}
                </span>
              </div>
            </div>
            <BookHeart className="w-6 h-6 text-primary/20" />
          </div>
          
          <div className="space-y-1.5">
            <h2 className="text-base font-bold font-display leading-tight text-black">
              {user.language === 'kn' ? "ನಿಮ್ಮ ಮಗು " : "Your baby is the size of a "}
              <span className="text-yellow-600 underline decoration-yellow-200 underline-offset-4">
                {user.language === 'kn' ? currentSize.sizeKn : currentSize.size}
              </span>
              {user.language === 'kn' ? "ಯ ಗಾತ್ರದಷ್ಟಿದೆ" : ""}
            </h2>
            <p className="text-black/70 text-xs font-semibold leading-relaxed max-w-[200px]">
              {t.babyHealthy}
            </p>
          </div>
        </div>

        <div className="flex items-end justify-between relative z-10 pt-1">
          <Button 
            onClick={() => navigate("/journey")} 
            variant="primary" 
            size="sm" 
            className="rounded-xl shadow-lg shadow-primary/20 text-[11px] h-9 px-5 font-bold"
          >
            {t.viewJourney} <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
          
          <div className="text-right">
            <p className="text-xl font-bold text-primary leading-none">
              {user.dueDate && pregnancy != null ? pregnancy.daysRemaining : '--'}
            </p>
            <p className="text-[9px] uppercase font-black text-black mt-1 tracking-wider">
              {t.daysToGo}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Top Widgets Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Kicks widget */}
        <Card onClick={() => navigate("/kick-counter")} className="rounded-[24px] border-none shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
          <CardContent className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-black">{t.kicksToday}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-black leading-none">{kicksToday}</p>
            </div>
            <p className="text-[11px] font-semibold text-black/50">{t.tapToLog}</p>
          </CardContent>
        </Card>

        {/* Appointment widget */}
        <Card onClick={() => navigate("/appointment")} className="rounded-[24px] border-none shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
          <CardContent className="p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-secondary" />
              <span className="text-xs font-bold text-black">{t.nextVisit}</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-black leading-none">
                {nextAppt ? `${daysUntilAppointment(nextAppt.date)}d` : '--'}
              </p>
            </div>
            <p className="text-[11px] font-semibold text-black/50">
              {nextAppt ? (nextAppt.type || "Check-up") : "Schedule visit"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Nutrition widget */}
      <Card onClick={() => navigate("/nutrition")} className="rounded-[24px] border-none shadow-sm cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
        <CardContent className="p-5 flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Apple className="w-4 h-4 text-secondary" />
                <span className="text-[10px] font-black text-black uppercase tracking-widest">
                  {user.language === 'kn' ? "ಪ್ರಗತಿ" : "PROGRESS"}
                </span>
              </div>
              <span className="text-xs font-black text-black">
                {nutritionProgress}% {user.language === 'kn' ? "ಪೂರ್ಣಗೊಂಡಿದೆ" : "Done"}
              </span>
           </div>
           
           <ProgressBar value={nutritionProgress} colorClassName="bg-secondary" className="h-2 rounded-full bg-green-100" />
           
           <p className="text-[11px] font-semibold text-black/60 leading-relaxed">
             {t.nutritionSub}
           </p>
        </CardContent>
      </Card>

      {/* Emergency Button */}
      <button 
        onClick={() => window.location.href = "tel:108"}
        className="w-full bg-red-600 py-5 rounded-[24px] shadow-lg shadow-red-200 flex items-center justify-center gap-3 text-white active:scale-[0.98] transition-transform"
      >
        <Phone className="w-5 h-5 fill-white" />
        <span className="text-base font-bold tracking-tight">{t.emergency}</span>
      </button>
      
      <div className="flex flex-col items-center gap-2 mt-8 opacity-20">
        <div className="h-1 w-6 bg-slate-300 rounded-full" />
        <p className="text-center text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">
          Matru-Sneh Health v1.1.0
        </p>
      </div>
    </PageContainer>
  );
}
