import { Home, Activity, Apple, BookHeart, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { useUser } from "@/src/contexts/UserContext";

const navItems = [
  { icon: Home, label: { en: "Home", kn: "ಮುಖಪುಟ" }, href: "/" },
  { icon: Activity, label: { en: "Kicks", kn: "ಒದೆತಗಳು" }, href: "/kick-counter" },
  { icon: Apple, label: { en: "Nutrition", kn: "ಆಹಾರ" }, href: "/nutrition" },
  { icon: BookHeart, label: { en: "Journey", kn: "ಪಯಣ" }, href: "/journey" },
];

export function BottomNavigation() {
  const { user } = useUser();
  const lang = user.language || 'en';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-4 h-16 safe-bottom shadow-[0_-8px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center w-full max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full gap-0.5 transition-all duration-300",
                isActive ? "text-primary translate-y-[-2px]" : "text-black/40"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn(
                  "p-1",
                  isActive && "text-primary"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive ? "text-primary" : "text-slate-400"
                )}>
                  {item.label[lang]}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
