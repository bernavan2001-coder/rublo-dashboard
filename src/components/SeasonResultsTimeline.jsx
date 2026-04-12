import React from 'react';
import { Calendar, Trophy, Zap } from 'lucide-react';
import { useSeasonMatches } from '../hooks/useSeasonMatches';

const SeasonResultsTimeline = () => {
  const { groupedMatches, loading } = useSeasonMatches();

  if (loading) return <div className="max-w-6xl mx-auto p-10 animate-pulse bg-slate-50 rounded-lg mt-12" />;

  const getFinalResult = (matches) => {
    const lastMatch = matches[0]; 
    if (lastMatch.is_win && lastMatch.round === 'F') return 'Champion';
    return lastMatch.round;
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-sans bg-white min-h-screen">
      
      {/* HEADER: ESTILO PERFORMANCE UNIT */}
      <div className="mb-16 flex justify-between items-end border-b-2 border-slate-900 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Historical Log</span>
          </div>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">
            SEASON <span className="text-slate-200">JOURNEY.</span>
          </h2>
        </div>
        <div className="text-right pb-1">
          <p className="text-sm font-black text-slate-900 italic uppercase tracking-widest">A. Rublev // 2026</p>
        </div>
      </div>

      <div className="space-y-24">
        {Object.entries(groupedMatches).map(([tournamentName, matches]) => {
          const firstMatch = matches[0];
          const category = firstMatch.tournament_category;
          const finalResult = getFinalResult(matches);
          const tournamentLogo = firstMatch.logo_url;
          
          return (
            <div key={tournamentName} className="relative group">
              {/* Línea lateral decorativa */}
              <div className="absolute -left-4 top-0 w-[2px] h-full bg-slate-100 group-hover:bg-red-600 transition-colors"></div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                
                {/* LADO IZQUIERDO: TORNEO & RESULTADO */}
                <div className="lg:col-span-4 sticky top-10">
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-16 h-16 flex-shrink-0 bg-white border border-slate-200 rounded-sm p-2 shadow-sm flex items-center justify-center overflow-hidden group-hover:border-red-600 transition-all">
                      {tournamentLogo ? (
                        <img 
                          src={tournamentLogo} 
                          key={tournamentLogo}
                          className="w-full h-full object-contain block" 
                          alt="Tournament Logo" 
                        />
                      ) : (
                        <Trophy size={20} className="text-slate-200" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={10} className="text-red-600 fill-red-600" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{category}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        {tournamentName}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950 p-4 border-r-4 border-red-600 shadow-lg">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Final Result</p>
                      <p className="text-xl font-black italic uppercase leading-none text-white">
                        {finalResult}
                      </p>
                    </div>
                    <div className="bg-slate-50 p-4 border border-slate-100">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <p className="text-xl font-black text-slate-900 italic uppercase leading-none">
                        {matches.some(m => !m.is_win) ? 'FINISHED' : 'ACTIVE'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LADO DERECHO: LISTA DE PARTIDOS */}
                <div className="lg:col-span-8 bg-white border border-slate-200 shadow-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-950 text-white">
                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Round</th>
                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em]">Opponent</th>
                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-right">Result Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {matches.map((match) => (
                        match.opponent_name !== 'BYE' && (
                          <tr key={match.id} className="hover:bg-slate-50 transition-colors group/row">
                            <td className="px-6 py-4">
                              <span className="text-[11px] font-black text-slate-900 uppercase italic">{match.round}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-1 h-4 ${match.is_win ? 'bg-emerald-500' : 'bg-red-600'}`}></div>
                                <span className="text-sm font-bold text-slate-900 uppercase tracking-tight">{match.opponent_name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className={`text-base font-black italic tracking-tighter ${match.is_win ? 'text-slate-900' : 'text-red-600'}`}>
                                {match.score}
                              </span>
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