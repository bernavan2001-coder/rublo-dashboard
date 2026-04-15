import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Zap, ChevronRight, Activity, CheckCircle, BarChart2, X } from 'lucide-react';

const SeasonOverview = ({ setActiveTab }) => {
  const [data, setData] = useState(null);
  const [allMatches, setAllMatches] = useState([]); // Nuevo: Guardamos todos para el Momentum
  const [loading, setLoading] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStats, setSelectedStats] = useState(null);

  // Bloqueo de scroll
  useEffect(() => {
    document.body.style.overflow = showStatsModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showStatsModal]);

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      const { data: matches } = await supabase
        .from('season_analytics_view')
        .select('*')
        .order('match_date', { ascending: false });

      if (matches && matches.length > 0) {
        const realMatches = matches.filter(m => 
          m.opponent_name && m.opponent_name.toUpperCase() !== 'BYE'
        );

        setAllMatches(realMatches); // Guardamos la lista filtrada

        if (realMatches.length > 0) {
          const lastMatch = realMatches[0];
          const wins = realMatches.filter(m => m.is_win === true).length;
          const totalMatches = realMatches.length;
          const winRateRaw = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;

          const getSurfaceStats = (surfaceName) => {
            const sMatches = realMatches.filter(match => match.surface === surfaceName);
            const w = sMatches.filter(m => m.is_win === true).length;
            return `${w}/${sMatches.length}`;
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
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* --- PANEL IZQUIERDO: ÚLTIMO PARTIDO --- */}
      <div className="lg:col-span-7 p-8 bg-white border-r border-slate-100 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://www.marketingregistrado.com/img/noticias/barcelona-open-cuales-sponsors.webp" 
               className="w-full h-full object-cover opacity-[0.12] grayscale-[50%]" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-transparent"></div>
        </div>

        <header className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-900 relative z-10">
          <div className="flex items-center gap-3">
            <div className={`h-2.5 w-2.5 rounded-full ${lastMatch.is_win ? 'bg-emerald-500 animate-pulse' : 'bg-red-600'}`}></div>
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Current Status Report</h3>
          </div>
          <div className="bg-red-600 px-3 py-1 text-white text-[9px] font-black uppercase italic tracking-tighter">Live Audit</div>
        </header>

        <div className="space-y-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-sm p-2 flex items-center justify-center shadow-lg">
              {lastMatch.logo_url ? <img src={lastMatch.logo_url} className="max-w-full max-h-full object-contain" alt="Logo" /> : <Trophy size={20} className="text-slate-200" />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 uppercase italic tracking-tighter leading-none">{lastMatch.tournament_name}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[11px] text-red-600 font-black uppercase tracking-widest">{lastMatch.round}</span>
                <div className="h-3 w-[1px] bg-slate-300"></div>
                <p className="text-[11px] text-slate-600 font-bold uppercase tracking-widest">{lastMatch.surface || 'Verified Court'}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-2xl relative">
            {/* Rublev Row */}
            <div className={`flex items-center p-4 border-b border-slate-800 ${lastMatch.is_win ? 'bg-emerald-600/90' : ''}`}>
              <div className="flex-1 flex items-center gap-3">
                <img src="https://flagcdn.com/w40/ru.png" className="w-5 h-auto" alt="RUS" />
                <span className="text-xl font-black uppercase italic text-white">Andrey Rublev</span>
              </div>
              <div className="flex gap-1">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-10 h-12 flex items-center justify-center font-black italic text-xl transform -skew-x-6 ${lastMatch.is_win ? 'bg-white text-emerald-600' : 'bg-slate-800 text-slate-400'}`}>
                    {set.split('-')[0]}
                  </div>
                ))}
              </div>
            </div>
            {/* Opponent Row */}
            <div className={`flex items-center p-4 ${!lastMatch.is_win ? 'bg-emerald-600/90' : ''}`}>
              <div className="flex-1 flex items-center gap-3">
                <img src={`https://flagcdn.com/w40/${lastMatch.opponent_flag?.toLowerCase()}.png`} className="w-5 h-auto" alt="Opp" />
                <span className={`text-xl uppercase ${!lastMatch.is_win ? 'font-black italic text-white' : 'font-bold text-slate-500'}`}>{lastMatch.opponent_name}</span>
              </div>
              <div className="flex gap-1">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-10 h-12 flex items-center justify-center font-black italic text-xl transform -skew-x-6 ${!lastMatch.is_win ? 'bg-white text-emerald-600' : 'bg-slate-800 text-slate-400'}`}>
                    {set.split('-')[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {lastMatch.stats && (
            <button onClick={() => { setSelectedStats(lastMatch.stats); setShowStatsModal(true); }}
                    className="w-full bg-white/50 backdrop-blur-sm border-2 border-slate-200 py-3 flex items-center justify-center gap-3 group hover:bg-slate-900 hover:border-slate-900 transition-all shadow-sm">
              <BarChart2 size={16} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 group-hover:text-white">View Official Match Data [+]</span>
            </button>
          )}
        </div>
      </div>

      {/* --- PANEL DERECHO: ANALYTICS --- */}
      <div className="lg:col-span-5 p-10 bg-slate-50 flex flex-col justify-center border-l border-slate-100">
        <div className="space-y-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-[2px] w-6 bg-red-600"></div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Season Statistics</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black italic text-slate-950 tracking-tighter leading-none">{stats.wins}</span>
              <span className="text-4xl font-black italic text-slate-300">/ {stats.totalMatches}</span>
              <div className="ml-4 bg-emerald-500 px-2 py-0.5 transform -skew-x-12"><span className="text-[11px] font-black text-white italic">{stats.winRate}</span></div>
            </div>
            <div className="mt-6 h-2 w-full bg-slate-200 p-[1px]"><div className="h-full bg-red-600 transition-all" style={{ width: `${stats.winRateRaw}%` }}></div></div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-10 border-t border-slate-200">
            {[{ label: 'HARD', val: stats.hard, color: 'bg-blue-600' }, { label: 'CLAY', val: stats.clay, color: 'bg-orange-600' }, { label: 'GRASS', val: stats.grass, color: 'bg-emerald-600' }, { label: 'INDOOR', val: stats.indoor, color: 'bg-slate-800' }].map(s => (
              <div key={s.label}>
                <div className="flex items-center gap-2 mb-1"><div className={`w-1.5 h-1.5 rounded-full ${s.color}`}></div><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span></div>
                <span className="text-2xl font-black italic text-slate-950 tracking-tighter">{s.val}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 pt-10 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-950 shadow-lg"><Trophy size={24} className="text-white" /></div>
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

      {/* --- MODAL DE ESTADÍSTICAS --- */}
      {/* --- MODAL DE ESTADÍSTICAS ELITE BROADCAST --- */}
{showStatsModal && selectedStats && (
  <div className="fixed inset-0 bg-[#05070a]/95 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4 transition-all">
    <div className="bg-[#0a0c10] border border-white/10 w-full max-w-2xl rounded-xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden relative flex flex-col max-h-[95vh]">
      
      {/* IMAGEN DE FONDO DEL MODAL */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-xl">
        <img 
          src="https://www.marketingregistrado.com/img/noticias/barcelona-open-cuales-sponsors.webp" 
          className="w-full h-full object-cover opacity-35 grayscale-[30%] brightness-[0.6] contrast-[1.1]" 
          style={{ mixBlendMode: 'multiply' }} 
          alt="Background Texture" 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0c10_100%)] opacity-80"></div>
      </div>

      {/* HEADER DEL MODAL */}
      <div className="bg-[#0a0c10]/80 backdrop-blur-sm px-5 py-3 flex justify-between items-center border-b border-white/5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-rose-500/10 rounded-md border border-rose-500/20">
            <Activity size={14} className="text-rose-500 animate-pulse" />
          </div>
          <h3 className="text-white font-black italic uppercase tracking-[0.2em] text-[10px] leading-none">
            Match Analytics <span className="text-rose-600 mx-1.5">///</span> <span className="text-slate-400 line-clamp-1">{lastMatch.tournament_name}</span>
          </h3>
        </div>
        <button onClick={() => setShowStatsModal(false)} className="text-slate-500 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 md:p-6 relative z-10 overflow-hidden flex flex-col">
        {/* VERSUS HEADER CON MOMENTUM */}
        <div className="flex items-center justify-between mb-6 bg-[#05070a]/90 backdrop-blur-sm p-4 rounded-lg border border-white/5 shadow-xl relative z-10">
          <div className="flex-1 text-left">
            <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none tracking-tighter text-white drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]">A. RUBLEV</h4>
            <div className="flex items-center gap-3 mt-2">
              <img src="https://flagcdn.com/w40/ru.png" className="h-3 w-auto rounded-sm opacity-90" alt="RUS" />
              <div className="flex gap-1.5 items-center bg-white/5 px-2 py-1 rounded-md border border-white/5">
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-widest mr-1">Form</span>
                {allMatches.slice(0, 5).map((m, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-500 ${m.is_win ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-600 shadow-[0_0_5px_rgba(225,29,72,0.3)]'} ${i === 0 ? 'scale-125 border border-white/30' : 'scale-100 opacity-60'}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center px-3">
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent mb-1.5"></div>
            <div className="text-rose-600 font-black italic text-lg tracking-widest drop-shadow-[0_0_5px_rgba(225,29,72,0.4)]">VS</div>
            <div className="h-4 w-px bg-gradient-to-t from-transparent via-white/30 to-transparent mt-1.5"></div>
          </div>
          <div className="flex-1 text-right flex flex-col items-end">
            <h4 className="text-2xl md:text-3xl font-black italic uppercase leading-none tracking-tighter text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] line-clamp-1">{lastMatch.opponent_name}</h4>
            <div className="flex items-center justify-end gap-2 mt-2">
              {lastMatch.opponent_flag && <img src={`https://flagcdn.com/w40/${lastMatch.opponent_flag.trim().toLowerCase()}.png`} className="h-3 w-auto rounded-sm opacity-90" alt="Flag" />}
            </div>
          </div>
        </div>

        {/* TABLA DE ESTADÍSTICAS RESTAURADA */}
        <div className="space-y-1.5 overflow-y-auto pr-1 max-h-[55vh] custom-scrollbar relative z-10">
          {Object.entries(selectedStats).map(([key, data]) => {
            const rublevVal = parseFloat(data.rublev) || 0;
            const oppVal = parseFloat(data.opponent) || 0;
            const total = (rublevVal + oppVal) || 1;
            const rublevPct = (rublevVal / total) * 100;
            const oppPct = (oppVal / total) * 100;
            
            // Lógica para estadísticas donde MENOS es MEJOR (Faltas, Errores)
            const isNegativeStat = key.toLowerCase().includes('fault') || key.toLowerCase().includes('error') || key.toLowerCase() === 'df';
            
            let rublevWins = rublevVal !== oppVal && (isNegativeStat ? rublevVal < oppVal : rublevVal > oppVal);
            let oppWins = rublevVal !== oppVal && (isNegativeStat ? oppVal < rublevVal : oppVal > rublevVal);

            return (
              <div key={key} className="flex items-center bg-[#0d1117]/90 hover:bg-[#11161d] border border-white/[0.04] rounded-md transition-all duration-300 py-2 px-3 group shadow-lg">
                {/* Rublev Value */}
                <div className="w-20 flex items-center justify-start gap-2 shrink-0">
                  <span className={`text-lg md:text-xl font-black italic leading-none tracking-tighter ${rublevWins ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-600'}`}>
                    {data.rublev}
                  </span>
                  {rublevWins && <div className="w-1 h-1 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(225,29,72,0.7)] shrink-0"></div>}
                </div>
                
                {/* Middle Bar */}
                <div className="flex-1 flex flex-col items-center px-3 min-w-0">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em] mb-1.5 group-hover:text-white transition-colors truncate w-full text-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <div className="w-full h-1 flex bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 z-10"></div>
                    <div className={`h-full transition-all duration-1000 ${rublevWins ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.7)]' : 'bg-rose-900/40'}`} style={{ width: `${rublevPct}%` }}></div>
                    <div className={`h-full transition-all duration-1000 ${oppWins ? 'bg-slate-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-slate-700/40'}`} style={{ width: `${oppPct}%` }}></div>
                  </div>
                </div>

                {/* Opponent Value */}
                <div className="w-20 flex items-center justify-end gap-2 shrink-0">
                  {oppWins && <div className="w-1 h-1 rounded-full bg-slate-300 shadow-[0_0_6px_rgba(255,255,255,0.4)] shrink-0"></div>}
                  <span className={`text-lg md:text-xl font-black italic leading-none tracking-tighter ${oppWins ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-600'}`}>
                    {data.opponent}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER DEL MODAL */}
      <div className="bg-[#05070a] p-3 flex justify-between items-center border-t border-white/5 relative z-20 mt-auto">
        <div className="flex items-center gap-2">
          <div className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </div>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Secure DB Connection</p>
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-600 opacity-40">ATP Official Records</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default SeasonOverview;