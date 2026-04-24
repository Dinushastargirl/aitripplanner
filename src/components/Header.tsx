import { ChevronDown, MapPin, Calendar, Users, DollarSign, Settings2, Edit, Share, X, Menu } from "lucide-react";

interface HeaderProps {
  onPlanClick: () => void;
  isLoading: boolean;
  onSegmentClick?: (label: string) => void;
  onMenuClick?: () => void;
}

export function Header({ onPlanClick, isLoading, onSegmentClick, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 lg:px-10 py-4 lg:py-6 w-full bg-white/95 backdrop-blur-xl sticky top-0 z-[60] border-b border-[#E32E26]/5 gap-4">
      {/* Left Area: Menu + Logo */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 bg-[#ffebeb] text-[#E32E26] rounded-xl active:scale-90 transition-all"
        >
          <Menu size={18} strokeWidth={2.5} />
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 cursor-pointer group">
            <h1 className="text-sm md:text-xl font-black text-[#141414] tracking-tight whitespace-nowrap">Trip to Lanka</h1>
            <ChevronDown size={14} className="text-[#888] group-hover:text-[#E32E26] transition-colors" />
          </div>
          <p className="text-[8px] md:text-[9px] text-[#E32E26] font-black uppercase tracking-widest opacity-70 leading-none md:mt-0.5">
            Personal Guide
          </p>
        </div>
      </div>

      {/* Middle Area: Filter Pill (Desktop) / Hidden or minimized on mobile if needed, but the user asked for same line */}
      <div className="hidden md:flex flex-1 justify-center max-w-2xl px-4">
        <div className="flex items-center border border-[#E32E26]/10 rounded-full bg-white p-0.5 shadow-sm transition-all overflow-x-auto scrollbar-hide">
          <Segment icon={MapPin} label="Where" onClick={() => onSegmentClick?.('Sri Lanka')} border />
          <Segment icon={Calendar} label="When" onClick={() => onSegmentClick?.('When')} border />
          <Segment icon={Users} label="Who" onClick={() => onSegmentClick?.('Group')} border />
          <Segment icon={DollarSign} label="Budget" onClick={() => onSegmentClick?.('Budget')} border />
          <Segment icon={Settings2} label="More" onClick={() => onSegmentClick?.('Preferences')} />
        </div>
      </div>

      {/* Right Area: Actions */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <button 
          onClick={onPlanClick}
          disabled={isLoading}
          className="hidden sm:flex bg-[#E32E26] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest items-center gap-2 hover:bg-[#c12720] transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Edit size={14} strokeWidth={3} />
          {isLoading ? "Drafting..." : "Plan"}
        </button>
        
        <div className="flex items-center gap-2">
          <button className="p-2 md:p-2.5 text-[#555] hover:text-[#E32E26] transition-colors border border-[#E32E26]/10 rounded-full bg-[#fcfcfc] shadow-sm">
            <Share size={16} />
          </button>
          <button className="hidden md:flex p-2.5 bg-[#141414] text-white rounded-full hover:bg-black transition-all shadow-md active:scale-90">
            <X size={16} strokeWidth={3} />
          </button>
        </div>
      </div>
    </header>
  );
}

function Segment({ icon: Icon, label, border, onClick }: { icon: any, label: string, border?: boolean, onClick?: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center justify-center gap-2.5 px-3 lg:px-5 py-2.5 hover:bg-[#fcfcfc] cursor-pointer transition-colors flex-1 rounded-full ${border ? "border-r border-[#E32E26]/5" : ""}`}
    >
      <Icon size={14} className="text-[#E32E26]" strokeWidth={2.5} />
      <span className="text-[9px] lg:text-[10px] font-black text-[#555] uppercase tracking-wider whitespace-nowrap">{label}</span>
    </div>
  );
}
