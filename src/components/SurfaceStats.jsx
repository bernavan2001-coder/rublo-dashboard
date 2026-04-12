import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Activity, BarChart3, Layers } from 'lucide-react';

const SurfaceStats = () => {
  const [surfaces, setSurfaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurfaces = async () => {
      const { data } = await supabase
        .from('match_win_rates_surface')
        .select('*')
        .order('win_rate', { ascending: false });

      if (data) setSurfaces(data);
      setLoading(false);
    };
    fetchSurfaces();
  }, []);

  if (loading) return <div className="py-20 text-center animate-pulse text-slate-500 font-mono text-xs uppercase tracking-widest">Fetching Telemetry...</div>;

  return (
    <section className="py-24 px-12 bg-[#020617] border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Técnico */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <Activity size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Efficiency Metrics</span>
            </div>
            <h2 className="text-4xl font-light tracking-tighter text-white uppercase">
              Court <span className="font-black italic">Performance</span>
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-mono uppercase">Update: March 2026</p>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">Data Source: ATP Official / Opta</p>
          </div>
        </div>

        {/* Grid de Datos */}
        <div className="grid md:grid-cols-3 gap-1 border-l border-slate-800">
          {surfaces.map((s) => (
            <div key={s.id} className="group p-8 hover:bg-slate-900/40 transition-colors relative">
              {/* Línea decorativa superior */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-slate-800 group-hover:bg-red-600/50 transition-colors"></div>
              
              <div className="flex items-center justify-between mb-10">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={12} className="text-red-600" />
                  {s.surface_name}
                </p>
                <BarChart3 size={14} className="text-slate-700" />
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-black font-mono tracking-tighter text-white">
                  {s.win_rate}
                </span>
                <span className="text-xl font-light text-slate-500 italic">%</span>
              </div>
              
              <p className="text-[11px] leading-relaxed text-slate-400 font-medium max-w-[200px] mb-8 min-h-[32px]">
                {s.description}
              </p>

              {/* Barra Técnica */}
              <div className="relative h-[2px] w-full bg-slate-800">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-1000 ease-in-out shadow-[0_0_10px_rgba(225,29,72,0.5)]" 
                  style={{ width: `${s.win_rate}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-mono text-slate-600 uppercase">Win/Loss Ratio Opt.</span>
                <span className="text-[9px] font-mono text-red-500">Peak Performance</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SurfaceStats;