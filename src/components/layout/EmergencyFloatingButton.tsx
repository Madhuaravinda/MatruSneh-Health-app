import { Phone, MapPin, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/src/components/ui/Button";
import { useUser } from "@/src/contexts/UserContext";

export function EmergencyFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const emergencyNumber = user.emergencyContact || "108";
  const emergencyLabel = user.emergencyContact 
    ? (user.language === 'kn' ? "ಸಂಪರ್ಕಿಸಿ" : "Emergency Contact")
    : (user.language === 'kn' ? "108 ಕರೆ ಮಾಡಿ" : "Call 108");

  const actions = [
    { 
      icon: Phone, 
      label: emergencyLabel, 
      color: "bg-red-500", 
      onClick: () => window.location.href = `tel:${emergencyNumber}` 
    },
    { 
      icon: MapPin, 
      label: user.language === 'kn' ? "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ" : "Nearest PHC", 
      color: "bg-secondary", 
      onClick: () => {
        const isAndroid = /Android/i.test(navigator.userAgent);
        const openMap = (lat?: number, lng?: number) => {
          const query = "Primary Health Centre";
          if (isAndroid) {
            const loc = lat && lng ? `${lat},${lng}` : "0,0";
            window.location.href = `geo:${loc}?q=${encodeURIComponent(query)}`;
          } else {
            const url = lat && lng 
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&location=${lat},${lng}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}+near+me`;
            window.open(url, '_blank');
          }
        };

        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            openMap(latitude, longitude);
          }, (error) => {
            console.warn("Geolocation failed", error);
            openMap();
          }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        } else {
          openMap();
        }
      }
    },
  ];

  return (
    <div className="fixed bottom-24 right-5 z-50 pointer-events-none">
      <div className="relative flex flex-col items-center gap-2 pointer-events-auto">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="flex flex-col gap-1.5 mb-1"
            >
              {actions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-2 justify-end pointer-events-auto">
                   <span className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded shadow-sm text-[8px] font-black text-black/50 uppercase tracking-widest whitespace-nowrap border border-slate-100">
                      {action.label}
                   </span>
                   <Button 
                     size="icon" 
                     className={`w-9 h-9 rounded-full shadow-md border-2 border-white ${action.color} text-white`}
                     onClick={action.onClick}
                   >
                     <action.icon className="w-4 h-4" />
                   </Button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <Button 
          size="icon" 
          className={`w-12 h-12 rounded-full shadow-[0_5px_18px_rgba(233,30,99,0.35)] transition-all duration-300 border-2 border-white ${
            isOpen ? 'bg-slate-800 rotate-90' : 'bg-primary'
          } text-white`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-5 h-5" /> : <Heart className="w-6 h-6 fill-white/20" />}
        </Button>
      </div>
    </div>
  );
}
