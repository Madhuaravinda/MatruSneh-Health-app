import { Menu, Heart, WifiOff } from "lucide-react";
import { useState, useEffect } from "react";
import { HamburgerMenu } from "./HamburgerMenu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md px-5 h-16 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg text-slate-800 tracking-tight leading-none">
              Matru-Sneh Health
            </span>
            {!isOnline && (
              <span className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase mt-1">
                <WifiOff className="w-2.5 h-2.5" />
                Offline
              </span>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
