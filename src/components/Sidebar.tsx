import { LayoutGrid, Calendar, Laugh, Bell, Lightbulb, User, Maximize, Menu, ChevronLeft } from "lucide-react";
import { useState } from "react";

import { motion, AnimatePresence } from "motion/react";

export type TabType = 'plan' | 'itinerary' | 'inspiration' | 'favorites' | 'updates' | 'profile' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onMaximize?: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, onMaximize, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[70] lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-[80] md:relative md:z-10 w-24 bg-white border-r border-[#E32E26]/10 flex flex-col items-center pt-16 pb-10 gap-12 shrink-0 transition-transform duration-500 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-6 right-6 bg-[#ffebeb] text-[#E32E26] p-2 rounded-xl shadow-sm active:scale-90 transition-all"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>

        <div className="mb-4 px-4 w-full flex justify-center">
          <img 
            src="https://i.ibb.co/HTyxn1fN/logo.png" 
            alt="Trip LK" 
            className="h-10 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setActiveTab('plan')}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-[#E32E26] font-black italic text-xl cursor-pointer">TripLK</span>';
            }}
          />
        </div>

        <nav className="flex flex-col gap-10 flex-1">
          <SidebarIcon icon={LayoutGrid} active={activeTab === 'plan'} onClick={() => { setActiveTab('plan'); setIsOpen(false); }} label="Plan" />
          <SidebarIcon icon={Calendar} active={activeTab === 'itinerary'} onClick={() => { setActiveTab('itinerary'); setIsOpen(false); }} label="Trip" />
          <SidebarIcon icon={Laugh} active={activeTab === 'inspiration'} onClick={() => { setActiveTab('inspiration'); setIsOpen(false); }} label="Explore" />
          <SidebarIcon icon={Bell} active={activeTab === 'updates'} onClick={() => { setActiveTab('updates'); setIsOpen(false); }} label="Updates" />
          <SidebarIcon icon={Lightbulb} active={activeTab === 'favorites'} onClick={() => { setActiveTab('favorites'); setIsOpen(false); }} label="Saved" />
        </nav>

        <div className="flex flex-col gap-10 pb-4">
          <SidebarIcon icon={User} active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setIsOpen(false); }} label="Profile" />
          <SidebarIcon icon={Maximize} onClick={onMaximize} label="Expand" />
        </div>
      </aside>
    </>
  );
}

function SidebarIcon({ icon: Icon, active, onClick, label }: { icon: any, active?: boolean, onClick?: () => void, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all hover:scale-110 group relative ${active ? "bg-[#ffebeb] text-[#E32E26]" : "text-[#888] hover:text-[#E32E26]"}`}
      id={`sidebar-tab-${label.toLowerCase()}`}
    >
      <Icon size={22} strokeWidth={2} />
      {active && <div className="absolute right-[-12px] top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E32E26] rounded-full" />}
      <span className="absolute left-full ml-4 bg-black text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity uppercase tracking-widest whitespace-nowrap z-[100]">
        {label}
      </span>
    </button>
  );
}
