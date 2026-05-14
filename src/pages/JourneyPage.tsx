import { useState, useMemo, useEffect } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card, CardContent } from "@/src/components/ui/Card";
import { motion, AnimatePresence } from "motion/react";
import { Baby, Sparkles, Trophy, CalendarDays, Lock, Info, Heart, Stars } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { getPregnancyData, computePregnancyFromDueDate } from "@/src/utils/pregnancy";
import confetti from "canvas-confetti";

const BellyVisual = ({ week }: { week: number }) => {
  const getVisual = () => {
    if (week <= 7) {
      // Week 1-7: Subtle pulse with ripples + Dotted Heart
      return (
        <div className="relative">
          {/* Rotating Dotted Circle Outline */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-24 h-24 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-30"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-pink-300">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 6"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          {[1, 1.4, 1.8].map((s, i) => (
            <motion.div 
              key={i}
              animate={{ scale: [s, s * 1.3, s], opacity: [0.2 / (i+1), 0.05 / (i+1), 0.2 / (i+1)] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
              className="absolute inset-0 w-16 h-16 border border-pink-200 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            />
          ))}
          <motion.div 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-[2px] rounded-full flex items-center justify-center border border-white/30"
          >
            <Heart className="w-8 h-8 text-primary fill-primary/30" />
          </motion.div>
        </div>
      );
    } else if (week <= 15) {
      // Week 8-15: Floating heart in a cosmic field + Dotted layers
      return (
        <div className="relative">
          {/* Double Dotted Circle Protection */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-36 h-36 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-20"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
              <circle
                cx="50"
                cy="50"
                r="44"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="3 5"
              />
            </svg>
          </motion.div>

          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-32 h-32 border border-dotted border-pink-300/40 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-40 h-40 bg-pink-100/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
          />
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-24 h-24 bg-white/5 backdrop-blur-[4px] rounded-full flex items-center justify-center border border-white/20"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-12 h-12 text-primary fill-primary/40" />
            </motion.div>
          </motion.div>
        </div>
      );
    } else {
      // Week 16+: Ethereal Baby growth with minimal interference
      const growthScale = 1 + (week - 16) * 0.025;
      return (
        <div className="relative flex flex-col items-center">
          {/* Rotating Dotted Halo */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-44 h-44 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 opacity-10"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full text-primary">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 6" />
            </svg>
          </motion.div>

          {/* Concentric Ambient Waves */}
          {[1, 1.2, 1.4].map((s, i) => (
            <motion.div 
              key={i}
              animate={{ 
                scale: [s, s * 1.2, s],
                opacity: [0.05 / (i + 1), 0.1 / (i + 1), 0.05 / (i + 1)]
              }}
              transition={{ 
                duration: 6 + i, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: i * 0.7 
              }}
              className="absolute inset-0 w-32 h-32 border border-pink-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
            />
          ))}

          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: growthScale }}
            className="relative z-10 flex items-center justify-center w-32 h-32 rounded-full border border-white/30 bg-white/5 backdrop-blur-[3px]"
          >
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 4, -4, 0],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative flex items-center justify-center"
            >
              <Baby className="w-20 h-20 text-primary/70 drop-shadow-[0_5px_15px_rgba(233,30,99,0.1)]" />
              
              {/* Floating Micro-sparkles */}
              <motion.div 
                animate={{ scale: [0, 1, 0], opacity: [0, 0.6, 0], y: [0, -15], x: [0, 15] }}
                transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-4"
              >
                <Stars className="w-5 h-5 text-accent/30" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            animate={{ opacity: [0.02, 0.05, 0.02], scaleX: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-8 w-16 h-2 bg-pink-900/5 rounded-full blur-xl"
          />
        </div>
      );
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={week <= 7 ? 'h1' : week <= 15 ? 'h2' : 'baby'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
        >
          {getVisual()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function JourneyPage() {
  const { user } = useUser();
  
  // Calculate pregnancy progress helper (EDD-based, shared util)
  const getPregnancyStats = (dueDateStr: string | undefined) => {
    const p = computePregnancyFromDueDate(dueDateStr);
    if (!p) {
      return {
        currentWeek: 8,
        daysInWeek: 0,
        daysRemainingInWeek: 7,
        isDueDateSet: false,
      };
    }
    return {
      currentWeek: p.gestationalWeekNumber,
      daysInWeek: p.daysInWeek,
      daysRemainingInWeek: p.daysRemainingInWeek,
      isDueDateSet: true,
    };
  };

  const pregnancyStats = useMemo(() => getPregnancyStats(user.dueDate), [user.dueDate]);
  
  // Initialize with current week if due date is set, otherwise default to 8
  const [selectedWeek, setSelectedWeek] = useState(() => pregnancyStats.currentWeek);

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('pregnancy_checklist');
    return saved ? JSON.parse(saved) : {};
  });

  const data = useMemo(() => {
    const raw = getPregnancyData(selectedWeek);
    return user.language === 'kn' ? {
      ...raw,
      size: raw.sizeKn,
      development: raw.developmentKn,
      tips: raw.tipsKn,
      checklist: raw.checklistKn || []
    } : raw;
  }, [selectedWeek, user.language]);

  useEffect(() => {
    localStorage.setItem('pregnancy_checklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const weekKey = `week-${selectedWeek}`;
  const totalTasks = data.checklist.length;
  const completedTasks = data.checklist.filter(item => checkedItems[`${weekKey}-${item}`]).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const toggleItem = (item: string) => {
    const key = `${weekKey}-${item}`;
    const isNowChecked = !checkedItems[key];
    
    if (isNowChecked && completedTasks === totalTasks - 1) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E91E63', '#4CAF50', '#FF9800']
      });
    }

    setCheckedItems(prev => ({
      ...prev,
      [key]: isNowChecked
    }));
  };

  const getMotivationMessage = () => {
    if (progress === 100) return user.language === 'kn' ? "ವಾರದ ಗುರಿ ಮುಗಿದಿದೆ! ❤️" : "Weekly goals done! ❤️";
    if (progress >= 50) return user.language === 'kn' ? "ಉತ್ತಮ ಕೆಲಸ! 👍" : "Good work! 👍";
    return user.language === 'kn' ? "ಮಗುವಿನ ಕಾಳಜಿಗೆ ಈ ಲಿಸ್ಟ್ ಪೂರ್ಣಗೊಳಿಸಿ ✨" : "Complete list for baby's care ✨";
  };

  const weeks = Array.from({ length: 40 }, (_, i) => i + 1);

  // Allow all weeks to be selectable as requested (no locking)
  const maxSelectableWeek = 40;

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <BackButton label={user.language === 'kn' ? "ಹೋಮ್" : "Home"} />
      </div>

      <header className="space-y-1">
        <h1 className="text-lg font-display font-bold text-black">
          {user.language === 'kn' ? "ಗರ್ಭಧಾರಣೆಯ ಪಯಣ" : "Pregnancy Journey"}
        </h1>
        <div className="flex items-center gap-2">
           <CalendarDays className="w-3 h-3 text-primary" />
           <p className="text-black/60 text-[10px] font-bold uppercase tracking-wider">
             {user.language === 'kn' 
               ? `${Math.ceil(selectedWeek / 4)}ನೇ ತಿಂಗಳು • ${selectedWeek}ನೇ ವಾರ`
               : `Month ${Math.ceil(selectedWeek / 4)} • Week ${selectedWeek}`}
           </p>
        </div>
      </header>

      {/* Week Countdown Banner */}
      {pregnancyStats.isDueDateSet && selectedWeek === pregnancyStats.currentWeek && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-accent/10 border border-accent/20 p-3 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-accent text-white rounded-xl flex items-center justify-center font-bold shadow-sm text-sm">
               {pregnancyStats.daysRemainingInWeek}
             </div>
             <div>
                <p className="text-[9px] font-bold text-accent uppercase tracking-wider">
                  {user.language === 'kn' ? "ದಿನಗಳು ಬಾಕಿ" : "Days to Next Week"}
                </p>
                <p className="text-xs font-semibold text-black">
                  {user.language === 'kn' 
                    ? `ಮುಂದಿನ ವಾರಕ್ಕೆ ${pregnancyStats.daysRemainingInWeek} ದಿನಗಳು ಪ್ರವೇಶ`
                    : `Entering next week in ${pregnancyStats.daysRemainingInWeek} days`}
                </p>
             </div>
          </div>
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        </motion.div>
      )}

      {/* Week Selector Slider */}
      <div className="flex overflow-x-auto gap-3 py-4 no-scrollbar -mx-4 px-4 mask-fade-edges">
        {weeks.map((w) => {
          const isLocked = w > maxSelectableWeek;
          const isCurrent = w === pregnancyStats.currentWeek;
          
          return (
            <button
              key={w}
              disabled={isLocked}
              onClick={() => setSelectedWeek(w)}
              className={`flex-shrink-0 w-12 h-12 rounded-xl font-bold flex items-center justify-center transition-all relative text-sm ${
                selectedWeek === w 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : isLocked
                    ? 'bg-slate-100 text-slate-300 border-none cursor-not-allowed opacity-50'
                    : isCurrent
                      ? 'bg-accent/10 text-accent border-2 border-accent'
                      : 'bg-white text-black/40 border border-slate-100 hover:border-pink-200'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : w}
              {isCurrent && !isLocked && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white shadow-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
           <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">{user.language === 'kn' ? "ಪ್ರಗತಿ" : "Progress"}</p>
           <p className="text-[10px] font-bold text-black">{progress}% {user.language === 'kn' ? "ಮುಗಿದಿದೆ" : "Done"}</p>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             className="h-full bg-primary transition-all duration-1000 ease-out" 
           />
        </div>
        <div className="bg-pink-50/50 p-2.5 rounded-xl flex items-center gap-2.5 border border-pink-100/50">
           <Trophy className="w-3.5 h-3.5 text-primary" />
           <p className="text-[11px] font-bold text-black">{getMotivationMessage()}</p>
        </div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedWeek}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-5"
        >
          {/* Baby Development Card */}
          <Card className="rounded-[32px] border border-pink-50 shadow-sm overflow-hidden bg-white">
            <CardContent className="p-0">
               <div className="aspect-[4/3] bg-gradient-to-b from-pink-50 to-white flex items-center justify-center relative">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E91E63 1px, transparent 0)', backgroundSize: '20px 20px' }} />
                  
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-44 h-44 flex items-center justify-center z-0"
                  >
                     <BellyVisual week={selectedWeek} />
                  </motion.div>

                  <div className="absolute top-6 left-6 z-20 flex flex-col gap-0.5">
                     <span className="text-[9px] font-bold text-black uppercase tracking-[0.2em]">{user.language === 'kn' ? "ವಾರ" : "Week"}</span>
                     <span className="text-2xl font-black text-primary leading-none">{selectedWeek}</span>
                  </div>

                  <div className="absolute bottom-6 right-6 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl shadow-sm border border-pink-50 flex flex-col items-center">
                     <span className="text-[7px] font-black text-black/60 uppercase tracking-widest mb-0.5">
                        {user.language === 'kn' ? "ಮಗುವಿನ ಗಾತ್ರ" : "Baby Size"}
                     </span>
                     <span className="text-sm font-black text-yellow-500">{data.size}</span>
                  </div>
               </div>

               <div className="p-5 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className="p-1 bg-pink-100 rounded-lg">
                          <Stars className="w-3 h-3 text-primary" />
                       </div>
                       <h3 className="text-[8px] font-black text-black uppercase tracking-[0.2em]">
                          {user.language === 'kn' ? "ಬೆಳವಣಿಗೆ" : "Development"}
                       </h3>
                    </div>
                    <p className="text-base font-bold leading-tight text-black tracking-tight">
                      <span className="text-primary font-black">"</span>
                      {data.development}
                      <span className="text-primary font-black">"</span>
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div className="p-3 bg-pink-50/40 rounded-2xl border border-pink-100/50">
                        <p className="text-[7px] font-black text-black/60 uppercase tracking-widest mb-1">
                          {user.language === 'kn' ? "ಅಂದಾಜು ತೂಕ" : "Weight"}
                        </p>
                        <p className="text-sm font-black text-primary tracking-tight">{data.weight}</p>
                     </div>
                     <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-100/50">
                        <p className="text-[7px] font-black text-black/60 uppercase tracking-widest mb-1">
                          {user.language === 'kn' ? "ತ್ರೈಮಾಸಿಕ" : "Trimester"}
                        </p>
                        <p className="text-sm font-black text-primary tracking-tight">
                          {user.language === 'kn' ? `${data.trimester}ನೇ ತ್ರೈಮಾಸಿಕ` : `Trimester ${data.trimester}`}
                        </p>
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Checklist for this week */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black font-display text-lg text-black">
                {user.language === 'kn' ? "ಪರಿಶೀಲನಾ ಪಟ್ಟಿ" : "To-Do List"}
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-xl">
                 <span className="text-[9px] font-black text-black uppercase">
                    {completedTasks}/{totalTasks}
                 </span>
                 <Trophy className={`w-2.5 h-2.5 transition-colors ${progress === 100 ? 'text-primary' : 'text-slate-300'}`} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2.5">
              {data.checklist?.map((item, idx) => {
                const key = `${weekKey}-${item}`;
                const isChecked = !!checkedItems[key];
                return (
                  <button
                    key={`${selectedWeek}-${item}-${idx}`}
                    onClick={() => toggleItem(item)}
                    className={`flex items-start gap-2.5 p-3.5 rounded-xl border transition-all text-left relative overflow-hidden group
                      ${isChecked ? 'bg-slate-50 border-transparent opacity-70' : 'bg-white border-slate-100 shadow-sm hover:border-pink-200'}`}
                  >
                    <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-lg flex items-center justify-center transition-all border-2
                      ${isChecked ? 'bg-white text-primary border-primary shadow-sm' : 'bg-white text-slate-100 border-slate-100 group-hover:border-pink-200'}`}>
                      {isChecked ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Trophy className="w-3 h-3 fill-primary/10" /></motion.div> : <div className="w-1 h-1 rounded-full bg-slate-100" />}
                    </div>
                    <span className={`text-[13px] font-bold leading-tight transition-all 
                      ${isChecked ? 'text-black/40 line-through' : 'text-black'}`}>
                      {item}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Attractive Advice/Tips Card */}
          <section className="space-y-4 mb-28">
            <div className="flex items-center gap-2">
               <Stars className="w-3.5 h-3.5 text-primary" />
               <h3 className="font-black font-display text-base text-black">
                 {user.language === 'kn' ? "ಸಲಹೆ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ" : "Weekly Guidance"}
               </h3>
            </div>
            <Card className="rounded-[2rem] border border-pink-50 bg-white p-[1px] shadow-sm group">
               <CardContent className="bg-white p-5 rounded-[1.9rem] space-y-3 relative overflow-hidden">
                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors" />
                  
                  <div className="flex items-center justify-between relative z-10">
                     <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-pink-50 rounded-full flex items-center justify-center border border-pink-100">
                           <Info className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-black uppercase tracking-[0.15em] text-[9px] text-primary">{user.language === 'kn' ? "ತಜ್ಞರ ಸಲಹೆ" : "Expert Tips"}</span>
                     </div>
                  </div>

                  <div className="relative z-10 pl-2 border-l-3 border-pink-100">
                    <p className="text-[13px] text-black font-bold leading-relaxed italic">
                      <span className="text-primary font-black text-base">"</span>
                      {data.tips}
                      <span className="text-primary font-black text-base">"</span>
                    </p>
                  </div>

                  <div className="flex justify-end relative z-10">
                     <div className="flex gap-1">
                        <Heart className="w-3 h-3 text-primary fill-primary" />
                        <Heart className="w-3 h-3 text-primary/40" />
                        <Heart className="w-3 h-3 text-primary/20" />
                     </div>
                  </div>
               </CardContent>
            </Card>
          </section>
        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
}
