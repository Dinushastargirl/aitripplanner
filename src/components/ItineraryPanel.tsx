import { TripPlan, DayPlan, Activity } from "../types";
import { Sun, CloudSun, Moon, Map, DollarSign, Zap, TrendingUp, Sparkles, MapPin } from "lucide-react";
import { motion } from "motion/react";

interface ItineraryPanelProps {
  plan: TripPlan | null;
}

export function ItineraryPanel({ plan }: ItineraryPanelProps) {
  if (!plan) {
    return (
      <div className="w-full flex-1 flex flex-col items-center justify-center p-12 bg-white text-center">
        <div className="w-24 h-24 bg-[#ffebeb] rounded-full flex items-center justify-center mb-10 animate-bounce transition-all">
          <Map className="h-10 w-10 text-[#E32E26]" />
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-[#141414]">No Active Plan</h3>
        <p className="text-[#888] text-sm max-w-xs leading-loose font-medium">
          Start by clicking the <span className="text-[#E32E26] font-bold">Plan</span> button to generate your intelligent Sri Lanka journey.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-8 border-b border-[#E32E26]/5 sticky top-0 bg-white/90 backdrop-blur-xl z-10 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E32E26]" />
            <h2 className="text-3xl font-black uppercase tracking-tighter text-[#141414]">
              {plan.destination}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-black bg-[#141414] text-white px-3 py-1 rounded-full uppercase tracking-widest leading-none">
              {plan.duration} Days
            </span>
            <span className="text-[9px] font-black border border-[#E32E26]/20 text-[#E32E26] px-3 py-1 rounded-full uppercase tracking-widest leading-none">
              {plan.budget}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 bg-white border border-[#E32E26]/10 text-[#555] hover:text-[#E32E26] hover:border-[#E32E26]/30 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5 active:translate-y-0">
            <TrendingUp className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-[#fcfcfc] border border-[#E32E26]/5 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <label className="text-[9px] font-black uppercase text-[#E32E26] block mb-3 tracking-[0.2em] opacity-60">Total Cost</label>
            <div className="flex items-center gap-2 text-2xl font-black text-[#141414]">
              <DollarSign size={20} className="text-[#E32E26]" strokeWidth={3} />
              {plan.totalEstimatedCost}
            </div>
          </div>
          <div className="p-6 bg-[#fcfcfc] border border-[#E32E26]/5 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
            <label className="text-[9px] font-black uppercase text-[#E32E26] block mb-3 tracking-[0.2em] opacity-60">Vibe Check</label>
            <div className="flex items-center gap-2 text-xs font-black text-[#141414] leading-relaxed">
              <Sparkles size={18} className="text-[#E32E26]" />
              {plan.vibeSummary}
            </div>
          </div>
        </div>

        <div className="p-6 bg-black rounded-[2rem] text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E32E26] opacity-20 blur-3xl -mr-10 -mt-10 group-hover:opacity-30 transition-opacity" />
          <div className="flex items-center gap-3 mb-3">
             <Zap size={14} className="text-[#E32E26]" strokeWidth={3} />
             <span className="text-[9px] font-black uppercase tracking-widest text-[#E32E26]">Route Optimization Logic</span>
          </div>
          <p className="text-[11px] leading-relaxed font-medium opacity-80 italic">{plan.routeLogic}</p>
        </div>

        {/* Days */}
        <div className="space-y-16 pb-20">
          {plan.itinerary.map((day, idx) => (
            <DayCard key={idx} day={day} idx={idx} />
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-[#fcfcfc] border-t border-[#E32E26]/5 grid grid-cols-3 gap-3 shrink-0">
        <ActionButton label="Optimize" icon={Zap} />
        <ActionButton label="Budget" icon={TrendingUp} />
        <ActionButton label="Gems" icon={Sparkles} />
      </div>
    </div>
  );
}

function ActionButton({ label, icon: Icon }: { label: string, icon: any }) {
  return (
    <button className="flex flex-col items-center gap-2 py-3 px-1 rounded-2xl bg-white border border-[#E32E26]/10 hover:border-[#E32E26]/30 transition-all hover:bg-[#ffebeb] group">
      <Icon size={16} className="text-[#888] group-hover:text-[#E32E26] transition-colors" strokeWidth={2.5} />
      <span className="text-[9px] font-black uppercase tracking-widest text-[#888] group-hover:text-[#E32E26] leading-none transition-colors">{label}</span>
    </button>
  );
}

function DayCard({ day, idx }: { day: DayPlan; idx: number; key?: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="space-y-8 relative"
    >
      <div className="flex items-center gap-4">
        <span className="text-5xl font-black italic text-[#E32E26]/10 select-none leading-none">0{day.day}</span>
        <div className="h-px flex-1 bg-[#E32E26]/10" />
        <h3 className="text-xl font-black uppercase tracking-tighter text-[#141414]">{day.title}</h3>
      </div>

      <div className="space-y-10 pl-6 border-l-2 border-[#E32E26]/5 ml-4">
        <TimeSection title="Morning Session" icon={Sun} activities={day.morning} />
        <TimeSection title="Afternoon Session" icon={CloudSun} activities={day.afternoon} />
        <TimeSection title="Evening Session" icon={Moon} activities={day.evening} />
      </div>
    </motion.div>
  );
}

function TimeSection({ title, icon: Icon, activities }: { title: string, icon: any, activities: Activity[] }) {
  if (activities.length === 0) return null;

  return (
    <div className="relative space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#fcfcfc] border border-[#E32E26]/10 flex items-center justify-center text-[#E32E26] shadow-sm">
           <Icon size={14} strokeWidth={3} />
        </div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888]">{title}</h4>
      </div>
      
      <div className="grid gap-4">
        {activities.map((act, i) => (
          <div key={i} className="group relative">
            <div className="flex items-center gap-3 mb-2 ml-1">
              <span className="text-[9px] font-black font-mono text-[#E32E26] px-2 py-0.5 bg-[#ffebeb] rounded-full">{act.time}</span>
              {act.duration && <span className="text-[9px] font-black text-[#888] uppercase tracking-tighter opacity-40">{act.duration}</span>}
            </div>
            <div className="p-5 rounded-[1.5rem] bg-white border border-[#E32E26]/5 shadow-sm hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] hover:border-[#E32E26]/20 transition-all cursor-default group-hover:-translate-y-0.5">
              <span className="block font-black text-sm mb-2 text-[#141414] leading-tight">{act.activity}</span>
              <p className="text-[11px] text-[#555] leading-relaxed font-medium opacity-80">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
