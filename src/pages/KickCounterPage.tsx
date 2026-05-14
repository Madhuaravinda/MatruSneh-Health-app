import { useState, useCallback, useEffect } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { Button } from "@/src/components/ui/Button";
import { Card, CardContent } from "@/src/components/ui/Card";
import { BackButton } from "@/src/components/ui/BackButton";
import { Heart, Trash2, Info, Timer, Check } from "lucide-react";
import { useCollection } from "@/src/hooks/useCollection";
import { motion } from "motion/react";
import { useUser } from "@/src/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { formatDateDDMMYYYY } from "@/src/utils/text";

interface KickSession {
  id: string;
  count: number;
  startTime: string;
  lastKickTime?: string;
  notes: string;
  userId?: string;
}

export default function KickCounterPage() {
  const { user, firebaseUser } = useUser();
  const lang = user.language || 'en';
  const navigate = useNavigate();
  const { data: sessions, add: addSession } = useCollection<KickSession>("kick_sessions", []);
  const [currentSession, setCurrentSession] = useState<KickSession | null>(null);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const infoText = lang === 'kn' 
    ? "ದಿನಕ್ಕೆ ಒಂದು ಬಾರಿಯಾದರೂ ಚಲನೆಯನ್ನು ಎಣಿಸಿ. 2 ಗಂಟೆಯಲ್ಲಿ 10 ಒದೆತಗಳು ಆಗುವುದು ಸಾಮಾನ್ಯ. ಚಲನೆಗಳು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆಯಾದರೆ ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
    : "Count movements once a day. 10 kicks within 2 hours is considered normal. If you notice a significant decrease in movement, contact your doctor immediately.";

  const t = {
    title: lang === 'kn' ? "ಒದೆತ ಕೌಂಟರ್" : "Kick Counter",
    subtitle: lang === 'kn' ? "ಮಗುವಿನ ಆರೋಗ್ಯವನ್ನು ತಿಳಿಯಲು ಪ್ರತಿ ಚಲನೆಯನ್ನು ದಾಖಲಿಸಿ." : "Track baby's movements to monitor their wellbeing.",
    ready: lang === 'kn' ? "ಸಿದ್ಧರಿದ್ದೀರಾ?" : "Ready for a session?",
    readyDesc: lang === 'kn' ? "ಆರಾಮವಾಗಿ ಕುಳಿತು ಮಗುವಿನ ಒದೆತಗಳನ್ನು ಎಣಿಸಲು ಪ್ರಾರಂಭಿಸಿ." : "Find a comfortable place and start counting the baby's kicks.",
    startBtn: lang === 'kn' ? "ಎಣಿಕೆ ಆರಂಭಿಸಿ" : "START COUNTING",
    active: lang === 'kn' ? "ಎಣಿಕೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ" : "Session Active",
    kicks: lang === 'kn' ? "ಒದೆತಗಳು" : "Kicks",
    startTime: lang === 'kn' ? "ಆರಂಭದ ಸಮಯ" : "Time Started",
    durationLabel: lang === 'kn' ? "ಅವಧಿ" : "Duration",
    reset: lang === 'kn' ? "ಮರುಹೊಂದಿಸಿ" : "Reset",
    finish: lang === 'kn' ? "ಮುಕ್ತಾಯ" : "Finish Session",
    history: lang === 'kn' ? "ಇತ್ತೀಚಿನ ದಾಖಲೆಗಳು" : "Recent History",
    seeAll: lang === 'kn' ? "ಎಲ್ಲಾ ನೋಡಿ" : "See All",
    noHistory: lang === 'kn' ? "ಯಾವುದೇ ದಾಖಲೆಗಳಿಲ್ಲ." : "No saved sessions yet.",
    mins: lang === 'kn' ? "ನಿಮಿಷ" : "mins",
    confirmReset: lang === 'kn' ? "ಈ ಸೆಶನ್ ಅನ್ನು ಅಳಿಸಲು ನೀವು ಖಚಿತವಾಗಿರುವಿರಾ?" : "Are you sure you want to clear this session?",
    back: lang === 'kn' ? "ಹಿಂದಕ್ಕೆ" : "Back",
    notesPlaceholder: lang === 'kn' ? "ಗಮನಿಸಿ (ಐಚ್ಛಿಕ)..." : "Add a note (optional)...",
  };

  const startSession = () => {
    setCurrentSession({
      id: Date.now().toString(),
      count: 0,
      startTime: new Date().toISOString(),
      notes: "",
    });
    setDuration(0);
  };

  // Duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession) {
      interval = setInterval(() => {
        const start = new Date(currentSession.startTime).getTime();
        const now = new Date().getTime();
        setDuration(Math.floor((now - start) / 60000));
      }, 10000); // Update every 10s
    }
    return () => clearInterval(interval);
  }, [currentSession]);

  const handleKick = useCallback(() => {
    if (isDebouncing || !currentSession) return;

    setIsDebouncing(true);
    setCurrentSession((prev) => 
      prev ? { ...prev, count: prev.count + 1, lastKickTime: new Date().toISOString() } : null
    );

    setTimeout(() => setIsDebouncing(false), 300);
  }, [isDebouncing, currentSession]);

  const saveSession = () => {
    if (currentSession && firebaseUser) {
      addSession({ ...currentSession, userId: firebaseUser.uid });
      setCurrentSession(null);
    } else if (currentSession) {
      addSession({ ...currentSession, userId: 'local' });
      setCurrentSession(null);
    }
  };

  const resetSession = () => {
    if (window.confirm(t.confirmReset)) {
      setCurrentSession(null);
    }
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <BackButton label={t.back} onClick={() => navigate("/")} />
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="w-5 h-5" />
        </Button>
      </div>

      {showInfo && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/10 p-4 rounded-2xl my-2 relative"
        >
          <p className="text-[11px] text-primary font-bold leading-relaxed">
            {infoText}
          </p>
        </motion.div>
      )}

      <header className="space-y-4">
        <div className="space-y-1">
          <h1 className="text-lg font-display font-bold text-black">
            {t.title}
          </h1>
          <p className="text-black/60 text-[11px]">
            {t.subtitle}
          </p>
        </div>

        {/* Tab Segments */}
        <div className="flex bg-gray-100 p-1 rounded-xl w-full">
          <button 
            className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all bg-white shadow-sm text-black"
          >
            {user.language === 'kn' ? "ಕೌಂಟರ್" : "Counter"}
          </button>
          <button 
            onClick={() => navigate("/kick-history")}
            className="flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-gray-500"
          >
            {user.language === 'kn' ? "ಇತಿಹಾಸ" : "History"}
          </button>
        </div>
      </header>

      {!currentSession ? (
        <div className="flex flex-col gap-4 py-6 items-center justify-center text-center">
          <div className="w-28 h-28 rounded-[32px] bg-pink-50 flex items-center justify-center border-4 border-white shadow-sm rotate-3">
             <Heart className="w-10 h-10 text-primary animate-pulse fill-primary/5 -rotate-3" />
          </div>
          <div className="space-y-3">
             <h2 className="text-base font-bold font-display text-black">{t.ready}</h2>
             <p className="text-black/50 text-[11px] max-w-[200px] leading-relaxed">{t.readyDesc}</p>
             <Button onClick={startSession} size="md" className="rounded-xl px-8 shadow-sm font-black tracking-wider text-[11px]">
                {t.startBtn}
             </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
           <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
              <CardContent className="p-6 flex flex-col items-center gap-5">
                <div className="flex flex-col items-center gap-2">
                   <div className="flex items-center gap-2 text-secondary font-black text-[8px] uppercase tracking-[0.2em] bg-secondary/10 px-2.5 py-1 rounded-full">
                      <Timer className="w-2.5 h-2.5" />
                      {t.active}
                   </div>
                </div>

                <div className="relative">
                   <motion.button
                     animate={isDebouncing ? { scale: 1.1 } : { scale: 1 }}
                     transition={{ type: "spring", stiffness: 400, damping: 10 }}
                     onClick={handleKick}
                     className="w-36 h-36 rounded-[40px] bg-primary text-white flex flex-col items-center justify-center border-4 border-pink-50 shadow-xl active:bg-primary/90 transition-colors cursor-pointer touch-manipulation"
                   >
                     <span className="text-3xl font-bold font-display">{currentSession.count}</span>
                     <span className="text-[9px] font-black uppercase tracking-[0.3em] mt-1 opacity-80">{t.kicks}</span>
                   </motion.button>
                </div>

                <div className="grid grid-cols-2 w-full gap-3 pt-4 border-t border-slate-100">
                   <div className="text-center">
                      <p className="text-[8px] font-black text-primary/60 uppercase tracking-widest mb-1">{t.startTime}</p>
                      <p className="font-bold text-black text-xs">{new Date(currentSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                   <div className="text-center">
                      <p className="text-[8px] font-black text-secondary/70 uppercase tracking-widest mb-1">{t.durationLabel}</p>
                      <p className="font-bold text-black text-xs">{duration} {t.mins}</p>
                   </div>
                </div>

                <div className="w-full mt-2">
                  <p className="text-[7px] font-black text-black/40 uppercase tracking-widest mb-1 ml-1">{t.notesPlaceholder}</p>
                  <textarea
                    value={currentSession.notes}
                    onChange={(e) => setCurrentSession({ ...currentSession, notes: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none text-[11px] font-bold text-black focus:ring-2 focus:ring-primary/20 min-h-[70px] outline-none"
                    placeholder="..."
                  />
                </div>
              </CardContent>
           </Card>

           <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="md" 
                className="flex-1 rounded-2xl border-2 border-primary text-primary font-bold bg-white text-xs" 
                onClick={resetSession}
              >
                <Trash2 className="w-4 h-4 mr-2" /> {t.reset}
              </Button>
              <Button 
                variant="outline" 
                size="md" 
                className="flex-1 rounded-2xl border-2 border-primary text-primary font-bold bg-white text-xs shadow-lg shadow-primary/5" 
                onClick={saveSession}
              >
                <Check className="w-4 h-4 mr-2" /> {t.finish}
              </Button>
           </div>
        </div>
      )}

      {/* History Preview */}
      <section className="mt-8 pb-10">
         <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold font-display text-lg tracking-tight">{t.history}</h3>
            <Button 
               variant="ghost" 
               size="sm" 
               className="text-primary font-bold text-xs uppercase tracking-widest"
               onClick={() => navigate("/kick-history")}
            >
               {t.seeAll}
            </Button>
         </div>
         <div className="flex flex-col gap-3">
            {sessions.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-12 bg-muted/20 border-2 border-dashed border-muted rounded-[32px] gap-2 grayscale">
                 <Heart className="w-8 h-8 text-muted opacity-30" />
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t.noHistory}</p>
               </div>
            ) : (
               sessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-5 bg-white rounded-[28px] border border-gray-50 shadow-sm group">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                           <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-gray-900">{formatDateDDMMYYYY(s.startTime)}</p>
                           <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                     </div>
                     <div className="text-right">
                       <span className="text-xl font-black text-primary">{s.count}</span>
                       <span className="text-[10px] font-black text-primary uppercase ml-1 tracking-widest">{t.kicks}</span>
                     </div>
                  </div>
               ))
            )}
         </div>
      </section>
    </PageContainer>
  );
}
