import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Star, ExternalLink, ChevronRight } from 'lucide-react';

const UpcomingSchedule = ({ setActiveTab }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('atp_calendar_2026')
        .select('*')
        .eq('is_entered', true)
        .gte('start_date', today)
        .order('start_date', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error:', error);
      } else {
        setEvents(data);
      }
    };
    fetchUpcoming();
  }, []);

  const getFlagCode = (code) => {
    const map = {
      'mon': 'mc', 'esp': 'es', 'fra': 'fr', 
      'usa': 'us', 'ita': 'it', 'rus': 'ru', 'de': 'de'
    };
    return map[code.toLowerCase()] || code;
  };

  return (
    <div className="mt-10 font-sans">
      
      {/* --- HEADER SUPERIOR (ESTILO RUBLO SHOP) --- */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-white"></div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Upcoming Unit</span>
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            NEXT <span className="text-white/20">CHALLENGES.</span>
          </h3>
        </div>
        <button 
          onClick={() => setActiveTab('calendar')}
          className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-1.5 hover:text-white transition-colors group"
        >
          Full Schedule 2026 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* --- SUB-HEADER TÉCNICO (ESTILO NEGRO MATE RUBLO) --- */}
      <div className="bg-[#111111] text-white text-[11px] font-black uppercase px-5 py-4 border border-white/10 rounded-t-sm flex items-center justify-between tracking-[0.2em]">
        <div className="flex items-center gap-3">
          <Calendar size={14} className="text-white/40" /> 
          <span>Next 3 Deployments</span>
        </div>
        <span className="text-[9px] opacity-30 font-mono">Sync: Live Archive</span>
      </div>

      {/* --- TABLA BLANCA (Mantenemos tu estilo original de legibilidad) --- */}
      <div className="border-x border-b border-slate-200 bg-white shadow-sm overflow-hidden">
        {events.length > 0 ? (
          events.map((event, i) => {
            const isClay = event.surface === 'Clay';
            
            return (
              <div 
                key={event.id} 
                className={`relative flex items-center p-6 ${i !== events.length - 1 ? 'border-b border-slate-100' : ''} 
                  transition-all duration-300 group hover:bg-slate-50`}
              >
                {/* Fecha y Bandera (A color como pediste) */}
                <div className="w-24 text-center border-r border-slate-100 pr-4 flex flex-col items-center gap-2 z-10">
                  {event.country_code && (
                    <img 
                      src={`https://flagcdn.com/w40/${getFlagCode(event.country_code)}.png`} 
                      alt="Flag" 
                      className="w-7 h-auto shadow-sm border border-slate-100 rounded-[1px]"
                    />
                  )}
                  <div>
                    <p className="text-sm font-black text-slate-900 leading-none">
                      {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter italic">Starts</p>
                  </div>
                </div>

                {/* Info Torneo (Texto Negro sobre Blanco) */}
                <div className="flex-1 px-6 z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-lg font-black uppercase italic tracking-tighter text-slate-900 group-hover:text-black">
                      {event.tournament_name}
                    </p>
                    {event.is_champion_here && (
                      <Star size={12} className="fill-yellow-500 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest
                      ${isClay ? 'bg-orange-700 text-white' : 'bg-slate-900 text-white'}`}>
                      {event.surface}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{event.category}</span>
                  </div>
                </div>

                {/* Botón */}
                <a 
                  href={event.tournament_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black px-6 py-2.5 rounded-full border border-slate-200 text-slate-900 hover:bg-black hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 shadow-sm z-10"
                >
                  Info <ExternalLink size={12} />
                </a>
              </div>
            );
          })
        ) : (
          <div className="p-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest bg-white">
            No upcoming events scheduled in the archive.
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingSchedule;