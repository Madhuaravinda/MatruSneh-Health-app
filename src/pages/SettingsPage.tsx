import { useState } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useUser } from "@/src/contexts/UserContext";
import { RotateCcw, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { capitalizeWords, formatDateDDMMYYYY } from "../utils/text";

export default function SettingsPage() {
  const { user, setUser, firebaseUser, logout } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  // Sync editForm with user when user context changes or modal opens
  const handleOpenEdit = () => {
    setEditForm({ ...user });
    setIsEditing(true);
  };

  const handleLogout = async () => {
    if (window.confirm(
      firebaseUser 
        ? (isKn ? 'ಹೊರಬನ್ನಿ ಹೊರಬನ್ನಿ?' : 'Are you sure you want to sign out?')
        : (isKn ? 'ಅಪ್ಲಿಕೇಶನ್ ಮರುಹೊಂದಿಸಿ?' : 'Are you sure you want to reset?')
    )) {
      
      if (firebaseUser) {
        // Just sign out if user is authenticated
        await logout();
        navigate('/onboarding');
      } else {
        // For reset, clear all data including userProfile for fresh start
        localStorage.removeItem('userProfile');
        const appKeys = [
          'matru_sneh_kicks',
          'matru_sneh_nutrition',
          'matru_sneh_appointments'
        ];
        appKeys.forEach(key => window.localStorage.removeItem(key));
        
        // Reset user state to default to force language selection
        setUser({
          name: '',
          age: '',
          dob: '',
          bloodGroup: '',
          dueDate: '',
          language: 'en',
          onboardingComplete: false,
          profileSetupComplete: false,
          contactNumber: '',
          emergencyContact: ''
        });
        
        // Redirect to onboarding with a slight delay to ensure state is reset
        setTimeout(() => {
          navigate('/onboarding');
        }, 200);
      }
    }
  };

  const handleSave = async () => {
    await setUser(editForm);
    setIsEditing(false);
  };

  const isKn = user.language === 'kn';

  return (
    <PageContainer>
      <BackButton label={isKn ? "ಹೆಚ್ಚು" : "More"} />
      
      <header className="space-y-1">
        <h1 className="text-xl font-display font-bold text-black">{isKn ? 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು' : 'Settings'}</h1>
        <p className="text-black/60 text-[11px] font-bold uppercase tracking-wider">
          {isKn ? 'ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.' : 'Manage your account and preferences.'}
        </p>
      </header>

      {/* Profile Section */}
      <section className="space-y-4">
        <h3 className="font-bold text-[10px] text-muted-foreground uppercase tracking-widest px-1">{isKn ? 'ಖಾತೆ' : 'Account'}</h3>
        <Card className="rounded-[28px] border-none shadow-sm p-5 space-y-5 bg-white">
           <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-primary border border-pink-100/50">
                 <User className="w-7 h-7" />
              </div>
              <div>
                 <h4 className="text-base font-bold text-slate-800 leading-tight">
                   {user.name ? capitalizeWords(user.name) : (isKn ? 'ಹೆಸರು ಹೊಂದಿಸಿಲ್ಲ' : 'Name not set')}
                 </h4>
                 <p className="text-[11px] text-muted-foreground font-medium mt-1">
                   {isKn ? 'ಡೆಲಿವರಿ ದಿನಾಂಕ' : 'Due'}: {user.dueDate ? formatDateDDMMYYYY(user.dueDate) : (isKn ? "ನಿಗದಿಪಡಿಸಿಲ್ಲ" : "Not Set")}
                 </p>
              </div>
           </div>

           <Button 
             onClick={handleOpenEdit} 
             variant="outline" 
             className="w-full rounded-2xl border-2 border-primary/20 text-primary font-bold bg-white hover:bg-pink-50 transition-all h-12 shadow-sm shadow-primary/5 active:scale-[0.98] text-sm"
           >
             {isKn ? 'ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ ಮತ್ತು ತಿದ್ದಿ' : 'View & Edit Profile'}
           </Button>
        </Card>
      </section>

      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-xl rounded-t-[32px] sm:rounded-[40px] p-8 max-h-[95vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{isKn ? 'ಪ್ರೊಫೈಲ್ ಮಾಹಿತಿ' : 'Profile Information'}</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {isKn ? 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಇಲ್ಲಿದೆ ತಿದ್ದಿ' : 'View or update your details here'}
                  </p>
                </div>
                <button onClick={() => setIsEditing(false)} className="bg-slate-100 p-2.5 rounded-2xl hover:bg-slate-200 transition-colors">
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="space-y-6 pb-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ಪೂರ್ಣ ಹೆಸರು (ತಾಯಿ)' : 'Full Name (Mother)'}</label>
                  <input 
                    type="text" 
                    value={editForm.name} 
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        name: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                    placeholder={isKn ? "ಹೆಸರು ನಮೂದಿಸಿ" : "Enter Mother Name"}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ವಯಸ್ಸು' : 'Age'}</label>
                    <input 
                      type="number" 
                      value={editForm.age || ''} 
                      onChange={e => setEditForm({...editForm, age: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ಹುಟ್ಟಿದ ದಿನಾಂಕ' : 'DOB'}</label>
                    <input 
                      type="date" 
                      value={editForm.dob || ''} 
                      onChange={e => setEditForm({...editForm, dob: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ರಕ್ತದ ಗುಂಪು' : 'Blood Group'}</label>
                    <select 
                      value={editForm.bloodGroup || ''} 
                      onChange={e => setEditForm({...editForm, bloodGroup: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base appearance-none cursor-pointer"
                    >
                      <option value="">--</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{isKn ? 'ನಿರೀಕ್ಷಿತ ಹೆರಿಗೆ ದಿನಾಂಕ' : 'Due Date'}</label>
                    <input 
                      type="date" 
                      value={editForm.dueDate} 
                      onChange={e => setEditForm({...editForm, dueDate: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all font-bold text-slate-800 outline-none text-base"
                    />
                  </div>
                </div>
                
                <Button 
                  variant="primary"
                  onClick={handleSave} 
                  size="lg" 
                  className="w-full rounded-[20px] mt-8 text-white font-bold h-14 shadow-lg shadow-primary/20 active:scale-[0.98] text-base"
                >
                  {isKn ? 'ವಿವರಗಳನ್ನು ಉಳಿಸಿ' : 'Update My Profile'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="px-4 pb-32">
        <Button 
          variant="ghost" 
          className={`w-full rounded-2xl font-bold h-14 transition-all active:scale-[0.98] ${firebaseUser ? 'text-red-500 hover:bg-red-50' : 'text-slate-400 hover:bg-slate-50'}`}
          onClick={handleLogout}
        >
          <RotateCcw className="w-5 h-5 mr-3" />
          {firebaseUser 
            ? (isKn ? "ಹೊರಬನ್ನಿ" : "Sign Out") 
            : (isKn ? "ಮರುಹೊಂದಿಸಿ" : "Reset")}
        </Button>
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] mt-8">
          Matru-Sneh Health v1.1.0
        </p>
      </section>
    </PageContainer>
  );
}
