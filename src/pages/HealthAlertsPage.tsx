import { useState } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { AlertCircle, Trash2, Info, X, CheckCircle2, Sparkles, Heart } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { useCollection } from "@/src/hooks/useCollection";
import { formatDateDDMMYYYY } from "@/src/utils/text";
import { motion, AnimatePresence } from "motion/react";

interface HealthAlert {
  id: string;
  userId: string;
  timestamp: string;
  symptoms: string[];
  severity: string;
  notes?: string;
}

const dangerSigns = [
  { id: 'bleeding', label: { en: 'Vaginal bleeding', kn: 'ಯೋನಿ ರಕ್ತಸ್ರಾವ' }, severity: 'urgent' },
  { id: 'headache', label: { en: 'Severe headache + blurred vision', kn: 'ತೀವ್ರ ತಲೆನೋವು + ಮಂದ ದೃಷ್ಟಿ' }, severity: 'urgent' },
  { id: 'abdominal_pain', label: { en: 'Severe abdominal pain', kn: 'ತೀವ್ರ ಹೊಟ್ಟೆ ನೋವು' }, severity: 'urgent' },
  { id: 'no_movement', label: { en: 'No baby movement for hours', kn: 'ಮಗುವಿನ ಚಲನೆ ಇಲ್ಲದಿರುವುದು' }, severity: 'urgent' },
  { id: 'fluid_leak', label: { en: 'Sudden fluid leak', kn: 'ಹಠಾತ್ ದ್ರವ ಸೋರಿಕೆ' }, severity: 'urgent' },
  { id: 'fever', label: { en: 'Fever above 38.5°C', kn: 'ತೀವ್ರ ಜ್ವರ' }, severity: 'warning' },
  { id: 'swelling', label: { en: 'Sudden swelling face/hands', kn: 'ಮುಖ ಅಥವಾ ಕೈಗಳಲ್ಲಿ ತೀವ್ರ ಊತ' }, severity: 'warning' },
  { id: 'vomiting', label: { en: 'Cannot keep food/water down', kn: 'ಆಹಾರ ಅಥವಾ ನೀರು ಸೇವಿಸಲು ಸಾಧ್ಯವಾಗದಿರುವುದು' }, severity: 'warning' },
  { id: 'burning_urination', label: { en: 'Burning while urinating', kn: 'ಮೂತ್ರ ವಿಸರ್ಜನೆಯ ಸಮಯದಲ್ಲಿ ಉರಿ' }, severity: 'normal' },
  { id: 'backache', label: { en: 'Mild backache', kn: 'ಸೌಮ್ಯ ಬೆನ್ನುನೋವು' }, severity: 'normal' },
  { id: 'tiredness', label: { en: 'Tiredness', kn: 'ದಿನನಿತ್ಯದ ಆಯಾಸ' }, severity: 'normal' },
];

export default function HealthAlertsPage() {
  const { user, firebaseUser } = useUser();
  const lang = user.language || 'en';
  const [symptoms, setSymptoms] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [viewingAlert, setViewingAlert] = useState<HealthAlert | null>(null);
  const { data: alerts, add: addAlert, remove: removeAlert } = useCollection<HealthAlert>("health_alerts", []);

  const t = {
    title: lang === 'kn' ? "ಆರೋಗ್ಯ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು" : "Health Alerts",
    subtitle: lang === 'kn' ? "ನಿಮ್ಮ ದಿನನಿತ್ಯದ ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಿ ಮತ್ತು ವೈದ್ಯರಿಗೆ ತೋರಿಸಿ." : "Log daily symptoms to share with your doctor during check-ups.",
    symptomHeader: lang === 'kn' ? "ಲಕ್ಷಣಗಳ ತಪಾಸಣೆ" : "Symptom check",
    symptomSub: lang === 'kn' ? "ನಿಮ್ಮಲ್ಲಿರುವ ಯಾವುದೇ ಲಕ್ಷಣಗಳನ್ನು ಆರಿಸಿ." : "Tap any symptoms you notice today.",
    startOver: lang === 'kn' ? "ಅಳಿಸಿ" : "Reset",
    logSymptoms: lang === 'kn' ? "ಉಳಿಸಿ" : "SAVE",
    notesPlaceholder: lang === 'kn' ? "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ನೀಡಿ (ಉದಾ: ಇದು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು?)" : "Add more details if needed...",
    dashboard: lang === 'kn' ? "ಹಿಂದಕ್ಕೆ" : "Back",
    reportSaved: lang === 'kn' ? "ವೈದ್ಯಕೀಯ ಜರ್ನಲ್ ಉಳಿಸಲಾಗಿದೆ!" : "Journal entry saved!",
    history: lang === 'kn' ? "ಹಿಂದಿನ ದಾಖಲೆಗಳು" : "Medical Records",
    historyDesc: lang === 'kn' ? "ಮುಂದಿನ ವೈದ್ಯಕೀಯ ತಪಾಸಣೆಯ ಸಮಯದಲ್ಲಿ ಇವುಗಳನ್ನು ತಿಳಿಸಿ." : "Logs for your doctor's next visit.",
    noSymptoms: lang === 'kn' ? "ಯಾವುದೇ ಚಿಹ್ನೆಗಳಿಲ್ಲ" : "No symptoms noted",
    details: lang === 'kn' ? "ವಿವರಗಳು" : "Entry Details",
    deleteConfirm: lang === 'kn' ? "ಇದನ್ನು ಅಳಿಸುವುದೇ?" : "Delete this entry?",
    additionalNotes: lang === 'kn' ? "ಹೆಚ್ಚುವರಿ ಮಾಹಿತಿ" : "Additional Notes",
  };

  const toggleSymptom = (id: string) => {
    setSymptoms(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveAssessment = async () => {
    const activeSymptoms = Object.keys(symptoms).filter(k => symptoms[k]);
    
    setIsSaving(true);
    try {
      const urgent = activeSymptoms.some(id => dangerSigns.find(s => s.id === id)?.severity === 'urgent');
      await addAlert({
        id: Date.now().toString(),
        userId: firebaseUser?.uid || 'local',
        timestamp: new Date().toISOString(),
        symptoms: activeSymptoms,
        severity: urgent ? 'emergency' : 'normal',
        notes: notes.trim() || ""
      });
      
      setSymptoms({}); 
      setNotes("");
      const toast = document.createElement('div');
      toast.className = "fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#212121] text-white px-8 py-3 rounded-2xl font-bold shadow-2xl z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300 border border-white/10";
      toast.innerText = t.reportSaved;
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.classList.add('animate-out', 'fade-out', 'slide-out-to-bottom-4');
        setTimeout(() => toast.remove(), 500);
      }, 2000);
    } catch (err) {
      console.error("Failed to save report", err);
    } finally {
      setIsSaving(false);
    }
  };

  const getSymptomLabel = (id: string) => {
    return dangerSigns.find(s => s.id === id)?.label[lang as keyof typeof dangerSigns[0]['label']] || id;
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32 font-sans overflow-x-hidden">
      <PageContainer className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mt-2">
          <BackButton label={t.dashboard} />
        </div>

        <header className="space-y-1">
          <h1 className="text-lg font-display font-bold text-black">
            {t.title}
          </h1>
          <div className="flex items-center gap-2">
             <div className="p-1 bg-pink-50 rounded-lg">
                <AlertCircle className="w-3 h-3 text-primary" />
             </div>
             <p className="text-black/60 text-[11px] font-bold uppercase tracking-wider leading-relaxed">
               {t.subtitle}
             </p>
          </div>
        </header>

        <Card className="rounded-[28px] border border-pink-50 shadow-sm bg-white overflow-hidden">
          <div className="p-5 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-pink-100 rounded-lg">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
                <h3 className="font-bold text-[9px] text-black uppercase tracking-[0.1em]">{t.symptomHeader}</h3>
              </div>
              <p className="text-slate-400 text-[11px] font-medium pl-1">{t.symptomSub}</p>
            </div>

            <div className="space-y-2">
              {dangerSigns.map((sign) => {
                const isSelected = symptoms[sign.id];
                return (
                  <button
                    key={sign.id}
                    onClick={() => toggleSymptom(sign.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left relative overflow-hidden group ${
                      isSelected 
                        ? 'bg-pink-50/30 border-pink-100 ring-1 ring-pink-50' 
                        : 'bg-white border-slate-100 hover:border-pink-100'
                    }`}
                  >
                    <span className={`text-[13px] font-bold transition-colors ${isSelected ? 'text-[#E91E63]' : 'text-slate-700'}`}>
                      {sign.label[lang as keyof typeof sign.label]}
                    </span>
                    <div className={`w-4.5 h-4.5 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary bg-primary' : 'border-slate-200 bg-white group-hover:border-primary/30'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 px-1">
                <Info className="w-3 h-3 text-slate-400" />
                <p className="text-[9px] font-bold text-black uppercase tracking-[0.1em]">{t.additionalNotes}</p>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t.notesPlaceholder}
                className="w-full p-4 rounded-xl bg-slate-50/50 border border-slate-100 text-[13px] text-slate-700 min-h-[90px] focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-slate-300 font-bold"
              />
            </div>

              <div className="flex gap-3 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSymptoms({});
                    setNotes("");
                  }}
                  className="flex-1 rounded-2xl h-12 text-primary font-bold text-[11px] uppercase tracking-wider border-2 border-primary bg-white hover:bg-pink-50 transition-all active:scale-[0.98]"
                >
                  {t.startOver}
                </Button>
                <Button 
                  variant="outline"
                  onClick={saveAssessment}
                  disabled={isSaving}
                  className="flex-1 rounded-2xl h-12 text-primary font-bold text-[11px] uppercase tracking-wider border-2 border-primary bg-white hover:bg-pink-50 shadow-lg shadow-primary/5 transition-all active:scale-[0.98]"
                >
                  {isSaving ? "Saving..." : t.logSymptoms}
                </Button>
              </div>
          </div>
        </Card>

        {alerts && alerts.length > 0 && (
          <section className="space-y-4 mb-8">
            <div className="px-1 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-black uppercase text-[10px] tracking-[0.1em]">{t.history}</h3>
                <p className="text-[12px] text-slate-400 font-medium mt-0.5">{t.historyDesc}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm shrink-0">
                 <span className="text-[10px] font-bold text-primary uppercase whitespace-nowrap">
                    {alerts.length} {alerts.length === 1 ? 'Entry' : 'Entries'}
                 </span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((alert) => (
                <Card key={alert.id} className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between hover:border-pink-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${alert.severity === 'emergency' ? 'bg-red-50 text-red-500' : 'bg-[#4CAF50]/10 text-[#4CAF50]'}`}>
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-black">
                        {alert.severity === 'emergency' ? (lang === 'kn' ? "ತುರ್ತು ವರದಿ" : "Urgent Log") : (lang === 'kn' ? "ದೈನಂದಿನ ದಾಖಲೆ" : "Routine Log")}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">
                        {formatDateDDMMYYYY(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setViewingAlert(alert)}
                      className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#E91E63] hover:bg-pink-50 transition-all active:scale-90"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAlert(alert.id);
                      }}
                      className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-100 transition-all active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </PageContainer>

      {/* Info Modal */}
      <AnimatePresence>
        {viewingAlert && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-sm overflow-hidden shadow-2xl relative border border-slate-100"
            >
              <button 
                onClick={() => setViewingAlert(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-[#212121] active:scale-90 transition-all z-10 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-8 pt-12 space-y-7 text-center">
                <header className="space-y-1">
                  <p className="text-xl font-black text-[#212121] tracking-tight">
                    {formatDateDDMMYYYY(viewingAlert.timestamp)}
                  </p>
                </header>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E91E63]" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-[#212121]">
                      Symptoms Shared
                    </h4>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {viewingAlert.symptoms.length > 0 ? (
                      viewingAlert.symptoms.map((s, i) => (
                        <div key={i} className="px-4 py-2 rounded-2xl bg-pink-50/50 border border-pink-100 flex items-center gap-2">
                          <Heart className="w-3 h-3 text-[#E91E63] fill-[#E91E63]/20" />
                          <span className="text-sm font-bold text-[#212121]">{getSymptomLabel(s)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 rounded-2xl bg-slate-50 text-slate-400 text-xs font-bold italic w-full text-center border border-slate-100">
                        {t.noSymptoms}
                      </div>
                    )}
                  </div>
                </div>

                {viewingAlert.notes && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <Info className="w-4 h-4 text-[#E91E63]" />
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-[#212121]">
                         Additional Details
                       </h4>
                    </div>
                    <div className="p-5 rounded-[28px] bg-slate-50 border border-slate-100 text-[#212121] text-sm font-bold leading-relaxed max-h-[200px] overflow-y-auto">
                      <span className="text-pink-300 text-xl font-serif">"</span>
                      {viewingAlert.notes}
                      <span className="text-pink-300 text-xl font-serif">"</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
