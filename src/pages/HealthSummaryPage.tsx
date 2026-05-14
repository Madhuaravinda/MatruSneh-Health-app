import { useState } from "react";
import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { useCollection } from "@/src/hooks/useCollection";
import { useUser } from "@/src/contexts/UserContext";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Apple, Zap, TrendingUp, Calendar } from "lucide-react";
import { downloadFile } from "@/src/utils/download";
import { formatDateDDMMYYYY } from "@/src/utils/text";

interface KickSession {
  id: string;
  userId: string;
  count: number;
  startTime: string;
}

interface Appointment {
  id: string;
  date: string;
  completed: boolean;
}

export default function HealthSummaryPage() {
  const { user } = useUser();
  const { data: sessions } = useCollection<KickSession>("kick_sessions", []);
  const { data: appointments } = useCollection<Appointment>("appointments", []);
  const [isExporting, setIsExporting] = useState(false);

  // Process data for charts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const kickTrendData = last7Days.map(date => {
    const daySessions = sessions.filter(s => s.startTime.startsWith(date));
    const totalKicks = daySessions.reduce((acc, s) => acc + s.count, 0);
    return {
      date: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      kicks: totalKicks
    };
  });

  const totalKicksLastWeek = kickTrendData.reduce((acc, d) => acc + d.kicks, 0);
  const avgKicksPerDay = Math.round(totalKicksLastWeek / 7);
  
  const completedAppts = appointments.filter(a => a.completed).length;
  const totalAppts = appointments.length;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      
      const doc = new jsPDF();
      const isKn = user.language === 'kn';
    
    doc.setFontSize(20);
    doc.setTextColor(233, 30, 99);
    doc.text(isKn ? "ಮಾಸಿಕ ಆರೋಗ್ಯ ವರದಿ" : "Monthly Health Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`User: ${user.name || 'N/A'}`, 14, 28);
    doc.text(`Mobile: ${user.contactNumber || 'N/A'}`, 14, 33);
    doc.text(`Emergency: ${user.emergencyContact || 'N/A'}`, 14, 38);
    doc.text(`Date: ${formatDateDDMMYYYY(new Date())}`, 14, 43);

    autoTable(doc, {
      startY: 50,
      head: [[isKn ? 'ವಿವರ' : 'Metric', isKn ? 'ಮೌಲ್ಯ' : 'Value']],
      body: [
        [isKn ? 'ಸರಾಸರಿ ಕಿಕ್ಸ್/ದಿನ' : 'Avg Kicks / Day', avgKicksPerDay.toString()],
        [isKn ? 'ಒಟ್ಟು ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು' : 'Total Appointments', totalAppts.toString()],
        [isKn ? 'ಪೂರ್ಣಗೊಂಡ ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು' : 'Completed Appointments', completedAppts.toString()],
        [isKn ? 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಪಾಲನೆ %' : 'Compliance %', `${totalAppts > 0 ? Math.round((completedAppts / totalAppts) * 100) : 0}%`],
      ],
      headStyles: { fillColor: [233, 30, 99] }
    });

    const pdfBlob = doc.output('blob');
    await downloadFile(pdfBlob, `Health_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <PageContainer>
      <BackButton label="Home" />
      
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold">Health Insights</h1>
        <p className="text-muted-foreground text-sm">Monthly summary and pattern analysis.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 pb-24">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
           <Card className="rounded-[32px] border-none bg-primary/5 p-5 flex flex-col gap-3">
              <div className="p-2 bg-white rounded-2xl w-fit">
                 <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                 <p className="text-2xl font-bold text-primary">{avgKicksPerDay}</p>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Avg Kicks / Day</p>
              </div>
           </Card>
           <Card className="rounded-[32px] border-none bg-secondary/5 p-5 flex flex-col gap-3">
              <div className="p-2 bg-white rounded-2xl w-fit">
                 <Apple className="w-5 h-5 text-secondary" />
              </div>
              <div>
                 <p className="text-2xl font-bold text-secondary">82%</p>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-1">Nutrition Score</p>
              </div>
           </Card>
        </div>

        {/* Kick Trend Chart */}
        <Card className="rounded-[40px] border-none bg-white shadow-xl shadow-pink-100/30 p-8 overflow-hidden">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="font-bold text-lg">Kick Activity</h3>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Movement Tracking (Last 7 Days)</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                 <TrendingUp className="w-6 h-6" />
              </div>
           </div>
           
           <div className="h-64 w-full -ml-8">
             <ResponsiveContainer width="112%" height="100%">
               <LineChart data={kickTrendData}>
                 <XAxis 
                   dataKey="date" 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 'bold' }} 
                   dy={10}
                 />
                 <Tooltip 
                   contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                 />
                 <Line 
                   type="monotone" 
                   dataKey="kicks" 
                   stroke="#E91E63" 
                   strokeWidth={4} 
                   dot={{ r: 6, fill: '#E91E63', strokeWidth: 3, stroke: '#fff' }}
                   activeDot={{ r: 8 }}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </Card>

        {/* Appointment Status */}
        <Card className="rounded-[40px] border-none bg-gray-900 text-white p-8">
           <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg font-display">Appointment Compliance</h3>
              <Calendar className="w-6 h-6 text-pink-400" />
           </div>
           
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                 <p className="text-sm font-medium opacity-80">Health Checkups</p>
                 <p className="text-sm font-bold">{completedAppts} / {totalAppts}</p>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-pink-500 rounded-full transition-all duration-1000" 
                   style={{ width: `${totalAppts > 0 ? (completedAppts / totalAppts) * 100 : 0}%` }}
                 ></div>
              </div>
              <p className="text-[11px] font-medium opacity-60 leading-relaxed italic">
                 Regular check-ups are essential for monitoring baby's growth and mother's health.
              </p>
           </div>
        </Card>

        <Button 
          variant="outline" 
          onClick={handleExport}
          disabled={isExporting}
          className="w-full rounded-2xl border-gray-100 font-bold h-14 disabled:opacity-50"
        >
          {isExporting ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            user.language === 'kn' ? "ವರದಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ" : "Export Monthly Report"
          )}
        </Button>
      </div>
    </PageContainer>
  );
}
