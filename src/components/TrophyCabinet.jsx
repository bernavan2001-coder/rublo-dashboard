import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, Star, Users, User, Target, Award } from 'lucide-react';

const TrophyCabinet = () => {
  const [trophies, setTrophies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrophies = async () => {
      const { data, error } = await supabase
        .from('player_trophies')
        .select('*')
        .order('year', { ascending: false });
      
      if (!error) setTrophies(data);
      setLoading(false);
    };
    fetchTrophies();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

return (
  <div className="bg-[#0a0a0a] min-h-screen py-20 px-6 text-white animate-in fade-in duration-1000">
    <div className="max-w-7xl mx-auto">
      
      <header className="mb-24 text-center">
        <h2 className="text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
          THE <span className="text-yellow-500">VAULT</span>
        </h2>
        <div className="h-1 w-24 bg-yellow-500 mx-auto mb-4"></div>
        <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-[10px]">
          • Private Museum Collection •
        </p>
      </header>

      {/* 🧱 LA PARED DE CUADROS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        {trophies.map((t) => {
          const isElite = t.category === 'Masters 1000' || t.category === 'Grand Slam';
          
          return (
            <div key={t.id} className="group relative">
              
              {/* 🖼️ MARCO DEL CUADRO (Roble oscuro/Negro) */}
              <div className="relative aspect-[4/5] bg-[#050505] border-[16px] border-[#161616] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 group-hover:border-yellow-600/30">
                
                {/* 🥈/🥇 CHAPA SUPERIOR (Categoría - Dinámica: Plata u Oro) */}
<div className={`absolute top-0 left-1/2 -translate-x-1/2 z-30 px-4 py-1 shadow-md border-x border-b rounded-b-sm transition-all duration-500 ${
  isElite 
  ? 'bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 border-yellow-300/50 shadow-yellow-500/10' 
  : 'bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 border-slate-400/50'
}`}>
  <p className={`text-[7px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${
    isElite ? 'text-yellow-950' : 'text-slate-800'
  }`}>
    {t.category}
  </p>
</div>

                {/* 📸 CAPA 1: LA FOTO (Ocupa todo el cuadro - Se oculta en hover) */}
                <div className="absolute inset-0 z-10 transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-110">
                  <img 
                    src={t.trophy_url || 'https://via.placeholder.com/600x800?text=Tournament+Photo'} 
                    alt={t.tournament_name}
                    className="w-full h-full object-cover brightness-[0.9] contrast-110"
                  />
                  {/* Reflejo de vidrio y viñeta */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"></div>
                  <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] pointer-events-none"></div>
                </div>

                {/* 📜 CAPA 2: RESULTADOS (Se muestra en hover) */}
                <div className="absolute inset-0 bg-[#050505] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-8 text-center z-20">
                    <div className="border border-yellow-500/10 p-8 w-full h-full flex flex-col justify-center items-center">
                      <Award className="text-yellow-500 mb-6 opacity-60" size={40} />
                      <h4 className="text-2xl font-black uppercase italic leading-tight mb-2 tracking-tighter">{t.tournament_name}</h4>
                      <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 opacity-80">{t.city}</p>
                      
                      <div className="space-y-6 w-full max-w-[220px]">
                        <div className="flex flex-col items-center border-b border-white/5 pb-4">
                          <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Final Opponent</span>
                          <span className="text-sm font-black uppercase italic tracking-wide text-slate-200">{t.opponent}</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Match Score</span>
                          <span className="text-xl font-black text-yellow-500 font-mono tracking-tighter italic">{t.score}</span>
                        </div>
                      </div>
                    </div>
                </div>

                {/* 🏷️ 🥇 CHAPA DORADA DE CAMPEÓN (SOBRE EL MARCO INFERIOR) */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-30 w-[85%] px-6 py-2 shadow-2xl border-x border-t transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4 ${
                  isElite 
                  ? 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 border-yellow-200/40 shadow-yellow-500/10' 
                  : 'bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 border-amber-300/30'
                }`}>
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] font-black text-yellow-950 uppercase italic leading-none text-center tracking-tight">
                      {t.tournament_name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 w-full justify-center opacity-60">
                      <div className="h-[1px] w-4 bg-yellow-950/40"></div>
                      <p className="text-[8px] font-black text-yellow-950 uppercase">
                        CHAMPION {t.year}
                      </p>
                      <div className="h-[1px] w-4 bg-yellow-950/40"></div>
                    </div>
                  </div>
                  {/* Remaches de seguridad en los costados */}
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 w-1 h-1 bg-black/30 rounded-full shadow-inner"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 right-2 w-1 h-1 bg-black/30 rounded-full shadow-inner"></div>
                </div>

              </div>

              {/* Proyección de sombra en la pared */}
              <div className="h-10 bg-black/70 w-[90%] mx-auto mt-2 blur-2xl rounded-full opacity-60"></div>

            </div>
          );
        })}
      </div>
    </div>
  </div>
);
};

export default TrophyCabinet;