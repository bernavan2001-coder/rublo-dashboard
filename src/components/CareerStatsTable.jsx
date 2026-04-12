import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const CareerStatsTable = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase
        .from('career_titles_history')
        .select('*')
        .order('year', { ascending: false });
      if (data) setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="mt-10 font-sans">
      <div className="bg-[#666] text-white text-[11px] font-black uppercase px-4 py-1.5 rounded-t-sm tracking-widest">
        Career Statistics
      </div>
      <table className="w-full text-left text-xs border-collapse">
        <thead className="bg-[#f2f2f2] text-[#666] uppercase font-bold border-b border-slate-300">
          <tr>
            <th className="px-4 py-3 border-r border-slate-300">Year</th>
            <th className="px-4 py-3 border-r border-slate-300 text-center">Singles Titles</th>
            <th className="px-4 py-3 border-r border-slate-300 text-center">Doubles Titles</th>
            <th className="px-4 py-3">Singles W-L</th>
          </tr>
        </thead>
        <tbody className="text-slate-800 bg-white">
          {stats.map((row) => (
            <tr key={row.id} className="border-b border-slate-200 hover:bg-blue-50/50 transition-colors">
              <td className="px-4 py-3 font-black border-r border-slate-200">{row.year}</td>
              <td className="px-4 py-3 border-r border-slate-200 text-center font-bold">{row.singles_titles}</td>
              <td className="px-4 py-3 border-r border-slate-200 text-center font-bold">{row.doubles_titles}</td>
              <td className="px-4 py-3 font-medium">{row.win_loss_record}</td>
            </tr>
          ))}
          {/* Fila de Totales */}
          <tr className="bg-slate-100 font-black text-sm">
            <td className="px-4 py-4 border-r border-slate-200 uppercase">Career Total</td>
            <td className="px-4 py-4 border-r border-slate-200 text-center text-red-600">17</td>
            <td className="px-4 py-4 border-r border-slate-200 text-center">4</td>
            <td className="px-4 py-4 italic">379-195</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CareerStatsTable;