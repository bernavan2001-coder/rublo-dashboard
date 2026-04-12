import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { TrendingUp, Star, Award, ChevronUp } from 'lucide-react';

const RankingJourney = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data: res } = await supabase
        .from('ranking_history')
        .select('*')
        .order('year', { ascending: true });
      if (res) setData(res);
    };
    fetchRanking();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white border-t-4 border-blue-600 p-4 shadow-[0_15px_40px_rgba(0,0,0,0.1)] rounded-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.year}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black italic text-slate-900 leading-none">#{item.ranking}</span>
          </div>
          {item.label && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">{item.label}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-12 border border-slate-200 shadow-sm animate-in fade-in duration-1000">
      
      {/* HEADER EDITORIAL */}
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-10 bg-blue-600"></div>
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Historical Data</span>
          </div>
          <h3 className="text-7xl font-black italic uppercase tracking-tighter text-slate-900 leading-[0.85]">
            RANKING <br /> <span className="text-blue-600">EVOLUTION</span>
          </h3>
          <p className="max-w-md mt-6 text-slate-500 text-sm font-medium leading-relaxed">
            The steady ascent of Andrey Rublev through the ATP World Tour ranks, highlighting his entrance into the global elite.
          </p>
        </div>
        
        <div className="flex gap-12 border-l border-slate-100 pl-12">
          <div className="text-left">
            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">Peak Rank</span>
            <div className="flex items-center gap-2">
                <ChevronUp className="text-green-500" size={28} />
                <span className="text-6xl font-black italic text-slate-900">#5</span>
            </div>
          </div>
        </div>
      </header>

      {/* GRÁFICO LIMPIO */}
      <div className="h-[450px] w-full mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 30 }}>
            <defs>
              <linearGradient id="lightGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" strokeWidth={2} />
            
            <XAxis 
    dataKey="year" 
    axisLine={false} 
    tickLine={false} 
    // 2. Color más fuerte (slate-900) y peso extra (900)
    tick={{ fontSize: 12, fontWeight: '900', fill: '#0f172a' }} 
    // 3. dy: 25 le da espacio suficiente para que no se corte
    dy={25} 
  />
            
            <YAxis 
              reversed 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fontWeight: '900', fill: '#94a3b8' }}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} />

            {/* Sombra de área muy sutil */}
            <Area type="monotone" dataKey="ranking" stroke="none" fillOpacity={1} fill="url(#lightGlow)" />

            {/* Línea de Referencia Elite */}
            <ReferenceLine 
              y={10} 
              stroke="#ef4444" 
              strokeDasharray="4 4" 
              strokeWidth={2}
              label={{ 
                value: 'TOP 10 ELITE', 
                position: 'right', 
                fill: '#ef4444', 
                fontSize: 10, 
                fontWeight: '900' 
              }} 
            />

            {/* LA LÍNEA PRINCIPAL (Azul ATP) */}
            <Line 
              type="monotone" 
              dataKey="ranking" 
              stroke="#2563eb" 
              strokeWidth={5} 
              dot={{ r: 4, fill: '#2563eb', strokeWidth: 0 }} 
              activeDot={{ r: 8, fill: '#fff', stroke: '#2563eb', strokeWidth: 4 }}
              animationDuration={3000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* FOOTER ESTILO DATA-VIZ */}
      <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex gap-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-2 bg-blue-600 rounded-sm"></div>
               <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">ATP Ranking Position</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-8 h-[2px] border-b-2 border-red-500 border-dashed"></div>
               <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">Elite Threshold</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <img src="https://www.atptour.com/-/media/images/atp-tour-logo.svg" className="h-4 opacity-20 grayscale" alt="ATP" />
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter italic">Last update: April 2026</span>
         </div>
      </footer>
    </div>
  );
};

export default RankingJourney;