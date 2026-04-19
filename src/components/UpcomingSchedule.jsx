import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, ChevronRight, X, MapPin, Activity, ShieldAlert, ExternalLink, BarChart3, Thermometer, Wind, Box, Ruler, Zap, History } from 'lucide-react';

const UpcomingSchedule = ({ setActiveTab }) => {
  const [events, setEvents] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [extraInfo, setExtraInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  // --- BLOQUEO DE SCROLL AL ABRIR MODAL ---
  useEffect(() => {
    if (selectedTournament) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedTournament]);

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

  const fetchTournamentIntelligence = async (tournament) => {
    setSelectedTournament(tournament);
    setLoadingInfo(true);
    try {
      const { data } = await supabase
        .from('tournament_info')
        .select('*')
        .eq('tournament_name', tournament.tournament_name)
        .maybeSingle();
      setExtraInfo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInfo(false);
    }
  };

  const getFlagCode = (code) => {
    const map = { 'mon': 'mc', 'esp': 'es', 'fra': 'fr', 'usa': 'us', 'ita': 'it', 'rus': 'ru', 'de': 'de' };
    return map[code?.toLowerCase()] || code;
  };

  return (
    <div className="mt-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-white"></div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Upcoming Unit</span>
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#FF0000] leading-none">
            NEXT <span className="text-[#FF0000]">CHALLENGES.</span>
          </h3>
        </div>
        <button 
          onClick={() => setActiveTab('calendar')}
          className="text-[10px] font-black text-[#FF0000] uppercase tracking-[0.3em] flex items-center gap-1.5 hover:text-white transition-colors group"
        >
          Full Schedule 2026 <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="bg-[#111111] text-white text-[11px] font-black uppercase px-5 py-4 border border-white/10 rounded-t-sm flex items-center justify-between tracking-[0.2em]">
        <div className="flex items-center gap-3">
          <Calendar size={14} className="text-white/40" /> 
          <span>Next 3 Deployments</span>
        </div>
        <span className="text-[9px] opacity-30 font-mono">Sync: Live Archive</span>
      </div>

      {/* --- TABLA BLANCA --- */}
      <div className="border-x border-b border-slate-200 bg-white shadow-sm overflow-hidden">
        {events.map((event, i) => (
          <div key={event.id} className={`relative flex items-center p-6 ${i !== events.length - 1 ? 'border-b border-slate-100' : ''} transition-all duration-300 group hover:bg-slate-50`}>
            <div className="w-24 text-center border-r border-slate-100 pr-4 flex flex-col items-center gap-2">
              <img src={`https://flagcdn.com/w40/${getFlagCode(event.country_code)}.png`} alt="Flag" className="w-7 h-auto border border-slate-100" />
              <p className="text-sm font-black text-slate-900 leading-none">
                {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>

            <div className="flex-1 px-6">
              <p className="text-lg font-black uppercase italic tracking-tighter text-slate-900">{event.tournament_name}</p>
              <div className="flex gap-3">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest ${event.surface === 'Clay' ? 'bg-orange-700 text-white' : 'bg-slate-900 text-white'}`}>{event.surface}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{event.tournament_category}</span>
              </div>
            </div>

            <button 
              onClick={() => fetchTournamentIntelligence(event)}
              className="text-[10px] font-black px-6 py-2.5 rounded-full border border-slate-200 text-slate-900 hover:bg-black hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
            >
              Info <Activity size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* --- MODAL RE-DISEÑADO AL MÁXIMO (PRECISION ANALYTICS) --- */}
      {selectedTournament && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setSelectedTournament(null)}></div>
          
          <div className="relative w-full max-w-6xl h-[90vh] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden rounded-sm flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-white/10">
            
            {/* IMAGEN DE FONDO (FULL AREA) */}
            <div className="absolute inset-0 pointer-events-none">
              <img 
                src={extraInfo?.court_image_url || "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1000"} 
                className="w-full h-full object-cover opacity-50 transition-all duration-1000"
                alt="Venue Background"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-[#0A0A0A]/90"></div>
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* CONTENIDO FRONTAL */}
            <div className="relative z-10 flex flex-col h-full overflow-hidden">
              
              {/* Cabecera Técnica */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black/40 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-4">
                  <BarChart3 size={18} className="text-[#FF0000]" />
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">Unit RE44 // Advanced Performance Scouting</span>
                </div>
                <button onClick={() => setSelectedTournament(null)} className="text-white/40 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Área de Datos */}
              <div className="flex-1 overflow-y-auto p-8 lg:p-14 custom-scrollbar">
                
                {/* Título y Récord Detallado */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12 border-b border-white/10 pb-12">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin size={12} className="text-[#FF0000]" />
                      <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">{selectedTournament.location || 'ATP Tour Venue'}</span>
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-6">
                      {selectedTournament.tournament_name}
                    </h2>
                    <div className="flex gap-4">
                      <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-[9px] font-black text-white uppercase tracking-widest">
                        {selectedTournament.surface}
                      </span>
                      <span className="px-4 py-1.5 bg-[#FF0000]/40 backdrop-blur-md border border-[#FF0000]/50 text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                        {selectedTournament.tournament_category}
                      </span>
                    </div>
                  </div>

                  {/* NUEVO MARCADOR DE RÉCORD (WIN/LOSS) */}
                  <div className="flex gap-1 items-stretch bg-black/60 backdrop-blur-xl border border-white/10 p-1">
                    <div className="bg-white/5 px-6 py-4 text-center min-w-[100px]">
                        <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Win</p>
                        <p className="text-6xl font-extralight text-white leading-none tracking-tighter">{extraInfo?.wins_at_tournament || 0}</p>
                    </div>
                    <div className="bg-[#FF0000]/10 px-6 py-4 text-center min-w-[100px] border-l border-white/5">
                        <p className="text-[8px] font-black text-[#FF0000] uppercase tracking-widest mb-1">Loss</p>
                        <p className="text-6xl font-extralight text-[#FF0000] leading-none tracking-tighter">{extraInfo?.losses_at_tournament || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Grid de Paneles */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* PANEL 1: Legacy */}
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-xl">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 text-white/30">
                      <History size={16} />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Historical Legacy</h4>
                    </div>
                    <div className="space-y-10">
                      <div>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-3">Career Best Finish</p>
                        <p className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none border-l-2 border-[#FF0000] pl-4">
                            {extraInfo?.best_performance_here || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-3">Previous Edition (2025)</p>
                        <p className="text-xl font-bold text-white/90 uppercase italic tracking-tight">{extraInfo?.last_year_result || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* PANEL 2: Physics */}
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-xl">
                    <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4 text-white/30">
                      <Thermometer size={16} />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Environmental Physics</h4>
                    </div>
                    <div className="space-y-6">
                      {[
                        { icon: Zap, label: 'Court Speed', val: extraInfo?.surface_speed },
                        { icon: Wind, label: 'Air Altitude', val: extraInfo?.altitude_level },
                        { icon: Thermometer, label: 'Humidity', val: extraInfo?.humidity_level },
                        { icon: Ruler, label: 'Geometry', val: extraInfo?.court_dimensions },
                        { icon: Box, label: 'Official Ball', val: extraInfo?.ball_type, highlight: true }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                          <div className="flex items-center gap-3 text-white/20 group-hover:text-white transition-colors">
                            <item.icon size={14} /> 
                            <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                          </div>
                          <span className={`text-[10px] font-black uppercase ${item.highlight ? 'text-[#FF0000]' : 'text-white/80'}`}>{item.val || 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PANEL 3: Strategy */}
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 p-8 rounded-sm shadow-xl flex flex-col">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 text-[#FF0000]">
                      <ShieldAlert size={16} />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Technical Strategy</h4>
                    </div>
                    <p className="text-sm text-white/70 font-medium italic leading-relaxed mb-10 flex-1">
                      "{extraInfo?.tactical_briefing || 'Strategic archive loading...'}"
                    </p>
                    <div className="mt-auto pt-8 border-t border-white/10">
                      <div className="flex justify-between items-end mb-3 font-black uppercase tracking-widest">
                          <p className="text-[8px] text-white/30 italic">Ranking Exposure</p>
                          <p className="text-2xl text-white">{selectedTournament.defender_points || 0} <span className="text-[10px] text-white/20">PTS</span></p>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden shadow-inner">
                          <div className="h-full bg-[#FF0000] shadow-[0_0_15px_rgba(255,0,0,0.5)]" style={{ width: `${Math.min(((selectedTournament.defender_points || 0) / 1000) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER ACCIONES */}
              <div className="flex border-t border-white/10 bg-black/80 backdrop-blur-md shrink-0">
                <button 
                  onClick={() => window.open(extraInfo?.official_site_url || selectedTournament.tournament_url, '_blank')}
                  className="flex-1 py-7 bg-white/5 hover:bg-[#FF0000] text-white transition-all text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3"
                >
                  Visit Official Website <ExternalLink size={14} />
                </button>
                <button 
                  onClick={() => setSelectedTournament(null)}
                  className="flex-1 py-7 hover:bg-white/10 text-white/30 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.4em] border-l border-white/10"
                >
                  Exit Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSchedule;