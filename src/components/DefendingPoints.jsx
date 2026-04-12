import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShieldAlert, Target, TrendingDown, Trophy, CheckCircle2, Activity } from 'lucide-react';

const DefendingPoints = () => {
  const [points, setPoints] = useState([]);
  
  const totalDefending = points.reduce((acc, curr) => acc + curr.points_to_defend, 0);
  const totalEarned = points.reduce((acc, curr) => acc + (curr.points_earned_now || 0), 0);

  const getFlag = (tournament) => {
    const flags = {
      'Monte-Carlo': 'mc', 'Madrid': 'es', 'Rome': 'it',
      'Roland Garros': 'fr', 'Hamburg': 'de', 'Barcelona': 'es'
    };
    return flags[tournament] || 'un';
  };

  useEffect(() => {
    const fetchPointsAndLogos = async () => {
      const { data: pointsData } = await supabase
        .from('defending_points')
        .select('*');

      const { data: calendarData } = await supabase
        .from('atp_calendar_2026')
        .select('tournament_name, tournament_logo_url, start_date'); // Añadimos start_date

      if (pointsData && calendarData) {
        const combined = pointsData.map(point => {
          const clean = (name) => name?.toString().toLowerCase().trim();
          const match = calendarData.find(cal => {
            const calName = clean(cal.tournament_name);
            const pointName = clean(point.tournament_name);
            return calName && pointName && (calName.includes(pointName) || pointName.includes(calName));
          });
          return {
            ...point,
            tournament_logo_url: match ? match.tournament_logo_url : null,
            start_date: match ? match.start_date : '2026-12-31' // Fallback para el final del año
          };
        });

        // ORDEN CRONOLÓGICO: Del más cercano al más lejano
        const sorted = combined.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        setPoints(sorted);
      }
    };
    fetchPointsAndLogos();
  }, []);

  return (
    <div className="mt-12 font-sans overflow-hidden">
      
      {/* HEADER: LIVE PROGRESS */}
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-[2px] w-8 bg-red-600"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Live Points Defense</span>
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
            DEFENSE <span className="text-slate-200">TRACKER.</span>
          </h3>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-slate-900 leading-none tracking-tighter italic">
            {totalEarned} <span className="text-slate-200 text-2xl">/ {totalDefending}</span>
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Points Secured</p>
        </div>
      </div>

      {/* SUB-HEADER TÉCNICO */}
      <div className="bg-slate-950 border border-slate-900 p-5 rounded-t-sm flex justify-between items-center relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <div className="flex items-center gap-3">
          <TrendingDown size={14} className="text-red-600" />
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Live ATP Points Audit</p>
        </div>
        <div className="flex items-center gap-4">
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest animate-pulse">
                {totalDefending > 0 ? ((totalEarned / totalDefending) * 100).toFixed(1) : 0}% Recovered
            </span>
        </div>
      </div>

      {/* CUERPO: TABLA DE DEFENSA */}
      <div className="bg-white border-x border-b border-slate-200 shadow-sm overflow-hidden">
        {points.map((p) => {
          const earned = p.points_earned_now || 0;
          const defenseProgress = (earned / p.points_to_defend) * 100;
          const isSecured = earned >= p.points_to_defend;
          
          return (
            <div key={p.id} className="group flex items-center p-5 border-b border-slate-100 hover:bg-slate-50 transition-all">
              
              {/* 1. INFO TORNEO */}
              <div className="flex items-center gap-5 flex-1">
                <div className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 rounded-sm p-1.5 shrink-0 shadow-sm relative">
                  {p.tournament_logo_url ? (
                    <img src={p.tournament_logo_url} alt="logo" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Trophy size={16} className="text-slate-200" />
                  )}
                  {isSecured && (
                    <div className="absolute -top-1 -right-1 bg-white rounded-full">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  <h5 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none">
                    {p.tournament_name}
                  </h5>
                  <div className="flex items-center gap-2 mt-1">
                    {/* BANDERAS A COLOR: Eliminado grayscale y opacity */}
                    <img 
                      src={`https://flagcdn.com/w40/${getFlag(p.tournament_name)}.png`} 
                      alt="flag" className="w-4 h-auto shadow-sm border border-slate-100 rounded-[1px]" 
                    />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {p.last_instance} <span className="mx-1">•</span> Defending {p.points_to_defend} pts
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. PROGRESS BAR & LIVE CALC */}
              <div className="w-56 text-right shrink-0">
                <div className="flex items-baseline justify-end gap-2 mb-1.5">
                  <span className={`text-2xl font-black font-mono leading-none ${isSecured ? 'text-emerald-500' : 'text-slate-950'}`}>
                    {earned}
                  </span>
                  <span className="text-[10px] font-black text-slate-300 uppercase italic">/ {p.points_to_defend}</span>
                </div>
                
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200 p-[1px]">
                    <div 
                        className={`h-full rounded-full transition-all duration-1000 ${isSecured ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`}
                        style={{ width: `${Math.min(defenseProgress, 100)}%` }}
                    ></div>
                </div>
                <p className="text-[7px] font-black text-slate-400 uppercase mt-2 tracking-tighter italic">
                   {isSecured ? 'POINTS FULLY RE-VALIDATED' : `UNDER DEFENSE: ${p.points_to_defend - earned} PTS REMAINING`}
                </p>
              </div>

            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <div className="bg-slate-50 p-6 border-x border-b border-slate-200 rounded-b-sm flex items-center justify-between">
        <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Activity size={20} className="text-red-600 shrink-0" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase tracking-wider max-w-md">
                    Live updates are triggered by the <span className="text-red-600 font-bold italic underline decoration-1 underline-offset-2">ATP PERFORMANCE UNIT</span>. Points are moved from "Defending" to "Secured" upon match completion.
                </p>
            </div>
        </div>
        
        <div className="text-right">
            <span className="text-3xl font-black italic text-slate-900">
                {totalDefending > 0 ? ((totalEarned / totalDefending) * 100).toFixed(0) : 0}%
            </span>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Total Recovery</p>
        </div>
      </div>
    </div>
  );
};

export default DefendingPoints;