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
        // --- LÓGICA DE ÚLTIMO REGISTRO (SIN SUMAR) ---
        // Esto evita que Barcelona sume +50 +100 y te dé 150. 
        // Solo agarra el registro más reciente.
        const filtered = (data || []).reduce((acc, current) => {
          const exists = acc.find(item => item.tournament_name === current.tournament_name);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        setProduction(filtered);
      }
      setLoading(false);
    };

    fetchProduction();
  }, []);

  // Calculamos el total sobre la lista ya consolidada
  const totalPoints = production.reduce((acc, curr) => acc + curr.points_earned, 0);

  if (loading) return (
    <div className="h-64 bg-slate-100 animate-pulse rounded-sm max-w-5xl mx-auto mt-20 border border-slate-200"></div>
  );

  return (
    <div className="mt-24 font-sans max-w-5xl mx-auto px-4 lg:px-0 relative">
      
      {/* --- BARRA DIVISORA DE SECCIÓN --- */}
      <div className="absolute -top-12 left-0 w-full flex items-center gap-4">
        <div className="h-[2px] w-24 bg-red-600"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] whitespace-nowrap">
          Data Stream / Section 02
        </span>
        <div className="h-[1px] flex-1 bg-slate-300"></div>
      </div>

      {/* 1. HEADER & TOTAL SCORE (COLOREADOS) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="bg-red-600 p-3 shadow-[0_0_20px_rgba(220,38,38,0.3)]" style={{ clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0% 100%)' }}>
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-4xl font-black italic uppercase tracking-tighter text-red-600 leading-none">
              CURRENT POINTS <span className="text-slate-400 block text-2xl mt-1 tracking-normal not-italic font-bold">2026 PERFORMANCE</span>
            </h3>
          </div>
        </div>
        
        {/* Marcador Total con Color Destacado */}
        <div className="flex flex-col items-end border-r-4 border-red-600 pr-6">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Season Accumulation</span>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-black italic text-red-600 tracking-tighter leading-none drop-shadow-sm">
              +{totalPoints}
            </span>
            <span className="text-2xl font-black text-white/20 italic uppercase tracking-tighter">pts</span>
          </div>
        </div>
      </div>

      {/* 2. TABLA / LISTADO */}
      <div className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200 overflow-hidden rounded-sm">
        
        {/* SUB-HEADER TÉCNICO */}
        <div className="bg-slate-900 p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">
              Tournament Breakdown <span className="text-white/20 mx-2">//</span> Live Feed
            </p>
          </div>
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">A. Rublev Stats</span>
        </div>

        {/* LISTADO CONSOLIDADO */}
        <div className="divide-y divide-slate-100">
          {production.length > 0 ? (
            production.map((t) => (
              <div key={t.tournament_name} 
                   className="group flex items-center p-5 bg-white hover:bg-slate-50/80 transition-all relative overflow-hidden">
                
                <div className="flex items-center gap-6 flex-1 relative z-10">
                  <div className="w-14 h-14 flex items-center justify-center bg-white border border-slate-100 p-2 shrink-0 group-hover:border-red-600/30 shadow-sm transition-all duration-500">
                    {t.tournament_logo_url ? (
                      <img src={t.tournament_logo_url} alt="logo" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    ) : (
                      <Trophy size={20} className="text-slate-200" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <h5 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                      {t.tournament_name}
                    </h5>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-black text-red-600 bg-red-50 px-2 py-0.5 uppercase tracking-widest border border-red-100">
                         {t.tournament_category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right pr-6">
                  <div className="flex items-center justify-end gap-4">
                    <TrendingUp size={20} className="text-emerald-500 group-hover:translate-y-[-2px] transition-transform" />
                    <span className="text-4xl font-black italic text-slate-900 group-hover:text-red-600 transition-colors tracking-tighter">
                      +{t.points_earned}
                    </span>
                  </div>
                </div>

                <div className="absolute left-0 top-0 w-1.5 h-full bg-transparent group-hover:bg-red-600 transition-colors"></div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center">
              <Search size={32} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[12px]">Database Empty</p>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] text-center border-t border-slate-200 pt-6">
        End of Data Stream <span className="text-red-600 mx-2">●</span> 2026 Analysis
      </p>
      
    </div>
  );
};

export default PointsProduction;