import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Zap, ChevronRight, Activity, CheckCircle, BarChart2, ChevronLeft } from 'lucide-react';

const SeasonOverview = ({ setActiveTab }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStats, setSelectedStats] = useState(null);

  // --- NUEVO: BLOQUEO DE SCROLL CUANDO EL MODAL ESTÁ ABIERTO ---
  useEffect(() => {
    if (showStatsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup: al desmontar el componente, asegurar que el scroll vuelva
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showStatsModal]);
  // -------------------------------------------------------------

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      const { data: matches } = await supabase
        .from('season_analytics_view')
        .select('*')
        .order('match_date', { ascending: false });

      if (matches && matches.length > 0) {
        const realMatches = matches.filter(m => 
          m.opponent_name && 
          m.opponent_name.toUpperCase() !== 'BYE'
        );

        if (realMatches.length > 0) {
          const lastMatch = realMatches[0];
          const wins = realMatches.filter(m => m.is_win === true).length;
          const totalMatches = realMatches.length;
          const winRateRaw = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

          const getSurfaceStats = (surfaceName) => {
            const sMatches = realMatches.filter(match => match.surface === surfaceName);
            const w = sMatches.filter(m => m.is_win === true).length;
            const totalS = sMatches.length;
            return `${w}/${totalS}`;
          };

          setData({
            lastMatch,
            stats: {
              wins, 
              totalMatches,
              winRate: winRateRaw.toFixed(1) + '%',
              winRateRaw,
              tournamentsPlayed: [...new Set(realMatches.map(m => m.tournament_name))].length,
              titles: realMatches.filter(m => m.round === 'F' && m.is_win === true).length,
              hard: getSurfaceStats('Hard'),
              clay: getSurfaceStats('Clay'),
              grass: getSurfaceStats('Grass'),
              indoor: getSurfaceStats('Hard Indoor')
            }
          });
        }
      }
      setLoading(false);
    };
    fetchAndCalculateStats();
  }, []);

  if (loading || !data) return <div className="h-64 bg-slate-50 animate-pulse rounded-sm max-w-6xl mx-auto border border-slate-200" />;

  const { lastMatch, stats } = data;
  const scoreSets = lastMatch.score?.replace(/,/g, ' ').split(/\s+/).filter(s => s) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-slate-200 shadow-2xl overflow-hidden bg-white max-w-6xl mx-auto rounded-sm font-sans relative">
      
      {/* Patrón de fondo técnico */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* --- PANEL IZQUIERDO: ÚLTIMO PARTIDO --- */}
      <div className="lg:col-span-7 p-8 bg-white border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
        <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${lastMatch.is_win ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Current Status Report</h3>
          </div>
          <div className="bg-red-600 px-3 py-1 text-white text-[9px] font-black uppercase italic tracking-tighter">
            Live Audit
          </div>
        </header>

        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-sm p-2 flex items-center justify-center shadow-md">
              {lastMatch.logo_url ? (
                <img src={lastMatch.logo_url} className="max-w-full max-h-full object-contain" alt="Tournament Logo" />
              ) : (
                <Trophy size={20} className="text-slate-200" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">{lastMatch.tournament_name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-red-600 font-black uppercase tracking-widest">{lastMatch.round}</span>
                <div className="h-3 w-[1px] bg-slate-200"></div>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{lastMatch.surface || 'Verified Court'}</p>
              </div>
            </div>
          </div>

          {/* SCOREBOARD */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-2xl">
            <div className={`flex items-center p-4 border-b border-slate-800 transition-colors ${lastMatch.is_win ? 'bg-emerald-600/90' : 'bg-transparent'}`}>
              <div className="flex items-center gap-3 flex-1 relative">
                <img src="https://flagcdn.com/w40/ru.png" className="w-5 h-auto shadow-sm" alt="RUS" />
                <span className="text-xl font-black uppercase italic tracking-tighter text-white">Andrey Rublev</span>
                {lastMatch.is_win && (
                  <div className="absolute -top-6 -left-3 bg-white px-2 py-0.5 transform -skew-x-12 flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    <CheckCircle size={10} className="text-emerald-600" />
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Winner</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1.5">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-10 h-12 flex items-center justify-center font-black italic text-xl transform -skew-x-6 ${lastMatch.is_win ? 'bg-white text-emerald-600' : 'bg-slate-800 text-slate-400'}`}>
                    {set.split('-')[0]}
                  </div>
                ))}
              </div>
            </div>

            <div className={`flex items-center p-4 relative ${!lastMatch.is_win ? 'bg-emerald-600/90' : 'bg-transparent'}`}>
              <div className="flex items-center gap-3 flex-1 relative">
                {lastMatch.opponent_flag ? (
                  <img src={`https://flagcdn.com/w40/${lastMatch.opponent_flag.trim().toLowerCase()}.png`} className="w-5 h-auto shadow-sm" alt="Opponent Flag" crossOrigin="anonymous" />
                ) : (
                  <div className="w-5 h-3.5 bg-slate-700 rounded-sm"></div>
                )}
                <span className={`text-xl uppercase tracking-tight ${!lastMatch.is_win ? 'text-white font-black italic' : 'text-slate-500 font-bold'}`}>
                  {lastMatch.opponent_name}
                </span>
              </div>
              <div className="flex gap-1.5">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-10 h-12 flex items-center justify-center font-black italic text-xl transform -skew-x-6 ${!lastMatch.is_win ? 'bg-white text-emerald-600' : 'bg-slate-800 text-slate-400'}`}>
                    {set.split('-')[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTÓN DE ESTADÍSTICAS */}
          {lastMatch.stats && (
            <button 
              onClick={() => { setSelectedStats(lastMatch.stats); setShowStatsModal(true); }}
              className="w-full bg-slate-50 border-2 border-slate-200 py-3 flex items-center justify-center gap-3 group hover:bg-slate-900 hover:border-slate-900 transition-all duration-300 shadow-sm"
            >
              <BarChart2 size={16} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-white transition-colors">
                View Official Match Data [+]
              </span>
            </button>
          )}
        </div>

        <footer className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-400 font-black italic text-[10px] uppercase tracking-[0.2em]">
            <Activity size={14} className="text-red-600" />
            Current Session 2026
          </div>
          <button onClick={() => setActiveTab('results')} className="group flex items-center gap-2 text-[#FF0000] font-black italic uppercase text-[9px] tracking-widest hover:text-red-600 transition-colors">
            Full Results View <ChevronRight size={14} className="group-hover:translate-x-1" />
          </button>
        </footer>
      </div>

      {/* --- PANEL DERECHO: ANALYTICS --- */}
      <div className="lg:col-span-5 p-10 bg-slate-50 flex flex-col justify-center border-l border-slate-100 relative">
        <div className="space-y-12 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[2px] w-6 bg-red-600"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Season Statistics</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black italic text-slate-950 tracking-tighter leading-none">{stats.wins}</span>
              <span className="text-4xl font-black italic text-slate-300">/ {stats.totalMatches}</span>
              <div className="ml-4 bg-emerald-500 px-2 py-0.5 transform -skew-x-12">
                <span className="text-[11px] font-black text-white italic tracking-tighter">{stats.winRate}</span>
              </div>
            </div>
            <div className="mt-6 h-2 w-full bg-slate-200 p-[1px]">
              <div className="h-full bg-red-600 transition-all duration-1000" style={{ width: `${stats.winRateRaw}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-10 border-t border-slate-200">
            {[
              { label: 'HARD', val: stats.hard, color: 'bg-blue-600' },
              { label: 'CLAY', val: stats.clay, color: 'bg-orange-600' },
              { label: 'GRASS', val: stats.grass, color: 'bg-emerald-600' },
              { label: 'INDOOR', val: stats.indoor, color: 'bg-slate-800' }
            ].map(s => (
              <div key={s.label}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${s.color}`}></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                </div>
                <span className="text-2xl font-black italic text-slate-950 tracking-tighter">{s.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-950 shadow-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Titles 2026</span>
                <span className="text-3xl font-black italic text-slate-950 tracking-tighter leading-none">{stats.titles}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Events Played</span>
              <span className="text-3xl font-black italic text-slate-400 tracking-tighter leading-none">{stats.tournamentsPlayed}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL DE ESTADÍSTICAS ELITE BROADCAST --- */}
      {showStatsModal && selectedStats && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border-t-8 border-red-600 w-full max-w-2xl shadow-2xl overflow-hidden relative">
            
            {/* Patrón de fondo sutil en el modal */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>

            {/* HEADER COMPACTO E INDUSTRIAL */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-red-600/50">
              <div className="flex items-center gap-3 text-left">
                <Activity size={16} className="text-red-600 animate-pulse" />
                <div>
                  <h3 className="text-white font-black italic uppercase tracking-tighter text-[13px] leading-none">
                    Data Feed <span className="text-red-600 mx-1">//</span> {lastMatch.tournament_name}
                  </h3>
                </div>
              </div>
              <button 
                onClick={() => setShowStatsModal(false)} 
                className="text-slate-400 hover:text-white font-black text-[10px] tracking-widest uppercase transition-colors"
              >
                Close [X]
              </button>
            </div>
            
            <div className="p-8 relative z-10">
              {/* VERSUS HEADER */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 text-left">
                  <h4 className="text-4xl font-black italic uppercase leading-none tracking-tighter text-red-600">A. RUBLEV</h4>
                  <div className="flex items-center gap-2 mt-2">
                    <img src="https://flagcdn.com/w40/ru.png" className="h-3 w-auto opacity-80 grayscale" alt="RUS" />
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Seed 2</span>
                  </div>
                </div>
                <div className="text-slate-200 font-black italic text-3xl px-8 tracking-tighter">VS</div>
                <div className="flex-1 text-right">
                  <h4 className="text-4xl font-black italic uppercase leading-none tracking-tighter text-slate-950">{lastMatch.opponent_name}</h4>
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Unseeded</span>
                    {lastMatch.opponent_flag && (
                      <img src={`https://flagcdn.com/w40/${lastMatch.opponent_flag.trim().toLowerCase()}.png`} className="h-3 w-auto opacity-80 grayscale" alt="Flag" crossOrigin="anonymous" />
                    )}
                  </div>
                </div>
              </div>

              {/* TABLA DE STATS - DATA GRID */}
              <div className="border-2 border-slate-900 bg-slate-50 rounded-sm shadow-inner p-1">
                <div className="space-y-[2px]">
                  {Object.entries(selectedStats).map(([key, data]) => {
                    // Limpieza de strings (ej: "5/10" -> 5) para la lógica visual
                    const rublevVal = parseFloat(data.rublev);
                    const oppVal = parseFloat(data.opponent);
                    const total = (rublevVal + oppVal) || 1;
                    const rublevPct = (rublevVal / total) * 100;
                    const oppPct = (oppVal / total) * 100;
                    const rublevWins = rublevVal > oppVal;

                    return (
                      <div key={key} className="flex items-center bg-white hover:bg-slate-100 transition-colors py-2.5 px-3 group">
                        
                        {/* Dato Rublev */}
                        <div className="w-20 flex items-center gap-2">
                          {rublevWins && <ChevronLeft size={14} className="text-red-600 shrink-0" />}
                          <span className={`text-2xl font-black italic leading-none tracking-tighter ${rublevWins ? 'text-red-600' : 'text-slate-400'}`}>
                            {data.rublev}
                          </span>
                        </div>
                        
                        {/* Etiqueta y Barra de Dominio Central */}
                        <div className="flex-1 flex flex-col items-center px-4">
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.25em] mb-1.5 bg-slate-100 px-2 py-0.5 group-hover:bg-white transition-colors">
                            {key.replace(/_/g, ' ')}
                          </span>
                          
                          {/* Split Bar (Tug of war) */}
                          <div className="w-full flex h-[4px] relative bg-slate-200">
                            {/* Línea central marcadora */}
                            <div className="absolute top-[-2px] bottom-[-2px] left-1/2 w-[2px] bg-slate-900 z-10 -ml-[1px]"></div>
                            
                            <div 
                              className={`h-full transition-all duration-700 ${rublevWins ? 'bg-red-600' : 'bg-red-600/40'}`} 
                              style={{ width: `${rublevPct}%` }}
                            ></div>
                            <div 
                              className={`h-full transition-all duration-700 ${!rublevWins && oppVal > 0 ? 'bg-slate-900' : 'bg-slate-300'}`} 
                              style={{ width: `${oppPct}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Dato Oponente */}
                        <div className="w-20 flex items-center justify-end gap-2">
                          <span className={`text-2xl font-black italic leading-none tracking-tighter ${!rublevWins && oppVal > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                            {data.opponent}
                          </span>
                          {!rublevWins && oppVal > 0 && <ChevronRight size={14} className="text-slate-900 shrink-0" />}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 flex justify-between items-center text-white border-t border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-slate-400">Connection Secure</p>
              </div>
              <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-slate-500">
                Official ATP Match Stats
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonOverview;