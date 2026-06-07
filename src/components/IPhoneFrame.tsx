import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface IPhoneFrameProps {
  children: React.ReactNode;
}

export default function IPhoneFrame({ children }: IPhoneFrameProps) {
  const [timeState, setTimeState] = useState('10:30');

  useEffect(() => {
    // Standard system clock
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeState(`${hours}:${minutes}`);
    };
    updateClock();
    const intervalRef = setInterval(updateClock, 1000 * 30);
    return () => clearInterval(intervalRef);
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] flex items-center justify-center py-6 px-4 font-sans select-none overflow-x-hidden">
      {/* Ambient background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#6366f1]/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-[#a855f7]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Main smartphone frame (Adapts from mock frame on desktop to edge-to-edge on mobile) */}
      <div className="relative w-full max-w-[402px] h-[852px] bg-[#050505] rounded-[52px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border-4 border-[#1c1c1e] md:border-8 md:border-[#1c1c1e] flex flex-col overflow-hidden">
        
        {/* Dynamic Island and glass glares */}
        <div className="absolute top-0 inset-x-0 h-10 bg-[#050505] z-50 flex items-center justify-between px-7 pointer-events-none">
          {/* Time indicator (Left) */}
          <span className="text-[14px] font-semibold text-white/95 font-sans tracking-tight">{timeState}</span>
          
          {/* Apple Dynamic Island Notch */}
          <div className="w-[110px] h-[28px] bg-black rounded-full flex items-center justify-center mt-1.5 border border-white/5 active:w-[114px] active:h-[30px] transition-all duration-300">
            <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-800/60 ml-auto mr-4" />
          </div>

          {/* Right Status Group */}
          <div className="flex items-center gap-1.5 text-white/95">
            <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
            <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
            <div className="flex items-center gap-0.5">
              <span className="text-[11px] font-bold">88%</span>
              <Battery className="w-5 h-3.5 rotate-0" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Dynamic Highlight Glare on Bezel */}
        <div className="absolute inset-px rounded-[44px] border border-white/5 pointer-events-none z-40" />

        {/* The screen rendering container */}
        <div className="flex-1 w-full flex flex-col pt-10 pb-5 overflow-hidden relative">
          {children}
        </div>

        {/* iOS Home Dynamic Bar Indicator */}
        <div className="absolute bottom-1 px-4 inset-x-0 h-4 flex items-center justify-center z-50 pointer-events-none">
          <div className="w-[120px] h-1.5 bg-white/35 rounded-full" />
        </div>
      </div>
    </div>
  );
}
