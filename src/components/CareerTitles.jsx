import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Award, X } from 'lucide-react';

const CareerTitles = () => {
  const [trophies, setTrophies] = useState([]);
  const [selectedTrophy, setSelectedTrophy] = useState(null);
  const [roadToTitle, setRoadToTitle] = useState([]);

  useEffect(() => {
    const fetchTrophies = async () => {
      const { data } = await supabase
        .from('player_trophies')
        .select('*')
        .order('year', { ascending: false });
      if (data) setTrophies(data);
    };
    fetchTrophies();
  }, []);

  const handleTrophyClick = async (trophy) => {
    setSelectedTrophy(trophy);
    const { data } = await supabase
      .from('title_runs')
      .select('*')
      .eq('trophy_id', trophy.id)
      .order('id', { ascending: true });
    setRoadToTitle(data || []);
  };

  return (
    <div className="mt-16 font-sans">
      {/* Header con Contador Real */}
      <div className="flex items-end gap-4 mb-8">
        <h3 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
          Career <span className="text-red-600">Titles.</span>
        </h3>
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <Trophy size={14} className="text-yellow-600 fill-yellow-600" />
          <span className="text-xs font-black text-slate-600 uppercase tracking-widest">{trophies.length} Singles Titles</span>
        </div>
      </div>

      {/* Lista de Títulos Estilo ATP */}
      <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 border-t border-slate-200 pt-8">
        {trophies.map((t) => (
          <div 
            key={t.id} 
            onClick={() => handleTrophyClick(t)}
            className="flex items-center justify-between group cursor-pointer hover:bg-slate-50/50 p-2 -m-2 rounded-sm transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-[10px] font-black text-slate-400 mt-1 w-8">{t.year}</span>
              <div>
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-red-600 transition-colors">
                  {t.tournament_name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm ${
                    t.category === 'Masters 1000' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {t.category}
                  </span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">| {t.surface}</span>
                </div>
              </div>
            </div>
            <Award size={16} className="text-slate-200 group-hover:text-yellow-500 transition-all opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* Pie de sección */}
      <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-sm flex justify-between items-center">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1 text-center md:text-left">Titles Summary</p>
           <div className="flex gap-6">
  <span className="text-xs font-bold text-slate-700">
    <span className="text-red-600 font-black">2</span> Masters 1000
  </span>
  <span className="text-xs font-bold text-slate-700">
    <span className="text-red-600 font-black">6</span> ATP 500 {/* Subió de 5 a 6 */}
  </span>
  <span className="text-xs font-bold text-slate-700">
    <span className="text-red-600 font-black">10</span> ATP 250 {/* Bajó de 11 a 10 */}
  </span>
</div>
        </div>
        <div className="text-right hidden md:block">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Career Win Rate</p>
           <p className="text-2xl font-black italic text-slate-900 tracking-tighter uppercase">65.2%</p>
        </div>
      </div>

      {/* --- MODAL PROTEGIDO --- */}
      {selectedTrophy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-sm relative flex flex-col md:flex-row shadow-2xl">
            
            {/* Parte de la Imagen (Izquierda) */}
            <div className="md:w-1/2 h-64 md:h-auto bg-slate-900 relative">
              <img 
                src={selectedTrophy?.trophy_img_url || 'https://via.placeholder.com/600x800?text=ATP+Champion'} 
                className="w-full h-full object-cover object-top opacity-90" 
                alt={selectedTrophy?.tournament_name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 text-white z-10">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-2">
                  {selectedTrophy?.category}
                </p>
                <h2 className="text-3xl font-black italic uppercase leading-none mb-1">
                  {selectedTrophy?.tournament_name}
                </h2>
                <p className="text-sm font-bold opacity-70 uppercase tracking-widest italic">
                  Champion {selectedTrophy?.year}
                </p>
              </div>
            </div>

            {/* Parte del Road to Title (Derecha) */}
            <div className="md:w-1/2 p-8 overflow-y-auto bg-white relative">
              <button 
                onClick={() => {
                  setSelectedTrophy(null);
                  setRoadToTitle([]);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors z-20"
              >
                <X size={20} className="text-slate-400" />
              </button>

              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8 border-b border-slate-100 pb-2">
                Road to the Title
              </h4>
              
              <div className="space-y-6">
                {roadToTitle.length > 0 ? (
                  roadToTitle.map((match, i) => (
                    <div key={i} className="border-l-2 border-red-600 pl-4 relative">
                      <div className="absolute -left-[5px] top-0 w-2 h-2 bg-red-600 rounded-full"></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{match.round}</p>
                      <div className="flex justify-between items-end">
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-tighter">vs {match.opponent_name}</p>
                        <p className="text-xs font-mono font-bold text-red-600 bg-red-50 px-1.5 rounded-sm">{match.score}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-slate-300">
                     <p className="text-[10px] uppercase font-black tracking-widest animate-pulse">Loading matches...</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CareerTitles;