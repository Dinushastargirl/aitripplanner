import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, MapPin, Tag, Map as MapIcon, Compass } from "lucide-react";

interface Province {
  id: string;
  name: string;
  cities: string[];
  knownFor: string[];
  path: string;
  labelPos: { x: number; y: number };
}

const PROVINCES: Province[] = [
  {
    id: "northern",
    name: "Northern Province",
    cities: ["Jaffna", "Kilinochchi", "Mannar"],
    knownFor: ["Cultural Heritage", "Pristine Lagoons", "Palmyrah"],
    path: "M215,5c10,5,25,0,35,15s15,45,10,75c-5,30-35,60-60,55s-35-40-35-65c0-20,10-60,25-70c10-5,15-15,25-10z",
    labelPos: { x: 220, y: 70 }
  },
  {
    id: "north_central",
    name: "North Central",
    cities: ["Anuradhapura", "Polonnaruwa"],
    knownFor: ["Ancient Cities", "Wildlife", "Giant Reservoirs"],
    path: "M175,150c25-5,45,0,70,-5s35,15,40,40s-10,65-35,85s-65,15-85,-5s-20,-65,-10,-115z",
    labelPos: { x: 215, y: 210 }
  },
  {
    id: "eastern",
    name: "Eastern Province",
    cities: ["Trincomalee", "Batticaloa", "Arugam Bay"],
    knownFor: ["Surfing", "Whale Watching", "Natural Harbors"],
    path: "M285,185c15,10,35,40,45,100s5,120-15,180s-45,80-60,85c-15,5-30-20-35-70s25-150,65-295z",
    labelPos: { x: 310, y: 340 }
  },
  {
    id: "north_western",
    name: "North Western",
    cities: ["Kurunegala", "Puttalam", "Chilaw"],
    knownFor: ["Coconut Triangle", "Dolphin Watching", "Hidden Beaches"],
    path: "M175,150c-20,10-50,15-110,-5s-40,80-25,125s45,75,85,55s80-120,50-175z",
    labelPos: { x: 100, y: 230 }
  },
  {
    id: "central",
    name: "Central Province",
    cities: ["Kandy", "Nuwara Eliya", "Matale"],
    knownFor: ["Tea Estates", "Cultural Capital", "Waterfalls"],
    path: "M215,480c-40,-5-75,-50-70,-90s35,-80,65,-80s70,40,75,85c5,45-30,90-70,85z",
    labelPos: { x: 215, y: 395 }
  },
  {
    id: "sabaragamuwa",
    name: "Sabaragamuwa",
    cities: ["Ratnapura", "Kegalle"],
    knownFor: ["Gem Mining", "Rainforests", "Elephant Orphanage"],
    path: "M145,390c25,10,40,50,30,95s-30,70-55,75s-65-30-55-90s40-100,80-80z",
    labelPos: { x: 145, y: 480 }
  },
  {
    id: "western",
    name: "Western Province",
    cities: ["Colombo", "Negombo", "Kalutara"],
    knownFor: ["Economic Hub", "Shopping", "Gourmet Dining"],
    path: "M145,390c-35,10-65,30-85,85s-15,110,25,130s80-60,60-215z",
    labelPos: { x: 95, y: 510 }
  },
  {
    id: "uva",
    name: "Uva Province",
    cities: ["Badulla", "Ella", "Monaragala"],
    knownFor: ["Nine Arch Bridge", "Little Adam's Peak", "Panoramic Views"],
    path: "M285,465c15,60,5,110-35,135s-80,5-105-45s-20-100,80-140c30-10,45-10,60,50z",
    labelPos: { x: 270, y: 530 }
  },
  {
    id: "southern",
    name: "Southern Province",
    cities: ["Galle", "Matara", "Hambantota"],
    knownFor: ["Galle Fort", "Safari", "Whale Watching"],
    path: "M85,605c30,20,100,35,160,25s95-30,110-60s0-50-40-55s-110,15-170,10c-60-5-105-15-125,15s35,45,65,65z",
    labelPos: { x: 220, y: 645 }
  }
];

export function InteractiveMap() {
  const [activeProvince, setActiveProvince] = useState<Province | null>(null);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-transparent group/map px-4 md:px-0">
      {/* Map Background Glow */}
      <div className="absolute inset-20 bg-[#E32E26]/5 blur-[120px] rounded-full pointer-events-none opacity-40" />
      
      {/* SVG Map */}
      <svg 
        viewBox="0 0 400 700" 
        className="w-full h-full max-h-[620px] drop-shadow-2xl relative z-10"
        style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.06))" }}
      >
        <g transform="translate(0, 10)">
          {PROVINCES.map((prov) => (
            <motion.path
              key={prov.id}
              d={prov.path}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                fill: activeProvince?.id === prov.id ? "#E32E26" : "rgba(255, 255, 255, 0.98)",
                stroke: activeProvince?.id === prov.id ? "#fff" : "rgba(227, 46, 38, 0.15)",
                strokeWidth: activeProvince?.id === prov.id ? 2 : 0.6
              }}
              whileHover={{ 
                fill: activeProvince?.id === prov.id ? "#E32E26" : "#E32E2615",
                stroke: "#E32E2640",
                strokeWidth: 1.2,
                zIndex: 10
              }}
              onClick={() => setActiveProvince(prov)}
              className="cursor-pointer transition-all duration-300"
            />
          ))}

          {/* Labels */}
          {PROVINCES.map((prov) => (
            <text
              key={`label-${prov.id}`}
              x={prov.labelPos.x}
              y={prov.labelPos.y}
              textAnchor="middle"
              className="pointer-events-none text-[3px] font-black fill-gray-500 uppercase tracking-[0.2em] opacity-20 select-none italic"
              style={{ fontSize: '2.8px' }}
            >
              {prov.name.split(' ')[0]}
            </text>
          ))}
        </g>
      </svg>

      {/* Floating Info Card */}
      <AnimatePresence mode="wait">
        {activeProvince && (
          <motion.div
            key={activeProvince.id}
            initial={{ opacity: 0, x: 20, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.98 }}
            className="absolute bottom-6 right-6 w-52 lg:w-60 bg-white/95 backdrop-blur-2xl border border-[#E32E26]/10 rounded-[32px] p-5 shadow-[0_20px_50px_rgba(227,46,38,0.12)] z-40"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[7px] font-black uppercase text-[#E32E26] tracking-widest opacity-40 block mb-1">PROVINCE</span>
                  <h3 className="text-base lg:text-lg font-black text-[#141414] leading-tight tracking-tight uppercase italic">{activeProvince.name}</h3>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveProvince(null); }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight size={14} className="rotate-90 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-[#ffebeb]/50 rounded-lg text-[#E32E26]">
                    <MapPin size={9} />
                  </div>
                  <div>
                    <span className="text-[8px] font-bold text-gray-400 block uppercase mb-0.5">Cities</span>
                    <p className="text-[9px] text-[#141414] font-semibold leading-relaxed">{activeProvince.cities.join(" • ")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-[#ffebeb]/50 rounded-lg text-[#E32E26]">
                    <Tag size={9} />
                  </div>
                  <div className="flex-1">
                    <span className="text-[8px] font-bold text-gray-400 block uppercase mb-1">Known For</span>
                    <div className="flex flex-wrap gap-1">
                      {activeProvince.knownFor.map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded-md text-[7px] font-bold text-[#E32E26]/80 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full py-2 bg-[#141414] text-white rounded-xl text-[8px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 hover:bg-black transition-all group/btn shadow-lg mt-1">
                Explore Region
                <ChevronRight size={9} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeProvince && (
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none opacity-15">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Compass size={32} className="text-[#E32E26] mb-4" />
          </motion.div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E32E26] text-center">Select a Province</span>
        </div>
      )}
    </div>
  );
}
