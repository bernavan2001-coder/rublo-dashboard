import React from 'react';
import { Trophy, Medal, Star, ArrowRight } from 'lucide-react';

const MajorAchievements = ({ setActiveTab }) => {
  const highlights = [
    {
      title: "Monte-Carlo",
      year: "2023",
      category: "ATP Masters 1000",
      description: "First M1000 Title",
      img: "https://www.atptour.com/-/media/images/news/2023/04/16/18/30/rublev-monte-carlo-2023-final-trophy-smile.jpg",
      color: "from-[#FF0000]/60",
      accent: "text-[#FF0000]"
    },
    {
      title: "Madrid Open",
      year: "2024",
      category: "ATP Masters 1000",
      description: "Second M1000 Title",
      img: "https://img.olympics.com/images/image/private/t_s_pog_staticContent_hero_xl_2x/f_auto/primary/xiekydonsfm2i16mgbq0",
      color: "from-[#FF0000]/60",
      accent: "text-[#FF0000]"
    },
    {
      title: "Olympic Gold",
      year: "Tokyo 2020",
      category: "Mixed Doubles",
      description: "Olympic Champion",
      img: "https://pbs.twimg.com/media/E73z71TXMAck_C4.jpg",
      color: "from-[#FF0000]/60",
      accent: "text-[#FF0000]"
    }
  ];

  return (
    /* Cambiamos fondo a Negro Mate de la tienda */
    <div className="bg-[#1a1a1a] p-12 border border-white/5 shadow-2xl animate-in fade-in duration-1000 relative overflow-hidden">
      
      {/* Decoración de fondo sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0000]/5 blur-[100px] pointer-events-none"></div>

      <header className="mb-12 flex items-end justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-10 bg-white"></div>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em]">Identity Milestones</span>
          </div>
          {/* Títulos en Blanco y Rojo Puro estilo Rublo */}
          <h3 className="text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
            MAJOR <span className="text-[#FF0000]">HONOURS<span className="text-white">.</span></span>
          </h3>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {highlights.map((h, i) => (
          <div key={i} className="group relative aspect-[4/5] overflow-hidden bg-[#111111] border border-white/5 shadow-2xl">
            {/* ✅ Imagen SIEMPRE a color, con brillo y contraste técnico */}
            <img 
              src={h.img} 
              alt={h.title}
              className="w-full h-full object-cover brightness-90 contrast-110 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
            />
            
            {/* Gradiente Rojo Rublo (proporcional al color de la tienda) */}
            <div className={`absolute inset-0 bg-gradient-to-t ${h.color} via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity`}></div>

            {/* INFO - Estilo Blanco y Rojo */}
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{h.year}</span>
                 <div className="w-4 h-[1px] bg-white/20"></div>
                 {h.title.includes("Gold") ? <Medal size={14} className="text-white" /> : <Trophy size={14} className="text-white" />}
              </div>
              
              <h4 className="text-3xl font-black italic uppercase text-white leading-none mb-1 tracking-tighter">
                {h.title}
              </h4>
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest italic group-hover:text-white transition-colors">
                {h.description}
              </p>
            </div>

            {/* Borde de acento fino estilo Rublo en hover */}
            <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* FOOTER - BOTÓN "THE ARCHIVE" */}
      <footer className="mt-16 flex items-center justify-center relative z-10">
         <button 
            onClick={() => setActiveTab('titles')}
            className="group flex items-center gap-8 px-12 py-5 bg-[#111111] border border-white/5 hover:border-white/20 transition-all duration-500"
         >
            <div className="flex items-center gap-4">
               <Star size={16} className="text-white group-hover:text-[#FF0000] transition-colors" fill="currentColor" />
               <span className="text-[11px] font-black uppercase text-white tracking-[0.4em]">Full Career Trophy Room</span>
            </div>
            <ArrowRight size={18} className="text-white group-hover:translate-x-3 transition-transform" />
         </button>
      </footer>
    </div>
  );
};

export default MajorAchievements;