import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, ChevronDown, User, Zap, Activity, Target } from 'lucide-react';

const HeadToHead = () => {
  const [rivals, setRivals] = useState([]);
  const [selectedRival, setSelectedRival] = useState("");
  const [stats, setStats] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const rublevImg = "https://images2.gazzettaobjects.it/assets-mc/tennis/giocatori/high/andrey_rublev.png";
  const getFlagUrl = (code) => `https://flagcdn.com/w40/${code?.toLowerCase()}.png`;

  const surfaceStyles = {
    'Clay': 'bg-orange-100 border-orange-300 hover:bg-orange-200 text-orange-900',
    'Hard': 'bg-blue-100 border-blue-300 hover:bg-blue-200 text-blue-900',
    'Grass': 'bg-emerald-100 border-emerald-300 hover:bg-emerald-200 text-emerald-900',
    'Hard Indoor': 'bg-slate-300 border-slate-400 hover:bg-slate-400 text-slate-900',
    'Default': 'bg-white border-slate-200 hover:bg-slate-50'
  };

  // 1. EFECTO PARA DETECTAR RIVAL DEL CUADRO ACTUAL (current_draw)
  useEffect(() => {
    const initializeH2H = async () => {
      setLoading(true);
      
      // Consultamos quién es el oponente actual de Rublev
      const { data: drawData } = await supabase
        .from('current_draw')
        .select('opponent')
        .limit(1)
        .single();

      // Consultamos la lista completa de rivales históricos para el selector
      const { data: rivalsData } = await supabase
        .from('h2h_global')
        .select('opponent_name');

      if (rivalsData) {
        const uniqueNames = [...new Set(rivalsData.map(item => item.opponent_name))].sort();
        setRivals(uniqueNames);

        // Si hay un rival en el draw, lo seleccionamos por defecto. 
        // Si no, vamos con Sinner o el primero de la lista.
        if (drawData && drawData.opponent) {
          setSelectedRival(drawData.opponent);
        } else if (uniqueNames.includes("Sinner")) {
          setSelectedRival("Sinner");
        } else {
          setSelectedRival(uniqueNames[0]);
        }
      }
      setLoading(false);
    };

    initializeH2H();
  }, []);

  // 2. EFECTO PARA CARGAR DATA CUANDO CAMBIA EL RIVAL (Manual o Automático)
  useEffect(() => {
    if (selectedRival) fetchH2HData(selectedRival);
  }, [selectedRival]);

  const fetchH2HData = async (name) => {
    setLoading(true);
    const { data } = await supabase.from('h2h_global')
      .select('*')
      .eq('opponent_name', name)
      .order('season_year', { ascending: false });

    if (data && data.length > 0) {
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

      setStats({ 
        rublevWins, 
        opponentWins, 
        total: data.length, 
        surfaces,
        opponentFlag: data[0].opponent_flag 
      });
      setMatches(data);
    } else {
      // Caso: Primer enfrentamiento (como contra Navone)
      setStats({ rublevWins: 0, opponentWins: 0, total: 0, surfaces: {}, opponentFlag: 'un' });
      setMatches([]);
    }
    setLoading(false);
  };

  if (loading) return <div className="h-96 flex items-center justify-center bg-slate-50"><div className="w-12 h-[2px] bg-red-600 animate-pulse"></div></div>;

  return (
    <div className="max-w-6xl mx-auto bg-slate-50 text-slate-900 font-sans p-6 rounded-sm shadow-2xl border border-slate-200 overflow-hidden">
      
      {/* HEADER: AHORA MUESTRA AL RIVAL DEL DRAW POR DEFECTO */}
      {stats && (
        <div className="flex items-center justify-between mb-12 px-6 py-4">
          {/* RUBLEV */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-[4px] border-red-600 overflow-hidden bg-white shadow-xl mb-6 relative">
              <img src={rublevImg} alt="Rublev" className="w-full h-full object-cover object-top" />
            </div>
            <div className="bg-slate-900 rounded-full px-6 py-2 flex items-center justify-between w-64 shadow-md">
              <p className="text-[11px] font-black uppercase tracking-tight text-white leading-none">Andrey Rublev</p>
              <Zap size={14} className="text-red-600" />
            </div>
          </div>

          {/* SCOREBOARD */}
          <div className="flex items-center gap-8">
            <span className="text-8xl font-black italic tracking-tighter text-slate-900">{stats.rublevWins}</span>
            <div className="w-36 h-36 rounded-full border-4 border-transparent border-t-red-600 border-l-red-600 border-b-blue-600 border-r-blue-600 flex flex-col items-center justify-center bg-white shadow-2xl relative">
              <span className="text-xl font-black italic tracking-tighter uppercase text-slate-950">Vs</span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Wins</span>
            </div>
            <span className="text-8xl font-black italic tracking-tighter text-slate-300">{stats.opponentWins}</span>
          </div>

          {/* OPPONENT UNIT (CONECTADO AL DRAW) */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full border-[4px] border-blue-600 overflow-hidden bg-white shadow-xl mb-6 flex items-center justify-center">
               <User size={60} className="text-slate-200" />
            </div>
            <div className="bg-blue-600 text-white rounded-full px-6 py-2 flex items-center justify-between w-72 relative shadow-lg">
              <Search size={14} className="text-white/40" />
              <div className="text-right flex-1 pr-1">
                <select 
                  value={selectedRival}
                  onChange={(e) => setSelectedRival(e.target.value)}
                  className="appearance-none bg-transparent font-black text-xs outline-none text-right w-full cursor-pointer pr-4 uppercase tracking-tight text-white"
                >
                  {/* El rival del draw aparecerá aquí seleccionado */}
                  {rivals.map(name => <option key={name} value={name} className="bg-white text-slate-900">{name}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SURFACE PERFORMANCE */}
      {stats && stats.total > 0 ? (
        <div className="max-w-3xl mx-auto mb-16 bg-[#0B0F19] p-10 rounded-sm border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <h4 className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-white/30 mb-10 relative z-10">Historical Surface Analytics</h4>
          
          <div className="space-y-8 relative z-10">
            {Object.entries(stats.surfaces).map(([surface, data]) => (
              <div key={surface} className="flex items-center justify-between gap-8 group">
                <span className="w-10 text-2xl font-black text-left italic text-red-600">{data.rublev}</span>
                <div className="flex-1 flex flex-col items-center">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{surface}</span>
                  <div className="w-full flex h-2 rounded-full overflow-hidden bg-white/5">
                    <div className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.4)] transition-all duration-1000" style={{ width: `${(data.rublev / data.total) * 100}%` }}></div>
                    <div className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-1000" style={{ width: `${(data.opp / data.total) * 100}%` }}></div>
                  </div>
                </div>
                <span className="w-10 text-2xl font-black text-right italic text-blue-600">{data.opp}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-6 pt-10 border-t border-white/10 mt-10 relative z-10">
              <div className="text-left flex flex-col">
                <span className="text-4xl font-black italic leading-none text-red-600">{stats.rublevWins}</span>
                <span className="text-[8px] font-bold text-white/20 uppercase mt-2 tracking-widest leading-none">Rublev Wins</span>
              </div>
              <div className="text-center">
                 <div className="bg-white/5 px-6 py-2 border border-white/10 rounded-sm inline-block">
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Total Engagements: {stats.total}</span>
                 </div>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-4xl font-black italic text-blue-600 leading-none">{stats.opponentWins}</span>
                <span className="text-[8px] font-bold text-white/20 uppercase mt-2 tracking-widest leading-none">Rival Wins</span>
              </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto mb-16 bg-slate-100 p-20 text-center border-2 border-dashed border-slate-200">
           <Target size={40} className="mx-auto text-slate-300 mb-4" />
           <p className="text-sm font-black uppercase tracking-widest text-slate-400 italic">First Professional Meeting</p>
           <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase">No historical data available for {selectedRival}</p>
        </div>
      )}

      {/* MATCH LOG */}
      {matches.length > 0 && (
        <div className="px-4">
          <div className="flex items-center gap-4 mb-8">
              <div className="h-8 w-1.5 bg-red-600"></div>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">Match <span className="text-slate-300">Log Archive</span></h3>
          </div>
          <div className="mt-4 space-y-2">
            {matches.map((match, idx) => {
              const cardStyle = surfaceStyles[match.surface] || surfaceStyles['Default'];
              const isRublevWin = match.result === 'Win';
              return (
                <div key={idx} className={`grid grid-cols-12 gap-4 items-center py-5 border transition-all px-4 group relative overflow-hidden ${cardStyle}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isRublevWin ? 'bg-red-600' : 'bg-blue-600'}`}></div>
                  <div className="col-span-1 text-xs font-black opacity-60 italic leading-none">{match.season_year}</div>
                  <div className="col-span-4 flex items-center gap-4">
                    <span className={`text-sm font-black uppercase italic tracking-tight ${isRublevWin ? 'text-red-700' : 'text-blue-700'}`}>
                      {isRublevWin ? 'Andrey Rublev' : match.opponent_name}
                    </span>
                  </div>
                  <div className="col-span-3 text-xs font-extrabold text-center uppercase tracking-wide leading-none">{match.tournament_name}</div>
                  <div className="col-span-2 text-[10px] font-black text-center uppercase tracking-widest opacity-60">{match.surface}</div>
                  <div className="col-span-2 text-right text-base font-black italic tracking-tighter">{match.score}</div>
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