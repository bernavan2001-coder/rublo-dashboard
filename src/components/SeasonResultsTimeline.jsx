import React, { useEffect } from 'react';
import { Trophy, Zap, ChevronRight, Activity } from 'lucide-react'; 
import { useSeasonMatches } from '../hooks/useSeasonMatches';

const SeasonResultsTimeline = ({ onOpenMatchStats, setActiveTab }) => {
  const { groupedMatches, loading } = useSeasonMatches();

  useEffect(() => {
    if (!loading && groupedMatches) {
      const targetTournament = localStorage.getItem('targetTournament');
      if (targetTournament) {
        const element = document.getElementById(targetTournament);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('bg-slate-50/50');
            localStorage.removeItem('targetTournament');
          }, 300);
        }
      }
    }
  }, [loading, groupedMatches]);

  const handleBack = () => {
    if (setActiveTab) {
      setActiveTab('stats');
      setTimeout(() => {
        const savedScroll = localStorage.getItem('scrollBackPosition');
        if (savedScroll) {
          window.scrollTo({
            top: parseInt(savedScroll),
            behavior: 'smooth'
          });
          localStorage.removeItem('scrollBackPosition');
        }
      }, 100);
    }
  };

  if (loading) return (
    <div className="max-w-6xl mx-auto p-10 flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-1 bg-red-600 animate-bounce"></div>
      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-4">Syncing Season Data...</span>
    </div>
  );

  const getFinalResult = (matches) => {
    const lastMatch = matches[0]; 
    if (lastMatch.is_win && lastMatch.round === 'F') return 'Champion';
    return lastMatch.round;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans bg-white min-h-screen relative z-10">
      
      {/* BOTÓN RETURN SIMPLIFICADO */}
      {localStorage.getItem('scrollBackPosition') && (
        <button 
          onClick={handleBack}
          className="mb-16 flex items-center gap-3 group bg-slate-900 text-white px-6 py-2.5 rounded-sm shadow-xl hover:bg-red-600 transition-all animate-in slide-in-from-left-6 duration-500"
        >
          <ChevronRight size={16} className="rotate-180 text-red-600 group-hover:text-white transition-colors" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em]">Return</span>
        </button>
      )}

      {/* HEADER */}
      <div className="mb-20 flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Historical Log</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            SEASON <span className="text-slate-200">JOURNEY.</span>
          </h2>
        </div>
      </div>

      {/* --- LISTADO DE TORNEOS --- */}
      <div className="flex flex-col">
        {Object.entries(groupedMatches).map(([tournamentName, matches]) => {
          const firstMatch = matches[0];
          const category = firstMatch.tournament_category;
          const finalResult = getFinalResult(matches);
          const tournamentLogo = firstMatch.logo_url;
          
          return (
            <div 
              key={tournamentName} 
              id={tournamentName} 
              // CAMBIO CLAVE: py-24 para dar altura al div de cada torneo y border-b para separarlos
              className="relative group border-b border-slate-100 py-8 last:border-0 transition-all duration-700"
            >
              {/* Línea lateral decorativa que se activa en hover */}
              <div className="absolute left-0 top-0 w-[3px] h-full bg-transparent group-hover:bg-red-600 transition-colors"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pl-8">
                
                {/* LADO IZQUIERDO: INFO TORNEO */}
                <div className="lg:col-span-4 sticky top-20">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 flex-shrink-0 bg-white border border-slate-200 rounded-sm p-3 shadow-sm flex items-center justify-center group-hover:border-red-600 transition-all">
                      {tournamentLogo ? (
                        <img src={tournamentLogo} className="w-full h-full object-contain" alt="Logo" />
                      ) : (
                        <Trophy size={24} className="text-slate-200" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={10} className="text-red-600 fill-red-600" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{category}</span>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{tournamentName}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950 p-5 border-r-4 border-red-600 shadow-lg">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Result</p>
                      <p className="text-2xl font-black italic uppercase leading-none text-white">{finalResult}</p>
                    </div>
                    <div className="bg-slate-50 p-5 border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-2xl font-black text-slate-900 italic uppercase leading-none">
                        {matches.some(m => !m.is_win) ? 'FINISHED' : 'ACTIVE'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LADO DERECHO: TABLA */}
                <div className="lg:col-span-8 bg-white border border-slate-200 shadow-2xl overflow-hidden rounded-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-white">
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em]">Round</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em]">Opponent</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em]">Result Score</th>
                        <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.2em] text-center">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matches.map((match) => (
                        match.opponent_name !== 'BYE' && (
                          <tr key={match.id} className="hover:bg-slate-50 transition-colors group/row">
                            <td className="px-6 py-5">
                              <span className="text-[11px] font-black text-slate-900 uppercase italic">{match.round}</span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-5 ${match.is_win ? 'bg-emerald-500' : 'bg-red-600'}`}></div>
                                <span className="text-base font-bold text-slate-900 uppercase tracking-tight">{match.opponent_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`text-lg font-black italic tracking-tighter ${match.is_win ? 'text-slate-900' : 'text-red-600'}`}>
                                {match.score}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <button 
                                onClick={() => onOpenMatchStats && onOpenMatchStats(match)}
                                className="inline-flex items-center justify-center p-2.5 rounded-sm bg-slate-100 text-slate-400 hover:bg-red-600 hover:text-white transition-all group/stat shadow-sm active:scale-90"
                              >
                                <Activity size={16} />
                              </button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonResultsTimeline;