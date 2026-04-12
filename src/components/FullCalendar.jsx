import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';

const FullCalendar = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth());
  const [eliminatedTournaments, setEliminatedTournaments] = useState({});

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // FUNCIÓN PARA NORMALIZAR NOMBRES (Quita guiones, espacios y pasa a minúsculas)
  const normalizeName = (name) => {
    if (!name) return "";
    return name.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  useEffect(() => {
    const fetchAllAndCheckResults = async () => {
      const { data: calendarData } = await supabase
        .from('atp_calendar_2026')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (calendarData) {
        setAllEvents(calendarData);
        
        // CORRECCIÓN: Nombre de tabla en singular 'tournament_matches_2026'
        const { data: matchesData } = await supabase
          .from('tournament_matches_2026') 
          .select('tournament_name, is_win, round')
          .order('match_date', { ascending: false });

        if (matchesData) {
          const eliminationMap = {};
          matchesData.forEach(match => {
            const normalized = normalizeName(match.tournament_name);
            
            // Lógica refinada: Prioriza siempre la derrota
            if (!eliminationMap[normalized] || (eliminationMap[normalized].isEliminated === false && match.is_win === false)) {
              eliminationMap[normalized] = {
                isEliminated: match.is_win === false,
                lastRound: match.round
              };
            }
          });
          setEliminatedTournaments(eliminationMap);
        }
        filterByMonth(calendarData, activeMonth);
      }
    };
    fetchAllAndCheckResults();
  }, [activeMonth]);

  const filterByMonth = (events, monthIndex) => {
    const filtered = events.filter(t => new Date(t.start_date).getMonth() === monthIndex);
    const grouped = filtered.reduce((acc, curr) => {
      const date = curr.start_date;
      if (!acc[date]) acc[date] = [];
      acc[date].push(curr);
      return acc;
    }, {});
    setFilteredSchedule(Object.entries(grouped));
  };

  const handleMonthChange = (index) => {
    setActiveMonth(index);
    filterByMonth(allEvents, index);
  };

  const getSurfaceColor = (surface, category, isFinished, isEntered) => {
    if (!isEntered) return { border: 'border-l-slate-200', card: 'bg-white opacity-30 border-slate-100', title: 'text-slate-300 font-medium', badge: 'bg-slate-50 text-slate-300' };
    if (isFinished) return { border: 'border-l-slate-600', card: 'bg-slate-100 border-slate-200 opacity-90', title: 'text-slate-600 font-black italic line-through decoration-slate-400', badge: 'bg-slate-200 text-slate-500', pulse: 'bg-slate-400' };
    if (category === 'Grand Slam') return { border: 'border-l-amber-600', card: 'bg-amber-400 border-amber-600 shadow-md', title: 'text-amber-950 font-extrabold', badge: 'bg-white text-amber-900', pulse: 'bg-amber-900' };
    
    const configs = {
      Clay: { border: 'border-l-orange-600', card: 'bg-white border-slate-200 shadow-sm', title: 'text-slate-900 font-black', badge: 'bg-orange-600 text-white', pulse: 'bg-orange-600' },
      Grass: { border: 'border-l-green-600', card: 'bg-white border-slate-200 shadow-sm', title: 'text-slate-900 font-black', badge: 'bg-green-600 text-white', pulse: 'bg-green-600' },
      Hard: { border: 'border-l-blue-600', card: 'bg-white border-slate-200 shadow-sm', title: 'text-slate-900 font-black', badge: 'bg-blue-600 text-white', pulse: 'bg-blue-600' }
    };
    return configs[surface] || configs.Hard;
  };

  return (
    <div className="bg-white min-h-screen pb-20 animate-in fade-in duration-500">
      <div className="sticky top-0 z-[40] bg-white border-b border-slate-100 py-6 mb-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 flex justify-between gap-1 overflow-x-auto no-scrollbar">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => handleMonthChange(index)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${
                activeMonth === index 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                  : 'bg-white text-slate-400 border-transparent hover:text-slate-900'
              }`}
            >
              {month}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              {months[activeMonth]} <span className="text-slate-300">2026</span>
            </h2>
          </div>
          <CalendarIcon size={40} className="text-slate-100" />
        </header>

        <div className="space-y-12">
          {filteredSchedule.map(([date, tournaments]) => (
            <div key={date} className="flex flex-col md:flex-row gap-6 md:gap-14">
              <div className="md:w-16 flex md:flex-col items-center gap-4 pt-1 flex-shrink-0">
                <div className="bg-slate-900 w-16 h-16 rounded-sm flex flex-col items-center justify-center text-white shadow-xl">
                  <span className="text-[10px] font-black uppercase opacity-60">
                    {new Date(date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                  <span className="text-2xl font-black italic leading-none">{new Date(date).getDate()}</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {tournaments.map((t) => {
                  const tournamentKey = normalizeName(t.tournament_name);
                  const matchStatus = eliminatedTournaments[tournamentKey];
                  const isFinished = t.status === 'Finished' || (matchStatus && matchStatus.isEliminated);
                  const resultToDisplay = matchStatus?.isEliminated ? matchStatus.lastRound : t.result;
                  const isEntered = t.is_entered;
                  const colors = getSurfaceColor(t.surface, t.category, isFinished, isEntered);
                  
                  return (
                    <div key={t.id} className={`p-6 rounded-sm border-l-[6px] transition-all duration-500 border-y border-r ${colors.card} ${colors.border}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className={`mt-1.5 w-2 h-2 rounded-full ${isEntered && !isFinished ? `${colors.pulse} animate-pulse` : 'bg-slate-300'}`}></div>
                          <div>
                            <h4 className={`text-lg uppercase tracking-tighter leading-none ${colors.title}`}>
                              {t.tournament_name}
                            </h4>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.category}</span>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-tighter ${colors.badge}`}>
                                {t.surface}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-center min-h-[40px]">
                          {isEntered && (
                            isFinished ? (
                              <div className="bg-slate-900 text-white text-[11px] font-black px-3 py-1 uppercase italic tracking-tighter flex items-center gap-2">
                                <CheckCircle2 size={12} className="text-emerald-400" />
                                {resultToDisplay || 'Finished'}
                              </div>
                            ) : (
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 border-2 border-slate-900 bg-white text-slate-900">
                                Confirmed Entry
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullCalendar;