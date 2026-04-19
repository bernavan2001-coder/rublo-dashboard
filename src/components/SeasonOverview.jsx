import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Activity, BarChart2, X } from 'lucide-react';

const SeasonOverview = ({ setActiveTab }) => {
  const [data, setData] = useState(null);
  const [allMatches, setAllMatches] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStats, setSelectedStats] = useState(null);

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
        setAllMatches(realMatches);

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
              wins, totalMatches,
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
      
      {/* --- PANEL IZQUIERDO: BROADCAST CLARITY --- */}
      <div className="lg:col-span-7 p-6 bg-white border-r border-slate-100 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://www.marketingregistrado.com/img/noticias/barcelona-open-cuales-sponsors.webp" className="w-full h-full object-cover opacity-[0.06] grayscale" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent"></div>
        </div>

        <header className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            {/* 2. Efecto Glow en el indicador Live */}
            <div className={`h-2 w-2 rounded-full ${lastMatch.is_win ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-red-600'}`}></div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">Live Status Report</h3>
          </div>
          <div className="bg-red-600 px-2 py-0.5 text-white text-[8px] font-black uppercase italic shadow-lg shadow-red-200">Live Audit</div>
        </header>

        <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white border border-slate-200 rounded-sm p-1.5 flex items-center justify-center shadow-md">
              {lastMatch.logo_url ? <img src={lastMatch.logo_url} className="max-w-full max-h-full object-contain" alt="Logo" /> : <Trophy size={16} className="text-slate-200" />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter leading-tight">{lastMatch.tournament_name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-red-600 font-black uppercase tracking-widest">{lastMatch.round}</span>
                <span className="text-slate-300">|</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lastMatch.surface || 'Verified Court'}</p>
              </div>
            </div>
          </div>

          {/* MARCADOR SLIM CON SOMBRA DIRECCIONAL */}
          <div className="bg-slate-900 border border-slate-800 rounded-sm overflow-hidden shadow-[10px_10px_20px_-10px_rgba(0,0,0,0.5)]">
            <div className={`flex items-center px-4 py-2.5 border-b border-slate-800 ${lastMatch.is_win ? 'bg-emerald-600/80' : ''}`}>
              <div className="flex-1 flex items-center gap-3">
                <img src="https://flagcdn.com/w40/ru.png" className="w-4 h-auto shadow-sm" alt="RUS" />
                <span className="text-lg font-black uppercase italic text-white tracking-tight">A. Rublev</span>
              </div>
              <div className="flex gap-1">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-8 h-9 flex items-center justify-center font-black italic text-base transform -skew-x-6 ${lastMatch.is_win ? 'bg-white text-emerald-600 shadow-inner' : 'bg-slate-800 text-slate-500'}`}>
                    {set.split('-')[0]}
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex items-center px-4 py-2.5 ${!lastMatch.is_win ? 'bg-emerald-600/80' : ''}`}>
              <div className="flex-1 flex items-center gap-3">
                {lastMatch.opponent_flag && <img src={`https://flagcdn.com/w40/${lastMatch.opponent_flag?.toLowerCase()}.png`} className="w-4 h-auto shadow-sm" alt="Opp" />}
                <span className={`text-lg uppercase tracking-tight ${!lastMatch.is_win ? 'font-black italic text-white' : 'font-bold text-slate-500'}`}>{lastMatch.opponent_name}</span>
              </div>
              <div className="flex gap-1">
                {scoreSets.map((set, i) => (
                  <div key={i} className={`w-8 h-9 flex items-center justify-center font-black italic text-base transform -skew-x-6 ${!lastMatch.is_win ? 'bg-white text-emerald-600 shadow-inner' : 'bg-slate-800 text-slate-500'}`}>
                    {set.split('-')[1]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* --- BOTONES DE ACCIÓN: STATS & RESULTS --- */}
<div className="flex gap-2 mt-4">
  {/* Botón Match Stats (Abre el Modal) */}
  {lastMatch.stats && (
    <button 
      onClick={() => { setSelectedStats(lastMatch.stats); setShowStatsModal(true); }}
      className="flex-1 bg-white/40 backdrop-blur-md border border-slate-200 py-3 flex items-center justify-center gap-3 group hover:bg-slate-950 transition-all rounded-sm shadow-sm"
    >
      <BarChart2 size={14} className="text-red-600" />
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-white">
        Match Stats [+]
      </span>
    </button>
  )}

  {/* Botón Match Results (Redirige al Timeline) */}
  <button 
    onClick={() => {
      // 1. Cambiamos a la pestaña donde está el SeasonResultsTimeline
      setActiveTab('results'); // Asegúrate que 'results' sea el ID de tu tab del timeline
      
      // 2. Guardamos el torneo en el storage para que el Timeline sepa a dónde scrollear
      localStorage.setItem('targetTournament', lastMatch.tournament_name);
      
      // 3. Opcional: Pequeño delay para asegurar que el componente cargue antes de scrollear
      setTimeout(() => {
        const element = document.getElementById(lastMatch.tournament_name);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          element.classList.add('bg-slate-50/50'); // Efecto de resaltado temporal
        }
      }, 100);
    }}
    className="flex-1 bg-slate-50/60 backdrop-blur-md border border-slate-200 py-3 flex items-center justify-center gap-3 group hover:bg-red-600 transition-all rounded-sm shadow-sm"
  >
    <Activity size={14} className="text-slate-400 group-hover:text-white" />
    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover:text-white">
      Season Results
    </span>
  </button>
</div>
        </div>
      </div>

      {/* --- PANEL DERECHO: TIPOGRAFÍA EDITORIAL --- */}
      <div className="lg:col-span-5 p-8 bg-slate-50 flex flex-col justify-center border-l border-slate-100">
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-[1.5px] w-5 bg-red-600"></div>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Season Stats</span>
            </div>
            <div className="flex items-baseline gap-2">
              {/* 1. Tipografía Editorial: tracking-tighter y skew sutil */}
              <span className="text-7xl font-black italic text-slate-950 tracking-tighter leading-none transform -skew-x-2">{stats.wins}</span>
              <span className="text-3xl font-black italic text-slate-300">/ {stats.totalMatches}</span>
              <div className="ml-2 bg-emerald-500 px-2 py-0.5 transform -skew-x-12 shadow-[0_4px_10px_rgba(16,185,129,0.3)]">
                <span className="text-[10px] font-black text-white italic">{stats.winRate}</span>
              </div>
            </div>
            <div className="mt-4 h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 transition-all duration-1000 ease-out" style={{ width: `${stats.winRateRaw}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-8 border-t border-slate-200">
            {[{ label: 'HARD', val: stats.hard, color: 'bg-blue-600' }, { label: 'CLAY', val: stats.clay, color: 'bg-orange-600' }, { label: 'GRASS', val: stats.grass, color: 'bg-emerald-600' }, { label: 'INDOOR', val: stats.indoor, color: 'bg-slate-800' }].map(s => (
              <div key={s.label}>
                <div className="flex items-center gap-2 mb-0.5"><div className={`w-1 h-1 rounded-full ${s.color}`}></div><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span></div>
                <span className="text-xl font-black italic text-slate-950 tracking-tighter">{s.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- MODAL CLARO CON ESTILO BROADCAST --- */}
      {showStatsModal && selectedStats && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
            
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-slate-100 relative z-10">
              <div className="flex items-center gap-3">
                <Activity size={18} className="text-red-600 animate-pulse" />
                <h3 className="text-slate-900 font-black italic uppercase tracking-widest text-[11px]">Match Analytics Data</h3>
              </div>
              <button onClick={() => setShowStatsModal(false)} className="text-slate-400 hover:text-red-600 transition-colors p-1 hover:bg-slate-100 rounded-full">
                <X size={22} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-inner">
                <div className="flex-1 flex items-center gap-4 text-left">
                  <img src="https://flagcdn.com/w80/ru.png" className="h-10 w-auto rounded shadow-sm border border-white" alt="RUS" />
                  <div>
                    <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter leading-none transform -skew-x-2">A. Rublev</h4>
                    <div className="flex gap-1.5 items-center mt-2">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mr-1">Last 5 Matches</span>
                      {allMatches.slice(0, 5).map((m, i) => (
                        <div key={i} className={`w-2.5 h-2.5 rounded-full ${m.is_win ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.5)]'}`} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 text-red-600 font-black italic text-xl drop-shadow-sm">VS</div>

                <div className="flex-1 flex items-center justify-end gap-4 text-right">
                  <div>
                    <h4 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter leading-none transform -skew-x-2 line-clamp-1">{lastMatch.opponent_name}</h4>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">Opponent Record</span>
                  </div>
                  {lastMatch.opponent_flag && <img src={`https://flagcdn.com/w80/${lastMatch.opponent_flag.trim().toLowerCase()}.png`} className="h-10 w-auto rounded shadow-sm border border-white" alt="Flag" />}
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(selectedStats).map(([key, data]) => {
                  const rublevVal = parseFloat(data.rublev) || 0;
                  const oppVal = parseFloat(data.opponent) || 0;
                  const total = (rublevVal + oppVal) || 1;
                  const rublevPct = (rublevVal / total) * 100;
                  const oppPct = (oppVal / total) * 100;
                  
                  const isNegativeStat = key.toLowerCase().includes('fault') || key.toLowerCase().includes('error') || key.toLowerCase() === 'df';
                  let rublevWins = rublevVal !== oppVal && (isNegativeStat ? rublevVal < oppVal : rublevVal > oppVal);
                  let oppWins = rublevVal !== oppVal && (isNegativeStat ? oppVal < rublevVal : oppVal > rublevVal);

                  return (
                    <div key={key} className="bg-white border border-slate-100 rounded-xl p-3 hover:bg-slate-50 transition-colors shadow-sm">
                      <div className="flex justify-between items-end mb-2">
                        <span className={`text-xl font-black italic tracking-tighter ${rublevWins ? 'text-slate-900 drop-shadow-sm' : 'text-slate-300'}`}>{data.rublev}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</span>
                        <span className={`text-xl font-black italic tracking-tighter ${oppWins ? 'text-slate-900 drop-shadow-sm' : 'text-slate-300'}`}>{data.opponent}</span>
                      </div>
                      <div className="w-full h-1.5 flex bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${rublevWins ? 'bg-red-600' : 'bg-slate-200'}`} style={{ width: `${rublevPct}%` }}></div>
                        <div className={`h-full transition-all duration-1000 ${oppWins ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ width: `${oppPct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-3 border-t border-slate-100 flex justify-center">
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-300">Official Records Archive 2026</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonOverview;