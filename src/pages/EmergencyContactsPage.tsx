import { PageContainer } from "@/src/components/layout/PageContainer";
import { BackButton } from "@/src/components/ui/BackButton";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Phone, Plus, Trash2, ShieldAlert, User, MapPin, Navigation } from "lucide-react";
import { useUser } from "@/src/contexts/UserContext";
import { useCollection } from "@/src/hooks/useCollection";
import { useLocation } from "@/src/hooks/useLocation";

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

const mockFacilities = [
  { name: 'K.C. General Hospital', distance: '1.2 km', type: 'Public Hospital' },
  { name: 'Mother & Child Care Center', distance: '3.5 km', type: 'Specialized Clinic' },
  { name: 'Sanjeevani PHC', distance: '4.8 km', type: 'Primary Health Center' },
];

export default function EmergencyContactsPage() {
  const { user } = useUser();
  const { latitude, error: locationError } = useLocation();
  const { data: contacts, remove: removeContact } = useCollection<Contact>("emergency_contacts", [
    { id: '1', name: 'Ambulance', relation: 'Service', phone: '108', isPrimary: true },
    { id: '2', name: 'Partner / Husband', relation: 'Family', phone: user.emergencyContact || '', isPrimary: false },
  ]);

  const call = (num: string) => {
    if (!num) return;
    window.location.href = `tel:${num}`;
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <BackButton label="More" />
        <Button size="sm" className="rounded-full gap-1 border-primary text-primary" variant="outline">
          <Plus className="w-4 h-4" /> Add New
        </Button>
      </div>

      <header className="space-y-1 mb-6">
        <h1 className="text-3xl font-display font-bold">Emergency</h1>
        <p className="text-muted-foreground text-sm">Quick access for critical situations.</p>
      </header>

      {/* Primary SOS Card */}
      <Card className="rounded-[32px] border-none bg-red-600 text-white p-8 shadow-xl shadow-red-100 flex flex-col items-center gap-6 mb-8">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
           <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
           <h2 className="text-2xl font-bold font-display">{user.emergencyContact ? "Need Assistance?" : "Need Immediate Help?"}</h2>
           <p className="text-sm opacity-80 max-w-[240px]">
             {user.emergencyContact 
               ? "Press the button below to call your saved emergency contact." 
               : "Press the button below to call national emergency services."}
           </p>
        </div>
        <Button 
          onClick={() => call(user.emergencyContact || "108")}
          className="w-full rounded-3xl bg-white text-red-600 font-bold h-14 text-lg hover:bg-gray-100 transition-colors"
        >
          {user.emergencyContact ? "Call Emergency Contact" : "Call Emergency (108)"}
        </Button>
      </Card>

      <div className="space-y-8 pb-24">
        {/* Personal Contacts */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg font-display flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Contacts
          </h3>
          <div className="flex flex-col gap-3">
            {contacts.map((contact) => (
              <div 
                key={contact.id} 
                className="p-5 rounded-[28px] bg-white border border-gray-50 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-2xl ${contact.isPrimary ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                    {contact.isPrimary ? <ShieldAlert className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold">{contact.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{contact.phone || 'No number set'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {contact.phone && (
                    <Button 
                      onClick={() => call(contact.phone)}
                      variant="outline" 
                      size="icon" 
                      className="rounded-full border-primary/20 text-primary"
                    >
                      <Phone className="w-4 h-4" />
                    </Button>
                  )}
                  <Button onClick={() => removeContact(contact.id)} variant="ghost" size="icon" className="text-gray-200 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Healthcare provider removed as per requirement to only show signup info */}
          </div>
        </section>

        {/* Nearby Facilities */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg font-display flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Nearby Facilities
            </h3>
            {latitude && <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">Live</span>}
          </div>

          <div className="grid gap-3">
            {mockFacilities.map((facility, i) => (
              <div key={i} className="p-4 rounded-3xl bg-gray-50 border border-transparent hover:border-secondary/20 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-white rounded-2xl group-hover:text-secondary transition-colors">
                     <MapPin className="w-5 h-5" />
                  </div>
                  <div className="pr-2">
                    <h4 className="font-bold text-sm tracking-tight">{facility.name}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{facility.type}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-secondary mb-1">{facility.distance}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const isAndroid = /Android/i.test(navigator.userAgent);
                      const query = facility.name;
                      if (isAndroid) {
                        window.location.href = `geo:0,0?q=${encodeURIComponent(query)}`;
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank');
                      }
                    }}
                    className="h-6 gap-1 px-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-secondary"
                  >
                    <Navigation className="w-3 h-3" /> Map
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button 
            variant="outline" 
            className="w-full rounded-2xl border-secondary/30 text-secondary h-12 text-xs font-bold uppercase tracking-widest hover:bg-secondary/5 mt-2"
            onClick={() => {
                  const openMap = (query: string) => {
                    const isAndroid = /Android/i.test(navigator.userAgent);
                    const encodedQuery = encodeURIComponent(query);
                    
                    if (isAndroid) {
                      // geo: intent is much better for triggering the native app on Android APKs
                      window.location.href = `geo:0,0?q=${encodedQuery}`;
                    } else {
                      // Standard fallback
                      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedQuery}`, '_blank');
                    }
                  };

                  if ("geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition((position) => {
                      const { latitude, longitude } = position.coords;
                      const query = "Primary Health Centre";
                      const isAndroid = /Android/i.test(navigator.userAgent);
                      
                      if (isAndroid) {
                        window.location.href = `geo:${latitude},${longitude}?q=Primary+Health+Centre`;
                      } else {
                        window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}&location=${latitude},${longitude}`, '_blank');
                      }
                    }, () => {
                      openMap('Primary Health Centre near me');
                    });
                  } else {
                    openMap('Primary Health Centre near me');
                  }

            }}
          >
            Find more facilities on map
          </Button>
          
          {locationError && (
             <p className="text-[10px] text-center text-red-400 font-bold uppercase py-2">
               Precision location unavailable
             </p>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
