import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '@/src/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle2, Heart, Languages, User, Activity, LogIn } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { auth } from '@/src/lib/firebase';

interface OnboardingStep {
  id: string;
  title: string;
  titleKn?: string;
  description?: string;
  descriptionKn?: string;
  image?: string;
}

const steps: OnboardingStep[] = [
  {
    id: 'language',
    title: 'Choose Your Language',
    titleKn: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
  },
  {
    id: 'welcome',
    title: 'Matru-Sneh Health',
    titleKn: 'ಮಾತೃ-ಸ್ನೇಹ್ ಆರೋಗ್ಯ',
    description: 'A pocket pregnancy guide designed to empower rural mothers.',
    descriptionKn: 'ಗ್ರಾಮೀಣ ತಾಯಂದಿರಿಗಾಗಿ ವಿನ್ಯಾಸಗೊಳಿಸಲಾದ ಗರ್ಭಧಾರಣೆಯ ಮಾರ್ಗದರ್ಶಿ.',
    image: 'https://images.unsplash.com/photo-1559734840-f9509ee5677f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'personal',
    title: 'About You',
    titleKn: 'ನಿಮ್ಮ ಬಗ್ಗೆ',
    description: 'Let us get to know you basic details.',
    descriptionKn: 'ನಿಮ್ಮ ಬಗ್ಗೆ ಕೆಲವು ಮೂಲಭೂತ ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.',
  },
  {
    id: 'health',
    title: 'Health Information',
    titleKn: 'ಆರೋಗ್ಯ ಮಾಹಾತ',
    description: 'Your pregnancy health details and due date.',
    descriptionKn: 'ನಿಮ್ಮ ಗರ್ಭಾರಣೆ ವಿವರಗಳು ಮತ್ತು ಹಾಗಿದಿನಾಂಕ.',
    image: 'https://images.unsplash.com/photo-1571019672649-9ae2ea12d7d1?q=80&w=600&auto=format&fit=crop',
  },
];

const HEALTH_STEP_INDEX = steps.findIndex((s) => s.id === 'health');

export default function OnboardingPage() {
  const { user, setUser, signIn, authError } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localHint, setLocalHint] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...user });
  const [prevUser, setPrevUser] = useState(user);
  const navigate = useNavigate();

  // Sync formData with context user if context changes (e.g. from login)
  if (user !== prevUser) {
    setPrevUser(user);
    setFormData(prev => ({ ...prev, ...user }));
  }

  const handleContinueOffline = () => {
    setLocalHint(null);
    setCurrentStep(HEALTH_STEP_INDEX);
  };

  const validators = {
    personal: () => formData.name?.trim().length > 1 && formData.age && formData.dob,
    health: () => formData.bloodGroup && formData.dueDate,
  };

  const currentStepId = steps[currentStep].id;
  
  const canProceed = () => {
    if (currentStepId === 'personal') return validators.personal();
    if (currentStepId === 'health') return validators.health();
    return true;
  };

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setUser({ 
        ...formData,
        onboardingComplete: true, 
        profileSetupComplete: true 
      });
      navigate('/');
    }
  }, [currentStep, setUser, navigate, formData]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const step = steps[currentStep];
  const isKn = formData.language === 'kn';

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-primary/10">
      {/* Wave Header Section */}
      <div className="relative h-[38vh] bg-primary overflow-hidden shrink-0">
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="white" />
            <path d="M0,20 C40,40 60,10 100,30 L100,100 L0,100 Z" fill="white" fillOpacity="0.5" />
          </svg>
        </div>

        {/* Step Progress Dots */}
        <div className="absolute top-10 left-0 right-0 flex justify-center gap-2 px-12 z-20">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-white w-8' : 'bg-white/30 w-2'}`} 
            />
          ))}
        </div>

        {/* Professional Logo Placeholder / Decorative Icon */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
           <motion.div 
             key={step.id + '_icon'}
             initial={{ scale: 0.8, opacity: 0, y: 10 }}
             animate={{ scale: 1, opacity: 1, y: 0 }}
             className="w-28 h-28 bg-white/10 backdrop-blur-xl rounded-[40px] flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden group"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              {step.id === 'language' && <Languages className="w-12 h-12 text-white relative z-10" />}
              {step.id === 'welcome' && <Heart className="w-12 h-12 text-white fill-white relative z-10" />}
              {step.id === 'personal' && <User className="w-12 h-12 text-white fill-white relative z-10" />}
              {step.id === 'health' && <Activity className="w-12 h-12 text-white relative z-10" />}
              {step.id === 'signIn' && <LogIn className="w-12 h-12 text-white relative z-10" />}
           </motion.div>
        </div>

        {/* Bottom Curve */}
        <div className="absolute inset-x-0 bottom-0">
          <svg viewBox="0 0 1440 320" className="w-full h-auto translate-y-2">
            <path fill="#ffffff" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,165.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-10 relative z-10 -mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col pt-8"
          >
            <div className="mb-10 text-center sm:text-left">
              <h1 className="text-2xl font-display font-bold text-slate-800 tracking-tight leading-tight">
                {isKn && step.titleKn ? step.titleKn : step.title}
              </h1>
              {step.description && (
                <p className="text-[13px] font-medium text-slate-400 mt-2 leading-relaxed">
                  {isKn && step.descriptionKn ? step.descriptionKn : step.description}
                </p>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              {step.id === 'language' && (
                <div className="grid grid-cols-1 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, language: 'kn' })}
                    className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all group ${formData.language === 'kn' ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-slate-50 border-transparent text-slate-500 active:scale-[0.98]'}`}
                  >
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">ಪ್ರಾಧಾನ್ಯತೆ</div>
                      <div className="text-lg font-bold">ಕನ್ನಡ</div>
                    </div>
                    {formData.language === 'kn' ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, language: 'en' })}
                    className={`p-5 rounded-3xl border-2 flex items-center justify-between transition-all group ${formData.language === 'en' ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-slate-50 border-transparent text-slate-500 active:scale-[0.98]'}`}
                  >
                    <div className="text-left">
                      <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Preference</div>
                      <div className="text-lg font-bold">English</div>
                    </div>
                    {formData.language === 'en' ? <CheckCircle2 className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200" />}
                  </button>
                </div>
              )}

              {step.id === 'welcome' && (
                <div className="space-y-6">
                  <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10 relative">
                    <div className="absolute -top-3 -right-3 bg-white p-2 rounded-full shadow-sm border border-primary/10">
                      <Heart className="w-5 h-5 text-primary fill-primary" />
                    </div>
                    <p className="text-slate-600 text-[15px] leading-relaxed font-medium italic">
                      {isKn 
                        ? "ಮಾತೃ-ಸ್ನೇಹ್ ಗ್ರಾಮೀಣ ಮಹಿಳೆಯರಿಗಾಗಿ ವಿಶೇಷವಾಗಿ ಅಭಿವೃದ್ಧಿಪಡಿಸಲಾಗಿದೆ. ಇದು ನಿಮ್ಮ ಗರ್ಭಧಾರಣೆಯ ಹಂತದಲ್ಲಿ ಒಂದು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಮಾರ್ಗದರ್ಶಿಯಾಗಿದೆ."
                        : "Matru-Sneh is your personalized pocket pregnancy guide. We help you monitor kicks, nutrition, and keep your health records safe offline."}
                    </p>
                  </div>
                  

                </div>
              )}

              {step.id === 'personal' && (
                <div className="space-y-6">
               <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ಪೂರ್ಣ ಹೆಸರು (ತಾಯಿ)' : 'Full Name (Mother)'}</label>
                    <input 
                      type="text" 
                      value={formData.name || ''} 
                      onChange={e =>
                        setFormData({
                          ...formData,
                          name: e.target.value.toUpperCase(),
                        })
                      }
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                      placeholder={isKn ? "ಉದಾ: ತಾಯಿಯ ಹೆಸರು" : "e.g. Mother Name"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ವಯಸ್ಸು' : 'Age'}</label>
                      <input 
                        type="number" 
                        value={formData.age || ''} 
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                        placeholder="25"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ಹುಟ್ಟಿದ ದಿನಾಂಕ' : 'DOB'}</label>
                      <input 
                        type="date" 
                        value={formData.dob || ''} 
                        onChange={e => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step.id === 'health' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ರಕ್ತದ ಗುಂಪು' : 'Blood Group'}</label>
                    <select 
                      value={formData.bloodGroup || ''} 
                      onChange={e => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base appearance-none cursor-pointer"
                    >
                      <option value="">{isKn ? 'ಗುಂಪು ಆಯ್ಕೆಮಾಡಿ' : 'Select Group'}</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ನಿರೀಕ್ಷಿತ ಹೆರಿಗೆ ದಿನಾಂಕ' : 'Estimated Due Date'}</label>
                    <input 
                      type="date" 
                      value={formData.dueDate || ''} 
                      onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        {step.id === 'health' ? (
          <div className="flex flex-col gap-5 py-10 shrink-0 w-full">
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled={!canProceed()}
              onClick={() => {
                // Check if user is re-entering same details as stored profile
                const localData = localStorage.getItem('userProfile');
                let userData = { ...formData };
                
                if (localData) {
                  const storedUser = JSON.parse(localData);
                  
                  // Check if current user details match stored profile
                  const isSameUser = 
                    formData.name === storedUser.name &&
                    formData.age === storedUser.age &&
                    formData.dob === storedUser.dob &&
                    formData.bloodGroup === storedUser.bloodGroup &&
                    formData.dueDate === storedUser.dueDate;
                  
                  if (isSameUser) {
                    // User is re-entering same details - use stored data
                    userData = {
                      ...storedUser,
                      onboardingComplete: true, 
                      profileSetupComplete: true 
                    };
                  } else {
                    // New user or different details - use current form data
                    userData = {
                      ...formData,
                      onboardingComplete: true, 
                      profileSetupComplete: true 
                    };
                  }
                } else {
                  // No stored data - use current form data
                  userData = {
                    ...formData,
                    onboardingComplete: true, 
                    profileSetupComplete: true 
                  };
                }
                
                setUser(userData);
                navigate('/');
              }}
              className="w-full min-h-[56px] rounded-[24px] font-bold text-base shadow-xl shadow-primary/25"
            >
              {isKn ? 'ಲಾಗಿನ್' : 'Login'}
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center py-10 shrink-0">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center justify-center w-16 h-16 rounded-[24px] bg-slate-50 text-slate-400 hover:text-slate-600 active:scale-[0.95] transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            ) : (
              <div className="w-16" />
            )}

            <button
              id="next-step-btn"
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center justify-center w-16 h-16 rounded-[24px] font-display font-bold transition-all active:scale-[0.98] ${canProceed() ? 'bg-primary text-white shadow-2xl shadow-primary/30' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
