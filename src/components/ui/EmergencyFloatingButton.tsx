import { Phone } from "lucide-react";
import { Button } from "@/src/components/ui/Button";
import { useNavigate } from "react-router-dom";

export function EmergencyFloatingButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="emergency"
      size="xl"
      className="fixed bottom-20 right-4 z-50 rounded-full shadow-2xl w-16 h-16 p-0"
      onClick={() => navigate("/health-alerts")}
    >
      <Phone className="w-8 h-8 fill-white" />
    </Button>
  );
}
