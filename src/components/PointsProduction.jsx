import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Zap, TrendingUp, Activity, Trophy, Search } from 'lucide-react';

const PointsProduction = () => {
  const [production, setProduction] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduction = async () => {
      const { data, error } = await supabase
        .from('points_production_view')
        .select('*')
        .order('last_match_date', { ascending: false });

      if (error) {
        console.error('Error fetching points production:', error);
      } else {
        setProduction(data || []);
      }
      setLoading(false);
    };

    fetchProduction();
  }, []);

  const totalPoints = production.reduce((acc, curr) => acc + curr.points_earned, 0);

  if (loading) return (
    <div className="h-64 bg-slate-50 animate-pulse rounded-sm max-w-5xl mx-auto mt-8 border border-slate-200"></div>
  );

  return (
    <div className="mt-8 font-sans overflow-hidden max-w-5xl mx-auto bg-white p-2 relative shadow-xl border border-slate-200">
      
      {/* HEADER: DISEÑO LIMPIO Y DIRECTO */}
      <div className="flex items-center justify-between mb-4 relative z-10 px-1">
        <div className="flex items-center gap-4">
            <div className="bg-red-600 p-2.5 border border-red-700" style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0% 100%)' }}>
                <Zap size={18} className="text-white" />
            </div>
            <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                    CURRENT POINTS <span className="text-slate-400">IN 2026.</span>
                </h3>
            </div>
        </div>
        
        {/* Marcador Total */}
        <div className="bg-slate-950 p-3 shadow-md relative min-w-[160px]" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0% 100%)' }}>
          <div className="absolute top-0 right-0 w-1 h-full bg-red-600"></div>
          <div className="flex flex-col items-end transform skew-x-3 pr-2">
            <p className="text-3xl font-black italic text-white leading-none tracking-tighter">
              +{totalPoints} <span className="text-red-600 text-lg not-italic font-bold">PTS</span>
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 italic">Total YTD</p>
          </div>
        </div>
      </div>

      {/* SUB-HEADER TÉCNICO SIMPLIFICADO */}
      <div className="bg-slate-50 border border-slate-200 p-2 rounded-sm flex justify-between items-center relative z-10 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
          <p className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] relative">
            2026 SEASON LOG <span className="text-slate-400">| [Rublev, A.]</span>
          </p>
        </div>
        <div className="flex items-center gap-4 text-[9px] text-slate-900 font-bold uppercase tracking-widest">
            <span>Points Earned</span>
        </div>
      </div>

      {/* CUERPO: LISTADO LUMINOSO */}
      <div className="relative z-10 space-y-1.5">
        {production.length > 0 ? (
          production.map((t, index) => (
            <div key={t.tournament_name} 
                 className="group flex items-center p-3 bg-white hover:bg-slate-50 transition-all border border-slate-200 shadow-sm relative overflow-hidden"
                 style={{ clipPath: 'polygon(2% 0, 100% 0, 98% 100%, 0% 100%)' }}>
              
              <div className="flex items-center gap-4 flex-1 relative z-10 pl-2">
                {/* Logo contenedor limpio */}
                <div className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 p-1.5 shrink-0 group-hover:border-red-200 transition-all shadow-sm">
                  {t.tournament_logo_url ? (
                    <img src={t.tournament_logo_url} alt="logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                  ) : (
                    <Trophy size={16} className="text-slate-300" />
                  )}
                </div>

                <div className="flex flex-col">
                  {/* Nombre de torneo itálico */}
                  <h5 className="text-base font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                    {t.tournament_name}
                  </h5>
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <span className="text-[9px] font-extrabold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 uppercase tracking-wider relative" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
                       {t.tournament_category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Puntos Ganados */}
              <div className="w-36 text-right shrink-0 pr-4 relative z-10">
                <div className="flex items-baseline justify-end gap-1.5 relative">
                  <TrendingUp size={16} className="text-emerald-500 group-hover:scale-110 transition-transform mb-1 shrink-0" />
                  <span className="text-3xl font-black italic text-slate-900 group-hover:text-red-600 transition-colors tracking-tighter leading-none relative">
                    +{t.points_earned}
                  </span>
                </div>
              </div>

              {/* Borde lateral sutil de hover */}
              <div className="absolute left-0 top-0 w-[3px] h-full bg-slate-100 group-hover:bg-red-600 transition-colors"></div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center bg-slate-50 border border-slate-200 rounded-sm">
            <Search size={24} className="text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] italic text-[11px]">
              No points data recorded for current season
            </p>
          </div>
        )}
      </div>

      {/* FOOTER: COHERENTE Y CLARO */}
      <div className="bg-slate-950 p-4 mt-3 flex items-center justify-between shadow-md relative overflow-hidden" 
           style={{ clipPath: 'polygon(0 0, 98% 0, 100% 100%, 2% 100%)' }}>
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white rounded-sm">
                <Activity size={16} className="text-slate-900 shrink-0" />
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest relative">
                Data reflects net points earned during the 2026 season. <span className="text-white ml-1 italic">Excludes carry-over points.</span>
            </p>
        </div>
        
        <div className="text-right">
            <span className="text-xl font-black italic text-white tracking-tighter relative pr-2">
                2026
            </span>
        </div>
      </div>
      
    </div>
  );
};

export default PointsProduction;