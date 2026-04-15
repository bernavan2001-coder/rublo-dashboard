import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ChevronDown, User, Zap, Activity, Target, Trophy, Flame } from 'lucide-react';

const HeadToHead = () => {
  const [rivals, setRivals] = useState([]);
  const [selectedRival, setSelectedRival] = useState("");
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const rublevImg = "https://images2.gazzettaobjects.it/assets-mc/tennis/giocatori/high/andrey_rublev.png";

  const surfaceStyles = {
    'Clay': 'border-l-orange-500 bg-orange-500/5',
    'Hard': 'border-l-blue-500 bg-blue-500/5',
    'Grass': 'border-l-emerald-500 bg-emerald-500/5',
    'Hard Indoor': 'border-l-purple-500 bg-purple-500/5',
    'Default': 'border-l-slate-500 bg-slate-500/5'
  };

  useEffect(() => {
    const initializeH2H = async () => {
      setLoading(true);
      const { data: drawData } = await supabase.from('current_draw').select('opponent').limit(1).single();
      const { data: rivalsData } = await supabase.from('h2h_global').select('opponent_name');

      if (rivalsData) {
        const uniqueNames = [...new Set(rivalsData.map(item => item.opponent_name))].sort();
        setRivals(uniqueNames);
        if (drawData?.opponent) setSelectedRival(drawData.opponent);
        else if (uniqueNames.includes("Sinner")) setSelectedRival("Sinner");
        else setSelectedRival(uniqueNames[0]);
      }
      setLoading(false);
    };
    initializeH2H();
  }, []);

  useEffect(() => {
    if (selectedRival) fetchH2HData(selectedRival);
  }, [selectedRival]);

  const fetchH2HData = async (name) => {
    setLoading(true);
    const { data } = await supabase.from('h2h_global')
      .select('*')
      .eq('opponent_name', name)
      .order('season_year', { ascending: false });

    if (data?.length > 0) {
      const rublevWins = data.filter(m => m.result === 'Win').length;
      const opponentWins = data.filter(m => m.result === 'Loss').length;
      const surfaces = data.reduce((acc, m) => {
        const s = m.surface.includes('Hard') ? 'Hard' : m.surface;
        acc[s] = acc[s] || { rublev: 0, opp: 0, total: 0 };
        if (m.result === 'Win') acc[s].rublev++;
        else acc[s].opp++;
        acc[s].total++;
        return acc;
      }, {});

      setStats({ rublevWins, opponentWins, total: data.length, surfaces });
      setMatches(data);
    } else {
      setStats({ rublevWins: 0, opponentWins: 0, total: 0, surfaces: {} });
      setMatches([]);
    }
    setLoading(false);
  };

  if (loading) return (
    <div className="h-96 flex flex-col items-center justify-center bg-[#05070a]">
        <div className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-rose-600 font-black tracking-widest text-xs uppercase">Loading Analytics</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-[#0a0c10] text-slate-100 font-sans p-4 md:p-8 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden">
      
      {/* HEADER: ELITE DARK DESIGN */}
      {stats && (
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          {/* RUBLEV SIDE */}
          <div className="flex flex-col items-center z-10">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-b from-rose-600 to-transparent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="w-36 h-36 rounded-full border-2 border-rose-600/30 overflow-hidden bg-slate-900 shadow-2xl relative">
                  <img src={rublevImg} alt="Rublev" className="w-full h-full object-cover object-top brightness-90 hover:brightness-110 transition duration-500" />
                </div>
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1">Elite Pro</h3>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1 rounded-full">
                <span className="text-sm font-black uppercase italic tracking-tight">Rublev</span>
                <Zap size={14} className="text-rose-500 fill-rose-500" />
              </div>
            </div>
          </div>

          {/* CENTRAL SCORE */}
          <div className="flex flex-col items-center">
             <div className="flex items-center gap-6">
                <span className="text-7xl md:text-9xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(225,29,72,0.4)]">{stats.rublevWins}</span>
                <div className="flex flex-col items-center">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
                    <span className="text-2xl font-black italic text-rose-600">VS</span>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/20 to-transparent mt-4"></div>
                </div>
                <span className="text-7xl md:text-9xl font-black italic tracking-tighter text-slate-700">{stats.opponentWins}</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.5em] mt-4">Lifetime H2H Series</p>
          </div>

          {/* RIVAL SIDE */}
          <div className="flex flex-col items-center z-10">
             <div className="w-36 h-36 rounded-full border-2 border-slate-700 overflow-hidden bg-slate-900/50 flex items-center justify-center group">
                <User size={60} className="text-slate-700 group-hover:text-amber-500 transition-colors" />
             </div>
             <div className="mt-4 relative">
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center px-4 py-2 w-64">
                    <select 
                      value={selectedRival}
                      onChange={(e) => setSelectedRival(e.target.value)}
                      className="appearance-none bg-transparent font-black text-xs outline-none w-full cursor-pointer uppercase tracking-widest text-amber-500"
                    >
                      {rivals.map(name => <option key={name} value={name} className="bg-slate-900 text-white">{name}</option>)}
                    </select>
                    <ChevronDown size={14} className="text-amber-500 ml-2" />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {stats && stats.total > 0 ? (
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 bg-[#0d1117] p-8 rounded-2xl border border-white/5 relative shadow-inner">
             <div className="flex items-center gap-3 mb-8">
                <Activity size={18} className="text-rose-500" />
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">Surface Dominance</h4>
             </div>
             
             <div className="space-y-8">
                {Object.entries(stats.surfaces).map(([surface, data]) => (
                  <div key={surface} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{surface}</span>
                      <span className="text-xs font-black italic">{data.rublev} <span className="text-slate-600 mx-1">-</span> {data.opp}</span>
                    </div>
                    <div className="w-full h-1.5 flex rounded-full overflow-hidden bg-white/5">
                      <div className="h-full bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.6)]" style={{ width: `${(data.rublev / data.total) * 100}%` }}></div>
                      <div className="h-full bg-slate-700" style={{ width: `${(data.opp / data.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-gradient-to-br from-rose-900/20 to-transparent p-8 rounded-2xl border border-rose-500/10 flex flex-col justify-center items-center text-center">
                <Trophy size={40} className="text-rose-500 mb-4 opacity-50" />
                <span className="text-5xl font-black italic text-white mb-2">
                    {Math.round((stats.rublevWins / stats.total) * 100)}%
                </span>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Win Probability</span>
                <p className="text-[10px] text-slate-500 mt-4 leading-relaxed uppercase">Based on previous {stats.total} professional encounters</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#0d1117] p-16 text-center rounded-2xl border border-dashed border-white/10 mb-16">
           <Target size={40} className="mx-auto text-slate-700 mb-4" />
           <p className="text-lg font-black uppercase italic text-white">Projected: Match Zero</p>
           <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.2em]">No historical professional records for {selectedRival}</p>
        </div>
      )}

      {/* MATCH LOG: NEO-BRUTALISM DARK */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-8">
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-500 px-4">Historical Archive</h3>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          </div>

          <div className="grid gap-3">
            {matches.map((match, idx) => {
              const borderStyle = surfaceStyles[match.surface] || surfaceStyles['Default'];
              const isWin = match.result === 'Win';
              
              return (
                <div key={idx} className={`group grid grid-cols-12 gap-4 items-center p-4 border border-white/5 rounded-lg transition-all hover:bg-white/5 ${borderStyle} border-l-4`}>
                  <div className="col-span-2 md:col-span-1">
                    <span className="text-xs font-black text-slate-500 italic">{match.season_year}</span>
                  </div>
                  
                  <div className="col-span-10 md:col-span-4 flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isWin ? 'bg-rose-500 shadow-[0_0_8px_rgba(225,29,72,0.8)]' : 'bg-slate-600'}`}></div>
                    <span className={`text-sm font-black uppercase tracking-tight ${isWin ? 'text-white' : 'text-slate-400'}`}>
                      {isWin ? 'Rublev' : match.opponent_name}
                    </span>
                  </div>

                  <div className="hidden md:block col-span-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">{match.tournament_name}</span>
                  </div>

                  <div className="hidden md:block col-span-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase">{match.surface}</span>
                  </div>

                  <div className="col-span-12 md:col-span-2 text-right">
                    <span className="text-sm font-mono font-black tracking-tighter text-rose-500 bg-rose-500/10 px-3 py-1 rounded">
                      {match.score}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeadToHead;