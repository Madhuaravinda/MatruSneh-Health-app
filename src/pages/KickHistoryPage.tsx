import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card, CardContent } from "@/src/components/ui/Card";
import { useCollection } from "@/src/hooks/useCollection";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Calendar } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { useNavigate } from "react-router-dom";

import { formatDateDDMMYYYY } from "@/src/utils/text";

interface KickSession {
  id: string;
  count: number;
  startTime: string;
  notes: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-xl">
        <p className="text-sm font-bold text-black mb-1">{label}</p>
        <p className="text-sm font-bold text-primary">count : {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function KickHistoryPage() {
  const { user } = useUser();
  const { data: sessions } = useCollection<KickSession>("kick_sessions", []);
  const navigate = useNavigate();

  // Prepare 7 days of data
  const days = user.language === 'kn' 
    ? ["ಸೋಮ", "ಮಂಗಳ", "ಬುಧ", "ಗುರು", "ಶುಕ್ರ", "ಶನಿ", "ಭಾನು"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = days.map((day, index) => {
    const today = new Date();
    const dayDate = new Date(today);
    const currentDay = today.getDay(); // 0 is Sun
    const diff = today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + index;
    dayDate.setDate(diff);
    
    const count = sessions
      .filter(s => new Date(s.startTime).toDateString() === dayDate.toDateString())
      .reduce((acc, s) => acc + s.count, 0);

    return {
      day,
      count: count || 0
    };
  });

  const averageKicks = sessions.length > 0 
    ? (sessions.reduce((acc, s) => acc + s.count, 0) / sessions.length).toFixed(1)
    : 0;

  return (
    <PageContainer>
      <div className="flex items-center">
        <BackButton label={user.language === 'kn' ? "ಒದೆತಗಳು" : "COUNTER"} onClick={() => navigate("/kick-counter")} />
      </div>

      <header className="space-y-4">
        <h1 className="text-3xl font-display font-bold">
          {user.language === 'kn' ? "ಒದೆತ ಫಲಿತಾಂಶ" : "Kick Counter"}
        </h1>
        
        {/* Tab Segments */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full">
          <button 
            onClick={() => navigate("/kick-counter")}
            className="flex-1 py-2 text-sm font-bold rounded-xl transition-all text-gray-500"
          >
            {user.language === 'kn' ? "ಕೌಂಟರ್" : "Counter"}
          </button>
          <button 
            className="flex-1 py-2 text-sm font-bold rounded-xl transition-all bg-white shadow-sm text-black"
          >
            {user.language === 'kn' ? "ಇತಿಹಾಸ" : "History"}
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="rounded-3xl border-none shadow-sm bg-primary/5">
          <CardContent className="p-4 flex flex-col items-center">
            <p className="text-3xl font-bold text-primary">{averageKicks}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Avg Kicks/Session</p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-none shadow-sm bg-secondary/5">
          <CardContent className="p-4 flex flex-col items-center">
            <p className="text-3xl font-bold text-secondary">{sessions.length}</p>
            <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card className="rounded-3xl border-none shadow-sm h-72 p-4">
        <h3 className="text-sm font-bold text-black mb-4">
          {user.language === 'kn' ? "ಈ ವಾರ" : "This week"}
        </h3>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ left: -25, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={true} horizontal={true} strokeDasharray="3 3" stroke="#e5e7eb" verticalFill={['#fff', '#f9fafb']} fillOpacity={0.4} />
              <XAxis 
                dataKey="day" 
                axisLine={true} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }} 
                padding={{ left: 10, right: 10 }}
              />
              <YAxis 
                axisLine={true} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }}
                domain={[0, 8]}
                ticks={[0, 2, 4, 6, 8]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#E91E63" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#E91E63', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#E91E63', stroke: '#fff', strokeWidth: 3 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

       {/* Detailed Log */}
      <section className="space-y-4 pb-10">
        <h3 className="font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          {user.language === 'kn' ? "ವಿವರವಾದ ದಾಖಲೆ" : "Detailed Log"}
        </h3>
        <div className="flex flex-col gap-3">
          {sessions.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm py-4">No sessions recorded yet.</p>
          ) : (
            sessions.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{formatDateDDMMYYYY(s.startTime)}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">
                      {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">{s.count}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{user.language === 'kn' ? "ಒದೆತಗಳು" : "Kicks"}</p>
                  </div>
                </div>
                {s.notes && (
                  <div className="pt-2 border-t border-gray-50">
                    <p className="text-[11px] text-black/70 italic leading-relaxed">
                      "{s.notes}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </PageContainer>
  );
}
