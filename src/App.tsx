/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { ItineraryPanel } from './components/ItineraryPanel';
import { TripPlan, Message } from './types';
import { generateTripPlan, chatWithAI } from './services/geminiService';
import { Plus, Mic, Send, Loader2, X, Map as MapIcon, Heart, Bell, User, Search, Grid, List, Plus as PlusIcon, Check, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from './components/Modal';

import { InteractiveMap } from "./components/InteractiveMap";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isItineraryOpen, setIsItineraryOpen] = useState(false);
  
  // Modal States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isWhenModalOpen, setIsWhenModalOpen] = useState(false);
  const [isWhoModalOpen, setIsWhoModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Criteria States
  const [criteria, setCriteria] = useState({
    destination: "Sri Lanka",
    duration: 7,
    budget: "Mid",
    travelStyle: "mixed",
    groupType: "friends",
    interests: ["Beach", "Culture", "Tea Plantations"],
    travelMonth: "June"
  });

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    const criteriaData = {
      destination: "Sri Lanka",
      duration: 7,
      budget: "mid",
      travelStyle: "mixed",
      groupType: "friends",
      interests: ["Beach", "Culture", "Tea Plantations"]
    };

    const prompt = `Plan a ${criteriaData.duration}-day trip to ${criteriaData.destination}. 
    Budget: ${criteriaData.budget}. Style: ${criteriaData.travelStyle}. 
    Group: ${criteriaData.groupType}. Interests: ${criteriaData.interests.join(", ")}.`;

    const userMessage: Message = {
      role: "user",
      content: `Create a 7-day Sri Lanka itinerary for me.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const plan = await generateTripPlan(prompt);
      setCurrentPlan(plan);
      setIsItineraryOpen(true);
      
      const aiMessage: Message = {
        role: "model",
        content: `Welcome! I've crafted a beautiful 7-day Sri Lanka journey for you. Explore your personal itinerary!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const content = chatInput.trim();
    const newMessage: Message = {
      role: "user",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
    setChatInput("");
    setIsTyping(true);

    try {
      const responseText = await chatWithAI([...messages, newMessage], currentPlan || undefined);
      
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      let cleanResponse = responseText;
      
      if (jsonMatch) {
        try {
          const updatedPlan = JSON.parse(jsonMatch[1]);
          setCurrentPlan(updatedPlan);
          setIsItineraryOpen(true);
          cleanResponse = responseText.replace(/```json[\s\S]*?```/, "(Itinerary updated ⚡)");
        } catch (err) {
          console.error("Failed to parse inline JSON", err);
        }
      }

      const aiMessage: Message = {
        role: "model",
        content: cleanResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onMaximize={() => {}} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <Header 
          onPlanClick={handleGeneratePlan} 
          isLoading={isLoading} 
          onMenuClick={() => setIsSidebarOpen(true)}
          onSegmentClick={(segment) => {
            if (segment === 'Sri Lanka') setIsLocationModalOpen(true);
            if (segment === 'When') setIsWhenModalOpen(true);
            if (segment === 'Group') setIsWhoModalOpen(true);
            if (segment === 'Budget') setIsBudgetModalOpen(true);
            if (segment === 'Preferences' || segment === 'Settings') setActiveTab('profile');
          }}
        />

        <main className="flex-1 flex flex-col px-4 lg:px-10 pb-6 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {activeTab === 'plan' && (
              <motion.div 
                key="plan"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 flex flex-col md:flex-row gap-6 lg:gap-10 overflow-hidden">
                  {/* LEFT SIDE: Welcome Text & Search / Input Panel (~40%) */}
                  <div className="w-full md:flex-[0.42] flex flex-col order-1 md:order-1 overflow-hidden h-full">
                    <div className="flex-1 flex flex-col overflow-y-auto pr-2 md:pr-6 scrollbar-hide py-6 md:py-10">
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative px-2 md:px-0 mb-8 md:mb-12"
                      >
                        <div className="absolute -left-4 top-0 w-1 h-20 bg-[#E32E26] rounded-full opacity-10 hidden md:block" />
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#141414] leading-[0.95] tracking-tighter uppercase italic">
                          Hello <br />
                          <span className="text-[#E32E26]">Welcome !</span>
                        </h2>
                        <p className="mt-4 text-xs md:text-sm text-[#555] opacity-60 leading-relaxed max-w-[280px] font-medium">
                          Your personal guide to Sri Lanka. Explore activities, dining, and premium stays.
                        </p>
                      </motion.div>

                      <AnimatePresence>
                        {(messages.length > 0 || isTyping) && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 px-2 lg:px-0 mb-20"
                          >
                            {messages.map((m, i) => (
                               <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                                  <div className={`p-4 rounded-[1.8rem] max-w-[92%] shadow-sm ${
                                    m.role === 'user' 
                                      ? 'bg-[#141414] text-white rounded-tr-none' 
                                      : 'bg-white text-[#141414] border border-[#E32E26]/10 rounded-tl-none shadow-[0_15px_40px_rgba(0,0,0,0.04)]'
                                  }`}>
                                    <p className="text-[12px] font-medium leading-relaxed">{m.content}</p>
                                  </div>
                                  <p className="text-[8px] text-[#888] mt-1.5 px-2 uppercase font-black tracking-widest opacity-40">
                                    {m.timestamp}
                                  </p>
                               </div>
                            ))}
                            {isTyping && (
                              <div className="flex items-center gap-2 text-[#E32E26] bg-[#ffebeb]/50 px-4 py-2 rounded-full w-fit animate-pulse border border-[#E32E26]/5">
                                <Loader2 className="animate-spin" size={10} strokeWidth={3} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Planning...</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Floating Chat Input at Bottom - Balanced Positioning */}
                    <div className="pt-4 pb-8 md:pb-12 bg-gradient-to-t from-white via-white to-transparent">
                      <form 
                        onSubmit={handleSendMessage}
                        className="w-full border border-[#E32E26]/10 rounded-[28px] md:rounded-[34px] p-2 flex items-center bg-white shadow-[0_25px_60px_rgba(227,46,38,0.1)] transition-all hover:border-[#E32E26]/30 group/input focus-within:shadow-[0_25px_70px_rgba(227,46,38,0.15)] ring-4 ring-[#E32E26]/5"
                      >
                        <div className="flex items-center gap-3 flex-1 pl-4">
                          <button type="button" className="text-[#E32E26]/40 hover:text-[#E32E26] transition-colors">
                            <PlusIcon size={18} />
                          </button>
                          <input 
                            type="text" 
                            placeholder="Ask Anything ..."
                            className="flex-1 outline-none text-sm font-medium text-[#141414] placeholder:text-gray-300"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2 pr-1">
                          <button type="button" className="p-3 text-gray-400 hover:text-[#E32E26] transition-colors rounded-full hover:bg-[#ffebeb]/50">
                            <Mic size={18} />
                          </button>
                          <button 
                            type="submit" 
                            disabled={!chatInput.trim() || isTyping} 
                            className="bg-[#E32E26] text-white p-3.5 rounded-[20px] md:rounded-[24px] hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-lg shadow-[#E32E26]/20 flex items-center justify-center"
                          >
                            <Send size={16} strokeWidth={2.5} />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* RIGHT SIDE: Interactive Map (~60%) */}
                  <div className="w-full md:flex-[0.6] flex items-center justify-center py-2 md:py-4 order-2 md:order-2 h-[80vh] overflow-hidden">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="w-full h-full rounded-[30px] md:rounded-[40px] border-[4px] md:border-[10px] border-[#E32E26]/5 p-0 relative overflow-hidden bg-[#f0f9ff]/30 shadow-[0_30px_60px_-20px_rgba(227,46,38,0.08)] group"
                    >
                      <InteractiveMap />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div 
                key="itinerary"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="h-full flex flex-col bg-[#fcfcfc] rounded-[3rem] p-6 lg:p-12 overflow-hidden shadow-inner border border-[#E32E26]/5"
              >
                <div className="flex items-center justify-between mb-10">
                   <h2 className="text-4xl lg:text-6xl font-black text-[#141414] tracking-tighter uppercase">Your Trips</h2>
                   <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-[#E32E26] transition-all">
                        <PlusIcon size={14} /> New Trip
                      </button>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pr-4 scrollbar-hide pb-10">
                  {currentPlan ? (
                    <TripCard 
                      plan={currentPlan} 
                      onClick={() => setIsItineraryOpen(true)}
                    />
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                      <MapIcon size={80} strokeWidth={1} />
                      <p className="mt-6 font-black uppercase tracking-[0.3em] text-xs">No active trips found</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'inspiration' && (
              <motion.div 
                key="inspiration"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col bg-white overflow-hidden"
              >
                <div className="px-4 lg:px-8 pt-6 lg:pt-12 pb-10 space-y-10">
                   <h2 className="text-4xl lg:text-7xl font-black text-[#141414] tracking-tighter">Inspiration</h2>
                   <div className="relative max-w-4xl">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#888]" size={20} />
                      <input 
                        type="text" 
                        placeholder="Search for location or username"
                        className="w-full bg-[#fcfcfc] border border-[#E32E26]/10 rounded-[2rem] py-5 pl-16 pr-8 text-sm font-medium focus:ring-2 focus:ring-[#E32E26]/20 transition-all"
                      />
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 lg:px-8 space-y-12 pb-20 scrollbar-hide">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-[#141414] tracking-tight uppercase tracking-widest">Featured Guides</h3>
                    <div className="flex gap-2">
                       <button className="p-2 border border-[#E32E26]/10 rounded-lg text-[#E32E26]"><Grid size={18} /></button>
                       <button className="p-2 border border-[#E32E26]/10 rounded-lg text-[#888]"><List size={18} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <InspirationCard title="Culture Jam in Colombo" image="https://images.unsplash.com/photo-1552423502-3490bb9bd59a?w=800&q=80" author="@traveler" />
                    <InspirationCard title="Tea Trails of Ella" image="https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80" author="@wanderer" />
                    <InspirationCard title="Sunrises in Sigiriya" image="https://images.unsplash.com/photo-1582255334370-98319f07a70a?w=800&q=80" author="@explorer" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'updates' && ( activeTab === 'updates' && ( <EmptyTabState icon={Bell} title="Updates" message="No new notifications yet. We'll ping you as your trip approaches!" /> ))}
            {activeTab === 'favorites' && ( <EmptyTabState icon={Heart} title="Collections" message="Save travel inspo to a themed collection so it's easy to find when it's time to plan." buttonLabel="Create a collection" /> )}
            {activeTab === 'profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col bg-[#fcfcfc] rounded-[3rem] p-6 lg:p-12 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
                   <div className="relative group">
                      <div className="w-40 h-40 rounded-[3rem] bg-[#E32E26] flex items-center justify-center text-white text-6xl font-black shadow-2xl overflow-hidden">
                        D
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-black uppercase tracking-widest cursor-pointer">Change</div>
                      </div>
                   </div>
                   <div className="flex-1 space-y-4 text-center lg:text-left">
                      <div>
                        <h2 className="text-4xl lg:text-5xl font-black text-[#141414] tracking-tighter italic uppercase">Dinusha Pushparajah</h2>
                        <p className="text-[#E32E26] font-black uppercase text-xs tracking-widest mt-1 opacity-60">@dinusha-pushparajah</p>
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-8 py-4">
                        <Stat label="Following" value={0} />
                        <Stat label="Followers" value={0} />
                        <Stat label="Trips" value={currentPlan ? 1 : 0} />
                      </div>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E32E26] transition-all">Edit Profile</button>
                        <button className="border border-[#E32E26]/20 text-[#141414] px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-sm">My Settings</button>
                      </div>
                   </div>
                </div>

                <div className="mt-16 flex items-center gap-12 border-b border-[#E32E26]/5 pb-4">
                   <TabLink label="Collections" active />
                   <TabLink label="Reviews" />
                   <TabLink label="Guides" />
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center py-20 grayscale opacity-20">
                   <Grid size={40} strokeWidth={1.5} />
                   <p className="mt-4 font-black uppercase tracking-widest text-[10px]">No public collections yet</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <AnimatePresence>
          {isItineraryOpen && currentPlan && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 w-full lg:w-[550px] z-[90] shadow-2xl bg-white border-l border-[#E32E26]/10"
            >
               <div className="h-full flex flex-col">
                <div className="p-8 border-b border-[#E32E26]/5 flex items-center justify-between bg-white/90 backdrop-blur-xl">
                  <div>
                    <h3 className="font-black uppercase tracking-tighter text-3xl italic">Itinerary</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E32E26]" />
                      <p className="text-[10px] text-[#888] font-black uppercase tracking-widest opacity-60">{currentPlan.destination} Roadtrip</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsItineraryOpen(false)}
                    className="p-4 bg-[#ffebeb] text-[#E32E26] rounded-2xl hover:bg-[#E32E26] hover:text-white transition-all shadow-sm active:scale-90"
                  >
                    <X size={24} strokeWidth={3} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ItineraryPanel plan={currentPlan} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals from Screenshots */}
        <Modal 
          isOpen={isLocationModalOpen} 
          onClose={() => setIsLocationModalOpen(false)} 
          title="Where"
          showUpdate
          onUpdate={() => setIsLocationModalOpen(false)}
        >
          <div className="space-y-8 py-4">
             <div className="relative group">
               <input 
                 type="text" 
                 placeholder="Location"
                 className="w-full text-2xl font-black border-b-2 border-[#141414]/10 focus:border-[#E32E26] outline-none py-4 px-2 placeholder:text-[#141414]/10 transition-all uppercase tracking-tighter"
                 value={criteria.destination}
                 onChange={(e) => setCriteria({...criteria, destination: e.target.value})}
               />
             </div>
             <div className="flex items-center justify-between px-2">
                <span className="font-black uppercase text-xs tracking-widest text-[#141414]">Road trip?</span>
                <button className="w-14 h-8 bg-black rounded-full p-1 relative flex items-center transition-colors hover:bg-[#E32E26]">
                  <div className="w-6 h-6 bg-white rounded-full translate-x-6" />
                </button>
             </div>
          </div>
        </Modal>

        <Modal 
          isOpen={isWhenModalOpen} 
          onClose={() => setIsWhenModalOpen(false)} 
          title="When"
          showUpdate
          onUpdate={() => setIsWhenModalOpen(false)}
        >
          <div className="space-y-12 py-4">
             <div className="flex justify-center p-1 bg-[#fcfcfc] border border-[#E32E26]/5 rounded-2xl">
                <button className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-[#888]">Dates</button>
                <button className="flex-1 py-3 bg-white text-[10px] font-black uppercase tracking-widest text-[#E32E26] rounded-xl shadow-sm border border-[#E32E26]/10">Flexible</button>
             </div>
             
             <div className="text-center space-y-6">
                <h3 className="font-black text-xl italic uppercase tracking-tighter">How many days?</h3>
                <div className="flex items-center justify-center gap-8">
                   <button onClick={() => setCriteria({...criteria, duration: Math.max(1, criteria.duration - 1)})} className="w-12 h-12 rounded-full border border-[#E32E26]/20 flex items-center justify-center text-3xl font-light text-[#E32E26] hover:bg-[#ffebeb] transition-colors">-</button>
                   <span className="text-5xl font-black text-[#141414] italic">{criteria.duration}</span>
                   <button onClick={() => setCriteria({...criteria, duration: criteria.duration + 1})} className="w-12 h-12 rounded-full border border-[#E32E26]/20 flex items-center justify-center text-2xl font-light text-[#E32E26] hover:bg-[#ffebeb] transition-colors">+</button>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-center font-black text-xl italic uppercase tracking-tighter">Travel in {criteria.travelMonth}</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                   {['April', 'May', 'June', 'July', 'August', 'September'].map(month => (
                     <button 
                        key={month} 
                        onClick={() => setCriteria({...criteria, travelMonth: month})}
                        className={`min-w-[120px] p-6 rounded-[2rem] border-2 flex flex-col items-center gap-4 transition-all ${criteria.travelMonth === month ? 'border-[#E32E26] bg-[#ffebeb]' : 'border-[#141414]/5 bg-white opacity-40'}`}
                     >
                        <Calendar size={24} className={criteria.travelMonth === month ? 'text-[#E32E26]' : 'text-[#141414]'} />
                        <span className="font-black uppercase text-[10px] tracking-widest leading-none">{month}</span>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </Modal>

        <Modal 
          isOpen={isWhoModalOpen} 
          onClose={() => setIsWhoModalOpen(false)} 
          title="Who"
          showUpdate
          onUpdate={() => setIsWhoModalOpen(false)}
        >
          <div className="space-y-10 py-6">
             <CounterRow label="Adults" sub="Ages 13 or above" count={2} />
             <CounterRow label="Children" sub="Ages 2-12" count={3} />
             <CounterRow label="Infants" sub="Under 2" count={0} />
             <CounterRow label="Pets" sub="Bringing a service animal?" count={0} />
          </div>
        </Modal>

        <Modal 
          isOpen={isBudgetModalOpen} 
          onClose={() => setIsBudgetModalOpen(false)} 
          title="Budget"
          showUpdate
          onUpdate={() => setIsBudgetModalOpen(false)}
        >
          <div className="space-y-4 py-8">
             <BudgetOption label="Any budget" selected={false} />
             <BudgetOption label="$ On a budget" selected={criteria.budget === 'Economy'} onClick={() => setCriteria({...criteria, budget: 'Economy'})} />
             <BudgetOption label="$$ Sensibly priced" selected={criteria.budget === 'Mid'} onClick={() => setCriteria({...criteria, budget: 'Mid'})} />
             <BudgetOption label="$$$ Upscale" selected={criteria.budget === 'Upscale'} onClick={() => setCriteria({...criteria, budget: 'Upscale'})} />
             <BudgetOption label="$$$$ Luxury" selected={criteria.budget === 'Luxury'} onClick={() => setCriteria({...criteria, budget: 'Luxury'})} />
          </div>
        </Modal>
      </div>
    </div>
  );
}

function TripCard({ plan, onClick }: { plan: TripPlan, onClick: () => void }) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group bg-white rounded-[3rem] p-6 shadow-sm border border-[#E32E26]/10 cursor-pointer overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#E32E26]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
      <div className="w-full h-48 bg-gray-100 rounded-[2.5rem] mb-6 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1546708973-b339540b5162?w=800&q=80" className="w-full h-full object-cover grayscale-50 group-hover:grayscale-0 transition-all duration-500" alt="Sri Lanka" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black uppercase tracking-tighter italic group-hover:text-[#E32E26] transition-colors">{plan.destination} Road Trip</h3>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] opacity-60">{plan.destination} • {plan.duration} days in June</p>
      </div>
    </motion.div>
  );
}

function InspirationCard({ title, image, author }: { title: string, image: string, author: string }) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square rounded-[3rem] overflow-hidden mb-6 shadow-xl">
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img src={image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <button className="absolute top-8 right-8 z-20 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-[#E32E26] transition-all">
          <Heart size={20} />
        </button>
        <div className="absolute bottom-10 left-10 right-10 z-20 text-white space-y-2">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">{author}</p>
          <h4 className="text-2xl font-black uppercase tracking-tight italic leading-none">{title}</h4>
        </div>
      </div>
    </div>
  );
}

function CounterRow({ label, sub, count }: { label: string, sub: string, count: number }) {
  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <h4 className="font-black text-lg italic uppercase tracking-tighter text-[#141414] leading-none">{label}</h4>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#888] mt-2 opacity-60">{sub}</p>
      </div>
      <div className="flex items-center gap-6">
        <button className="w-10 h-10 rounded-xl border border-[#E32E26]/20 flex items-center justify-center text-xl font-light text-[#E32E26] hover:bg-[#ffebeb] transition-colors opacity-40">-</button>
        <span className="text-2xl font-black text-[#141414] italic tabular-nums">{count}</span>
        <button className="w-10 h-10 rounded-xl border border-[#E32E26]/20 flex items-center justify-center text-xl font-light text-[#E32E26] hover:bg-[#ffebeb] transition-colors">+</button>
      </div>
    </div>
  );
}

function BudgetOption({ label, selected, onClick }: { label: string, selected: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${selected ? 'border-[#E32E26] bg-[#ffebeb]' : 'border-[#141414]/5 bg-white hover:border-[#E32E26]/20'}`}
    >
      <span className={`font-black uppercase tracking-[0.1em] text-xs ${selected ? 'text-[#E32E26]' : 'text-[#141414]'}`}>{label}</span>
      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#E32E26] bg-[#E32E26]' : 'border-[#141414]/10'}`}>
        {selected && <Check size={14} className="text-white" strokeWidth={4} />}
      </div>
    </button>
  );
}

function EmptyTabState({ icon: Icon, title, message, buttonLabel }: { icon: any, title: string, message: string, buttonLabel?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center"
    >
      <div className="w-32 h-32 rounded-full bg-[#ffebeb] flex items-center justify-center text-[#E32E26] mb-10 shadow-inner">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-4xl lg:text-6xl font-black text-[#141414] tracking-tighter uppercase mb-6">{title}</h2>
      <p className="text-sm font-medium text-[#888] leading-loose mb-10">{message}</p>
      {buttonLabel && (
        <button className="px-10 py-4 bg-black text-white rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-[#E32E26] transition-all">
          {buttonLabel}
        </button>
      )}
    </motion.div>
  );
}

function Stat({ label, value }: { label: string, value: number }) {
  return (
    <div className="text-center group cursor-default">
      <div className="text-2xl font-black italic text-[#141414] group-hover:text-[#E32E26] transition-colors">{value}</div>
      <div className="text-[9px] font-black uppercase tracking-widest text-[#888] mt-1 opacity-60">{label}</div>
    </div>
  );
}

function TabLink({ label, active }: { label: string, active?: boolean }) {
  return (
    <button className={`pb-4 border-b-2 transition-all font-black uppercase text-[11px] tracking-widest ${active ? 'border-[#E32E26] text-[#E32E26]' : 'border-transparent text-[#888] hover:text-[#141414]'}`}>
      {label}
    </button>
  );
}

function MapMarker({ x, y, label, delay = 0 }: { x: string, y: string, label: string, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", damping: 15, stiffness: 100 }}
      className="absolute flex flex-col items-center group cursor-pointer z-20" 
      style={{ left: x, top: y }}
    >
       <div className="relative">
         <div className="w-8 h-8 bg-[#E32E26]/20 rounded-full animate-ping absolute inset-0" />
         <div className="w-4 h-4 bg-[#E32E26] rounded-full border-2 border-white shadow-xl relative z-10 group-hover:scale-125 transition-transform" />
       </div>
       <div className="bg-[#141414]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md mt-2 shadow-xl border border-white/5 group-hover:-translate-y-0.5 transition-transform">
         <span className="text-[8px] font-bold uppercase tracking-widest whitespace-nowrap italic">
           {label}
         </span>
       </div>
    </motion.div>
  );
}


