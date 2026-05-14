import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/src/components/ui/Button";

interface BackButtonProps {
  label?: string;
  onClick?: () => void;
}

export function BackButton({ label, onClick }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick || (() => navigate(-1))} 
      className="gap-1 p-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-bold text-xs uppercase tracking-wider">{label || "Back"}</span>
    </Button>
  );
}
