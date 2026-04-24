import React, { useState } from "react";
import { Plane, Compass, Landmark, Heart, Users, Calendar, DollarSign, Activity } from "lucide-react";
import { motion } from "motion/react";

interface TripPanelProps {
  onGenerate: (data: any) => void;
  isLoading: boolean;
}

const INTERESTS = [
  "Beach", "Mountains", "Foodie", "Shopping", "History", 
  "Adventure", "Nightlife", "Art", "Wellness", "Photography"
];

const BUDGETS = [
  { id: "low", label: "Low", desc: "Budget Friendly", icon: DollarSign },
  { id: "mid", label: "Mid", desc: "Comfortable", icon: DollarSign },
  { id: "luxury", label: "Luxury", desc: "High-end", icon: DollarSign }
];

const STYLES = [
  { id: "adventure", label: "Adventure", icon: Compass },
  { id: "relax", label: "Relax", icon: Heart },
  { id: "culture", label: "Culture", icon: Landmark },
  { id: "mixed", label: "Mixed", icon: Activity }
];

const GROUPS = [
  { id: "solo", label: "Solo", icon: Users },
  { id: "couple", label: "Couple", icon: Users },
  { id: "family", label: "Family", icon: Users },
  { id: "friends", label: "Friends", icon: Users }
];

export function TripPanel({ onGenerate, isLoading }: TripPanelProps) {
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState("mid");
  const [style, setStyle] = useState("mixed");
  const [group, setGroup] = useState("solo");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      destination,
      duration,
      budget,
      travelStyle: style,
      groupType: group,
      interests: selectedInterests
    });
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden border-r border-black bg-white">
      <div className="p-4 border-b border-black">
        <h2 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
          <Plane className="h-5 w-5 text-[#E32E26]" />
          Trip Input
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Destination */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Destination</label>
          <input
            type="text"
            required
            placeholder="e.g. Tokyo, Japan"
            className="w-full border border-black p-3 text-sm focus:ring-1 focus:ring-[#E32E26] outline-none"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Duration (Days)</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="14"
              className="flex-1 h-1 bg-black accent-[#E32E26]"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
            />
            <span className="text-lg font-bold w-8 text-center">{duration}</span>
          </div>
        </div>

        {/* Budget */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Budget</label>
          <div className="grid grid-cols-3 gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBudget(b.id)}
                className={`p-2 border border-black flex flex-col items-center gap-1 transition-all ${
                  budget === b.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <div className="flex">
                  {Array.from({ length: BUDGETS.indexOf(b) + 1 }).map((_, i) => (
                    <b.icon key={i} className="h-3 w-3" />
                  ))}
                </div>
                <span className="text-[10px] font-bold uppercase">{b.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Travel Style</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={`p-3 border border-black flex items-center gap-3 transition-all ${
                  style === s.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <s.icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Group Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Group Type</label>
          <div className="grid grid-cols-2 gap-2">
            {GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setGroup(g.id)}
                className={`p-3 border border-black flex items-center gap-3 transition-all ${
                  group === g.id ? "bg-black text-white" : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                <g.icon className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase">{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-[#888888] tracking-widest">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border border-black transition-all ${
                  selectedInterests.includes(interest) ? "bg-[#E32E26] text-white border-[#E32E26]" : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </form>

      <div className="p-4 border-t border-black bg-black">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !destination}
          className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-all ${
            isLoading || !destination 
              ? "bg-[#555] text-[#888] cursor-not-allowed" 
              : "bg-[#E32E26] text-white hover:bg-red-700 active:scale-[0.98]"
          }`}
        >
          {isLoading ? "Generating Planning..." : "Generate Trip Plan"}
        </button>
      </div>
    </div>
  );
}
