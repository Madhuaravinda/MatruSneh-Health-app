import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, AlertCircle, Settings } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const { user } = useUser();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Calendar, label: { en: "Appointments", kn: "ನೇಮಕಾತಿಗಳು" }, href: "/appointment" },
    { icon: AlertCircle, label: { en: "Health Alerts", kn: "ಆರೋಗ್ಯ ಎಚ್ಚರಿಕೆಗಳು" }, href: "/health-alerts" },
    { icon: Settings, label: { en: "Settings", kn: "ಸೆಟ್ಟಿಂಗ್ಸ್" }, href: "/settings" },
  ];

  const lang = user.language || 'en';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-5 pt-8 relative">
              <button 
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h2 className="text-white font-display font-bold text-lg tracking-tight">Matru-Sneh Health</h2>
              <p className="text-white/80 text-xs font-semibold mt-0.5">Pocket Pregnancy Guide</p>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {menuItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-semibold text-black flex-1 text-left text-sm">
                    {item.label[lang]}
                  </span>
                </button>
              ))}
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
