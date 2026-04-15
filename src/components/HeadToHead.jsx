import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ChevronDown, User, Activity, Target, Trophy, MapPin, CheckCircle, X } from 'lucide-react';

const HeadToHead = () => {
  const [rivals, setRivals] = useState([]);
  const [selectedRival, setSelectedRival] = useState("");
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const rublevImg = "https://images2.gazzettaobjects.it/assets-mc/tennis/giocatori/high/andrey_rublev.png";

  const surfaceColors = {
    'Clay': 'bg-orange-100 text-orange-700 border-orange-200',
    'Hard': 'bg-blue-100 text-blue-700 border-blue-200',
    'Grass': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Hard Indoor': 'bg-purple-100 text-purple-700 border-purple-200',
    'Default': 'bg-slate-100 text-slate-700 border-slate-200'
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
    <div className="h-96 flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-1 bg-red-600 animate-bounce"></div>
        <span className="text-slate-900 font-black tracking-widest text-[10px] uppercase mt-4">Analytic Feed Loading...</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-slate-50 text-slate-900 p-4 md:p-8 rounded-sm shadow-xl border border-slate-200 relative overflow-hidden font-sans">
      
      {/* HEADER: PLAYER BATTLE CARD */}
      {stats && (
        <div className="relative flex flex-col md:flex-row items-center justify-between mb-12 gap-8 bg-white p-8 rounded-sm border border-slate-200 shadow-sm">
          
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-red-600 overflow-hidden bg-slate-100 shadow-md">
              <img src={rublevImg} alt="Rublev" className="w-full h-full object-cover object-top" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">ATP Rank #6</span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-950">Andrey Rublev</h2>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-slate-950 text-white px-10 py-6 rounded-sm skew-x-[-10deg] shadow-lg">
             <div className="flex items-center gap-8 skew-x-[10deg]">
                <span className="text-7xl font-black italic tracking-tighter text-red-600">{stats.rublevWins}</span>
                <div className="h-12 w-[2px] bg-white/20"></div>
                <span className="text-7xl font-black italic tracking-tighter text-slate-400">{stats.opponentWins}</span>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.5em] mt-2 skew-x-[10deg] text-slate-500">Global Series</p>
          </div>

          <div className="flex flex-col items-center text-center">
             <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-md">
                <User size={50} className="text-slate-300" />
             </div>
             <div className="mt-4 relative w-64">
                <div className="bg-slate-100 border border-slate-200 rounded-sm flex items-center px-4 py-2 hover:border-red-600 transition-all">
                    <Search size={14} className="text-slate-400 mr-2" />
                    <select 
                      value={selectedRival}
                      onChange={(e) => setSelectedRival(e.target.value)}
                      className="appearance-none bg-transparent font-black text-xs outline-none w-full cursor-pointer uppercase tracking-widest text-slate-900"
                    >
                      {rivals.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                    <ChevronDown size={14} className="text-red-600 ml-2" />
                </div>
             </div>
          </div>
        </div>
      )}

      {/* ANALYTICS SECTION */}
      {stats && stats.total > 0 ? (
        <div className="bg-white p-8 rounded-sm border border-slate-200 mb-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
            <Activity size={18} className="text-red-600" />
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Surface Performance Analytics</h4>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(stats.surfaces).map(([surface, data]) => (
              <div key={surface} className="bg-slate-50 p-4 border-l-4 border-red-600 rounded-sm">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{surface}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black italic text-slate-950">{data.rublev}-{data.opp}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">W/L</span>
                </div>
                <div className="w-full h-1 bg-slate-200 mt-2 rounded-full overflow-hidden flex">
                    <div className="h-full bg-red-600" style={{ width: `${(data.rublev / data.total) * 100}%` }}></div>
                    <div className="h-full bg-slate-400" style={{ width: `${(data.opp / data.total) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-sm border-2 border-dashed border-slate-200 mb-8">
           <Target size={30} className="mx-auto text-slate-200 mb-4" />
           <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 italic">No Professional Records Available for {selectedRival}</p>
        </div>
      )}

      {/* MATCH ARCHIVE - FINE BOXES WITH STATUS COLORS */}
      {matches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Match Log Archive</h3>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
          </div>

          <div className="grid gap-1.5">
            {matches.map((match, idx) => {
              const isWin = match.result === 'Win';
              const rowStyles = isWin 
                ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm' 
                : 'bg-rose-600 text-white border-rose-700 shadow-sm';

              return (
                <div key={idx} className={`flex flex-col md:flex-row md:items-center justify-between py-2 px-5 ${rowStyles} border transition-transform hover:scale-[1.005] duration-200 rounded-sm relative overflow-hidden group`}>
                  
                  <div className="absolute left-1 top-1 text-[8px] font-black opacity-30 italic">
                    #{matches.length - idx}
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="flex flex-col min-w-[40px]">
                      <span className="text-lg font-black italic leading-none">{match.season_year}</span>
                      <span className="text-[7px] font-bold uppercase tracking-widest opacity-70">Season</span>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <h5 className="text-sm font-black uppercase tracking-tight leading-none">{match.tournament_name}</h5>
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/20 border border-white/10">
                          {match.surface}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin size={9} className="opacity-70" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter opacity-80">{match.round || 'Main Draw'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center md:justify-end gap-8 mt-2 md:mt-0 border-t md:border-t-0 border-white/10 pt-2 md:pt-0">
                    <div className="text-right">
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Vs. {match.opponent_name}</span>
                       <div className="text-xl font-black italic tracking-tighter leading-none mt-0.5">{match.score}</div>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 border border-white/20">
                       {isWin ? <Trophy size={16} /> : <X size={16} />}
                    </div>
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