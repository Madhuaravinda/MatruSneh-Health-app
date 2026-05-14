import { useState, useEffect } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { useCollection } from "@/src/hooks/useCollection";
import { useUser } from "@/src/contexts/UserContext";
import { formatDateDDMMYYYY } from "@/src/utils/text";
import { ensureNotificationPermission, parseAppointmentAt, scheduleAppointmentReminders } from "@/src/utils/appointmentNotifications";
import { Capacitor } from "@capacitor/core";
import { Calendar, Plus, Trash2, CheckCircle2, X, Bell, BellOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";


interface Appointment {
  id: string;
  userId: string;
  type: string;
  provider?: string;
  phone?: string;
  date: string;
  time: string;
  location: string;
  reminders: boolean;
  completed: boolean;
}

export default function AppointmentsPage() {
  const { user, firebaseUser } = useUser();
  const lang = user.language || 'en';
  const { data: appointments, add: addAppt, remove: removeAppt, update: updateAppt } = useCollection<Appointment>("appointments", []);
  
  useEffect(() => {
    ensureNotificationPermission();
  }, []);

  useEffect(() => {
    // Schedule notifications whenever appointments change
    if (appointments.length > 0) {
      scheduleAppointmentReminders(appointments, lang);
    }
  }, [appointments, lang]);

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [isAdding, setIsAdding] = useState(false);
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({
    type: '',
    date: '',
    time: '',
    reminders: true,
    completed: false
  });

  const t = {
    title: lang === 'kn' ? "ನೇಮಕಾತಿಗಳು" : "Appointments",
    back: lang === 'kn' ? "ಹಿಂದಕ್ಕೆ" : "Back",
    nextIn: lang === 'kn' ? "ಮುಂದಿನದು" : "NEXT IN",
    days: lang === 'kn' ? "ದಿನಗಳು" : "DAYS",
    hours: lang === 'kn' ? "ಗಂಟೆಗಳು" : "HOURS",
    minutes: lang === 'kn' ? "ನಿಮಿಷಗಳು" : "MINUTES",
    upcoming: lang === 'kn' ? "ಮುಂಬರುವ" : "Upcoming",
    past: lang === 'kn' ? "ಹಿಂದಿನ" : "Past",
    addAppt: lang === 'kn' ? "ನೇಮಕಾತಿ ಸೇರಿಸಿ" : "Add appointment",
    whatToBring: lang === 'kn' ? "ಏನು ತರಬೇಕು" : "What to bring",
    noAppts: lang === 'kn' ? "ಇನ್ನೂ ಯಾವುದೇ ನೇಮಕಾತಿಗಳಿಲ್ಲ" : "No appointments yet",
    save: lang === 'kn' ? "ಉಳಿಸಿ" : "Save",
    typePlaceholder: lang === 'kn' ? "ಉದಾಹರಣೆ: ರಕ್ತ ಪರೀಕ್ಷೆ" : "e.g. blood test",
    appointmentType: lang === 'kn' ? "ನೇಮಕಾತಿ ವಿಧ" : "Appointment type",
    dateLabel: lang === 'kn' ? "ದಿನಾಂಕ" : "Date",
    timeLabel: lang === 'kn' ? "ಸಮಯ" : "Time",
    setReminder: lang === 'kn' ? "ಜ್ಞಾಪನೆ ಹೊಂದಿಸಿ" : "Set Reminder",
    items: lang === 'kn' ? [
      "ತಾಯಿ ಕಾರ್ಡ್ / ಆರೋಗ್ಯ ಕಾರ್ಡ್",
      "ಇತ್ತೀಚಿನ ವರದಿಗಳು",
      "ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು",
      "ನೀರಿನ ಬಾಟಲಿ"
    ] : [
      "Health card",
      "Latest reports",
      "Questions for doctor",
      "Water bottle"
    ]
  };

  const addAppointment = async () => {
    if (!newAppt.date || !newAppt.time || !newAppt.type) {
      alert(lang === 'kn' ? "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please fill in all details");
      return;
    }
    const wantReminders = newAppt.reminders !== false;
    if (wantReminders) {
      const perm = await ensureNotificationPermission();
      if (perm !== "granted") {
        alert(
          lang === "kn"
            ? "ಜ್ಞಾಪನೆಗಳಿಗೆ ಅನುಮತಿ ನೀಡಿ: ಫೋನ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು → ಅಪ್ಲಿಕೇಶನ್‌ಗಳು → MatruSneh → ಅಧಿಸೂಚನೆಗಳು."
            : Capacitor.isNativePlatform()
              ? "Allow notifications for MatruSneh: Android Settings → Apps → MatruSneh → Notifications."
              : "Allow notifications in your browser settings to get appointment reminders."
        );
      }
    }
    const appt: Appointment = {
      id: Date.now().toString(),
      userId: firebaseUser?.uid || 'local',
      type: newAppt.type,
      provider: '',
      phone: '',
      date: newAppt.date,
      time: newAppt.time,
      location: '',
      reminders: wantReminders,
      completed: false,
    };
    addAppt(appt);
    
    // Schedule notifications for all appointments
    if (wantReminders) {
      scheduleAppointmentReminders([...appointments, appt], lang);
    }
    
    setIsAdding(false);
    setNewAppt({
      type: '',
      date: '',
      time: '',
      reminders: true,
      completed: false
    });
  };

  const upcomingAppts = appointments.filter(a => !a.completed).sort((a, b) => {
    const ta = parseAppointmentAt(a.date, a.time)?.getTime() ?? 0;
    const tb = parseAppointmentAt(b.date, b.time)?.getTime() ?? 0;
    return ta - tb;
  });
  const pastAppts = appointments.filter(a => a.completed).sort((a, b) => {
    const ta = parseAppointmentAt(a.date, a.time)?.getTime() ?? 0;
    const tb = parseAppointmentAt(b.date, b.time)?.getTime() ?? 0;
    return tb - ta;
  });
  const nowMs = Date.now();
  const nextAppt =
    upcomingAppts.find((a) => {
      const t = parseAppointmentAt(a.date, a.time);
      return t !== null && t.getTime() > nowMs;
    }) ?? null;

  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0 });

  useEffect(() => {
    if (!nextAppt) return;

    const tick = () => {
      const target = parseAppointmentAt(nextAppt.date, nextAppt.time);
      if (!target) {
        setTimeLeft({ d: 0, h: 0, m: 0 });
        return;
      }
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0 });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [nextAppt]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 font-sans">
      <PageContainer>
        <div className="mt-4 mb-6">
          <BackButton label={t.back} />
          <h1 className="text-2xl font-display font-bold text-[#212121] mt-6 tracking-tight">
            {t.title}
          </h1>
        </div>

        {/* Next Appointment Card */}
        {nextAppt && (
          <Card className="rounded-[40px] bg-primary text-white p-8 mb-8 border-none shadow-xl shadow-primary/20">
             <span className="text-[10px] font-bold tracking-widest opacity-80">{t.nextIn}</span>
             <div className="flex gap-6 mt-2 mb-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{timeLeft.d}</span>
                  <span className="text-[10px] font-bold opacity-60">{t.days}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{timeLeft.h}</span>
                  <span className="text-[10px] font-bold opacity-60">{t.hours}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold">{timeLeft.m}</span>
                  <span className="text-[10px] font-bold opacity-60">{t.minutes}</span>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 opacity-80" />
                <span className="font-bold">{nextAppt.type}</span>
             </div>
             <p className="text-sm opacity-80 ml-8 mt-1">
                {formatDateDDMMYYYY(nextAppt.date)}, {(() => {
                  const t = parseAppointmentAt(nextAppt.date, nextAppt.time);
                  return t
                    ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : nextAppt.time;
                })()}
             </p>
          </Card>
        )}

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 px-1">
           <h2 className="text-lg font-bold text-slate-800 tracking-tight">{lang === 'kn' ? "ಮುಂಬರುವ" : "Upcoming"}</h2>
           <Button 
            variant="outline"
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="rounded-2xl border-2 border-primary text-primary bg-white hover:bg-pink-50 shadow-md shadow-primary/5 px-4 py-6 font-bold flex items-center gap-2 active:scale-95 transition-all"
           >
             <Plus className="w-4 h-4" /> {t.addAppt}
           </Button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-200/50 p-1 rounded-2xl flex mb-6">
           <button 
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
           >
             {t.upcoming}
           </button>
           <button 
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'past' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
           >
             {t.past}
           </button>
        </div>

        {/* Appointment List */}
        <div className="space-y-4 mb-8">
           {(activeTab === 'upcoming' ? upcomingAppts : pastAppts).length === 0 ? (
             <div className="py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-[40px]">
                <Calendar className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-sm font-bold">{t.noAppts}</span>
             </div>
           ) : (
             (activeTab === 'upcoming' ? upcomingAppts : pastAppts).map(appt => (
                <Card key={appt.id} className="rounded-3xl p-6 bg-white border-none shadow-sm relative group">
                   <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-slate-800 leading-tight capitalize">{appt.type}</h4>
                        <p className="text-sm text-slate-400 font-medium tracking-tight">
                           {formatDateDDMMYYYY(appt.date)}, {(() => {
                             const t = parseAppointmentAt(appt.date, appt.time);
                             return t
                               ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                               : appt.time;
                           })()}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                         <button 
                          onClick={() => removeAppt(appt.id)}
                          className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all text-red-400"
                         >
                            <Trash2 className="w-4 h-4" />
                         </button>
                         {activeTab === 'upcoming' && (
                            <button 
                              onClick={() => updateAppt({ ...appt, completed: true })}
                              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 hover:bg-green-50 hover:border-green-100 transition-all text-green-500"
                            >
                               <CheckCircle2 className="w-4 h-4" />
                            </button>
                         )}
                      </div>
                   </div>
                </Card>
             ))
           )}
        </div>
      </PageContainer>

      {/* Add Appointment Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAdding(false)}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />
             <motion.div
               initial={{ y: "100%" }}
               animate={{ y: 0 }}
               exit={{ y: "100%" }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               className="relative w-full max-w-lg bg-white rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                         <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">{t.addAppt}</h3>
                   </div>
                   <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-gray-100 rounded-full transition-all">
                      <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>

                     <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.appointmentType}</label>
                      <input 
                        type="text" 
                        placeholder={t.typePlaceholder}
                        value={newAppt.type}
                        onChange={e => setNewAppt({ ...newAppt, type: e.target.value })}
                        className="w-full p-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-slate-800"
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.dateLabel}</label>
                        <input 
                          type="date" 
                          value={newAppt.date}
                          onChange={e => setNewAppt({ ...newAppt, date: e.target.value })}
                          className="w-full p-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-slate-800"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.timeLabel}</label>
                        <input 
                          type="time" 
                          value={newAppt.time}
                          onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                          className="w-full p-3.5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm text-slate-800"
                        />
                      </div>
                   </div>

                   <button
                     type="button"
                     onClick={() =>
                       setNewAppt({ ...newAppt, reminders: !(newAppt.reminders !== false) })
                     }
                     className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border-2 transition-all ${
                       newAppt.reminders !== false
                         ? "border-primary/30 bg-primary/5 text-slate-800"
                         : "border-slate-100 bg-slate-50 text-slate-500"
                     }`}
                   >
                     <span className="flex items-center gap-3">
                       {newAppt.reminders !== false ? (
                         <Bell className="w-5 h-5 text-primary shrink-0" />
                       ) : (
                         <BellOff className="w-5 h-5 shrink-0" />
                       )}
                       <span className="text-left font-bold text-sm">{t.setReminder}</span>
                     </span>
                     <span
                       className={`text-[10px] font-black uppercase tracking-wider ${
                         newAppt.reminders !== false ? "text-primary" : "text-slate-400"
                       }`}
                     >
                       {newAppt.reminders !== false
                         ? lang === "kn"
                           ? "ಆನ್"
                           : "On"
                         : lang === "kn"
                           ? "ಆಫ್"
                           : "Off"}
                     </span>
                   </button>

                   <Button 
                    variant="primary"
                    onClick={addAppointment}
                    className="w-full h-14 rounded-2xl font-bold text-base shadow-lg shadow-primary/20 mb-2 active:scale-[0.98] text-white"
                   >
                     {t.save}
                   </Button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
