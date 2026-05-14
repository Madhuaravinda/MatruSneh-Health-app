import React, { useState } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { ProgressBar } from "@/src/components/ui/ProgressBar";
import { CheckCircle2, Apple, Soup, Beef, Milk, Carrot } from "lucide-react";
import { useDoc } from "@/src/hooks/useDoc";
import { useUser } from "@/src/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const categories = [
  { 
    id: 'ragi', 
    label: { en: 'Ragi / Grains', kn: 'ರಾಗಿ / ದವಸ ಧಾನ್ಯ' }, 
    examples: { en: 'Examples: Ragi mudde, rice, jowar roti', kn: 'ಉದಾಹರಣೆ: ರಾಗಿ ಮುದ್ದೆ, ಅಕ್ಕಿ, ಜೋಳದ ರೊಟ್ಟಿ' },
    icon: Soup, 
    color: '#EAB308', // Yellow
    bg: 'bg-yellow-50',
    fillColor: '#EAB308'
  },
  { 
    id: 'greens', 
    label: { en: 'Greens & Veggies', kn: 'ಹಸಿರು ಸೊಪ್ಪು ಮತ್ತು ತರಕಾರಿ' }, 
    examples: { en: 'Examples: Palak, methi, drumstick leaves', kn: 'ಉದಾಹರಣೆ: ಪಾಲಕ್, ಮೆಂತ್ಯ, ನುಗ್ಗೆ ಸೊಪ್ಪು' },
    icon: Carrot, 
    color: '#22C55E', // Green
    bg: 'bg-green-50',
    fillColor: '#22C55E'
  },
  { 
    id: 'pulses', 
    label: { en: 'Pulses & Dal', kn: 'ಬೇಳೆಕಾಳುಗಳು' }, 
    examples: { en: 'Examples: Toor dal, moong, chana', kn: 'ಉದಾಹರಣೆ: ತೊಗರಿ ಬೇಳೆ, ಹೆಸರು ಕಾಳು, ಕಡಲೆ' },
    icon: Beef, 
    color: '#8B5CF6', // Purple
    bg: 'bg-purple-50',
    fillColor: '#8B5CF6'
  },
  { 
    id: 'dairy', 
    label: { en: 'Milk & Curd', kn: 'ಹಾಲು ಮತ್ತು ಮೊಸರು' }, 
    examples: { en: 'Examples: Milk, curd, paneer', kn: 'ಉದಾಹರಣೆ: ಹಾಲು, ಮೊಸರು, ಪನೀರ್' },
    icon: Milk, 
    color: '#3B82F6', // Blue
    bg: 'bg-blue-50',
    fillColor: '#3B82F6'
  },
  { 
    id: 'fruits', 
    label: { en: 'Fruits', kn: 'ಹಣ್ಣುಗಳು' }, 
    examples: { en: 'Examples: Banana, papaya, guava', kn: 'ಉದಾಹರಣೆ: ಬಾಳೆಹಣ್ಣು, ಪಪ್ಪಾಯಿ, ಸೀಬೆಹಣ್ಣು' },
    icon: Apple, 
    color: '#F97316', // Orange
    bg: 'bg-orange-50',
    fillColor: '#F97316'
  },
];

export default function NutritionPage() {
  const { user, firebaseUser } = useUser();
  const navigate = useNavigate();
  const lang = user.language || 'en';
  const today = new Date().toISOString().split('T')[0];
  const path = firebaseUser ? `users/${firebaseUser.uid}/nutrition/${today}` : null;
  const { data: log, update: updateLog } = useDoc<Record<string, boolean>>(path, {});
  
  const [localLog, setLocalLog] = useState<Record<string, boolean>>(() => {
    const item = localStorage.getItem('daily_nutrition');
    return item ? JSON.parse(item) : {};
  });

  const t = {
    title: lang === 'kn' ? "ಪೌಷ್ಟಿಕ ಆಹಾರ ಟ್ರ್ಯಾಕರ್" : "Nutrition Tracker",
    todaysPlate: lang === 'kn' ? "ಇಂದಿನ ಪ್ಲೇಟ್" : "Today's plate",
    completed: lang === 'kn' ? "ಪೂರ್ಣಗೊಂಡಿದೆ" : "completed",
    back: lang === 'kn' ? "ಹಿಂದಕ್ಕೆ" : "Back",
  };

  const checkedItems = firebaseUser ? log : localLog;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = (completedCount / categories.length) * 100;

  const toggleItem = (id: string) => {
    const newVal = { ...checkedItems, [id]: !checkedItems[id] };
    if (firebaseUser) {
      updateLog(newVal);
    } else {
      setLocalLog(newVal);
      localStorage.setItem('daily_nutrition', JSON.stringify(newVal));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24 font-sans">
      <PageContainer>
        <div className="mt-4 mb-6">
          <BackButton label={t.back} onClick={() => navigate("/")} />
          <h2 className="text-lg font-display font-bold text-[#212121] mt-4 tracking-tight">
            {t.title}
          </h2>
        </div>

        {/* Today's Plate Card */}
        <Card className="rounded-[28px] bg-white border-none shadow-sm p-5 mb-6 relative overflow-hidden">
          <h3 className="text-xs font-semibold text-slate-500 mb-4 tracking-wider uppercase">{t.todaysPlate}</h3>
          
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28">
               <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {categories.map((cat, idx) => {
                    const isChecked = checkedItems[cat.id];
                    const angle = 72; 
                    const startAngle = idx * angle;
                    const r = 40;
                    const c = 50;
                    
                    const x1 = c + r * Math.cos(startAngle * Math.PI / 180);
                    const y1 = c + r * Math.sin(startAngle * Math.PI / 180);
                    const x2 = c + r * Math.cos((startAngle + angle) * Math.PI / 180);
                    const y2 = c + r * Math.sin((startAngle + angle) * Math.PI / 180);
                    
                    return (
                      <path
                        key={cat.id}
                        d={`M ${c} ${c} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
                        fill={isChecked ? cat.fillColor : '#f1f5f9'}
                        stroke="#fff"
                        strokeWidth="1"
                        className="transition-all duration-500"
                      />
                    )
                  })}
               </svg>
            </div>
            
            <div className="flex-1 space-y-1">
               <div className="flex items-baseline gap-1">
                 <span className="text-xl font-bold text-slate-800">{Math.round(progress)}%</span>
               </div>
               <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{completedCount}/5 {t.completed}</p>
               <div className="pt-3">
                  <ProgressBar value={progress} colorClassName="bg-primary" className="h-1.5 rounded-full bg-slate-100" />
               </div>
            </div>
          </div>
        </Card>

        {/* Checklist */}
        <div className="space-y-3">
          {categories.map((item) => (
            <button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-[24px] border border-slate-100 transition-all text-left bg-white shadow-sm hover:border-primary/20 ${
                checkedItems[item.id] ? 'ring-1 ring-primary/10 border-primary/20' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg} border border-gray-100/30`}>
                  <item.icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <h4 className="font-bold text-[15px] text-slate-800 leading-tight">
                    {item.label[lang as keyof typeof item.label]}
                  </h4>
                  <p className="text-slate-400 text-[10px] font-bold mt-0.5 leading-tight">
                    {item.examples[lang as keyof typeof item.examples]}
                  </p>
                </div>
              </div>
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                checkedItems[item.id] ? 'bg-primary border-primary shadow-md shadow-primary/10' : 'bg-white border-gray-200'
              }`}>
                {checkedItems[item.id] && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </PageContainer>
    </div>
  );
}
