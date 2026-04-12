import React from 'react';
import { Heart, Globe, Users, ExternalLink, Activity, Target, ShieldCheck, Quote, Sparkles } from 'lucide-react';

const FoundationPage = () => {
  
  // LINKS REALES INTEGRADOS CON TAMAÑOS DE GRILLA MODERNOS
  const photos = [
    { 
      id: 1, 
      url: "https://scontent.faep24-1.fna.fbcdn.net/v/t39.30808-6/515044178_30291833330432146_3520172345669725321_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=P9YOgnC7A9IQ7kNvwFCqp53&_nc_oc=AdoGPGBshxeoIBW0lNbCePXo6lvytn3LqLmYZcR1Q-AE1R2NZXlaT_ns0BCTr4mw8jw&_nc_zt=23&_nc_ht=scontent.faep24-1.fna&_nc_gid=TBpNvAaAEgg0mDkkPENtCg&_nc_ss=7a389&oh=00_Af1eSXESqpzCujSvAW3pcNa99W3WShssRBqs001m99d2mw&oe=69E17273", 
      tag: "HKTA COLLAB // CLINIC", 
      size: "col-span-2 row-span-2" 
    }, 
    { 
      id: 2, 
      url: "https://images.tennis.com/image/private/t_16-9_1920/tenniscom-prd/uleryunuvtnln6fgyv4d.jpg", 
      tag: "UNIT MADRID // LA ZARZUELA", 
      size: "col-span-1 row-span-1" 
    }, 
    { 
      id: 3, 
      url: "https://www.atptour.com/-/media/images/news/2025/06/11/19/46/rublev-rome-2025-hospital-visit.jpg", 
      tag: "UNIT ROME // BAMBINO GESÙ", 
      size: "col-span-1 row-span-1" 
    }, 
    { 
      id: 4, 
      url: "https://scontent.ffdo24-3.fna.fbcdn.net/v/t39.30808-6/514484141_30291833303765482_3914349280170481715_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=e06c5d&_nc_ohc=K6L463APP2gQ7kNvwFGRUTt&_nc_oc=Adq-wuLJsBozO4fq1E72j_o7YwKcyc4V8qOk7KlLMeWCuzTH2d5m86kPX7c3FAPlucE&_nc_zt=23&_nc_ht=scontent.ffdo24-3.fna&_nc_gid=7PcoQleoK5Zj_nHSAjbKxg&_nc_ss=7a389&oh=00_Af3J9UgkwwJOE-wz4gu166-KogHMpqFgkya1rzzXVEHKhA&oe=69E19AD0", 
      tag: "FOUNDATION UNIT // HKG", 
      size: "col-span-2 row-span-1" 
    }, 
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 font-sans antialiased animate-in fade-in duration-1000 selection:bg-emerald-500/20 text-white">
      
      {/* =========================================
          1. HERO HEADER: CLEAN & IMPACTFUL
          ========================================= */}
     <div className="relative min-h-[50vh] flex flex-col justify-center mb-24 px-6 border-b border-white/5 pb-20">
  {/* Efecto de luz sutil en el fondo */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent_70%)] pointer-events-none"></div>
  
  <div className="relative z-10 space-y-8">
    <div className="flex items-center gap-4">
        <Sparkles className="text-emerald-500 animate-pulse" size={16} />
        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.8em]">
          Humanitarian Unit // Global Presence
        </p>
    </div>
    
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
      {/* Título un poco más chico (text-6xl / md:text-8xl) */}
      <h2 className="text-6xl md:text-8xl font-black italic uppercase text-white tracking-tighter leading-[0.85] relative">
        PLAY FOR <br />
        <span className="text-emerald-500 relative inline-block">
            THE KIDS
            <span className="absolute bottom-0 left-0 w-full h-[4px] bg-white rounded-full"></span>
        </span>
      </h2>

      {/* Logo con el link de Reddit */}
      <div className="relative group flex-shrink-0">
        <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-700"></div>
        <img 
          src="https://preview.redd.it/play-for-the-kids-play-for-the-light-v0-ano5ksee006g1.png?width=640&crop=smart&auto=webp&s=36a82cd31cb893ea112c7084cd22684beeecd358" 
          alt="Play for the Kids Logo" 
          className="relative z-10 w-40 md:w-56 h-auto object-contain drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]"
        />
      </div>
    </div>

    {/* Botón único hacia la web oficial */}
    <div className="pt-12 border-t border-white/10">
      <a 
        href="https://andreyrublevfoundation.org/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-4 bg-emerald-500 text-black px-10 py-5 text-[11px] font-black uppercase tracking-[0.5em] rounded-full shadow-lg hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95 group"
      >
        Official Website <ExternalLink size={14} className="group-hover:rotate-45 transition-transform" />
      </a>
    </div>
  </div>
</div>

      {/* =========================================
          2. GALERÍA A TODO COLOR "THE BOARD"
          ========================================= */}
      <div id="board" className="mb-32">
        <div className="flex items-end justify-between mb-16 px-2">
            <div>
                <p className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.6em] mb-2">Visual Archive</p>
                <h3 className="text-5xl font-black italic uppercase text-white tracking-tighter leading-none">Global Mission Impact</h3>
            </div>
            <p className="hidden md:block text-right text-white/30 text-[9px] font-bold uppercase tracking-widest italic pr-4">
                Sync_v4.8 // 2026 // BCN
            </p>
        </div>

        {/* Grilla asimétrica con fotos a color */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 auto-rows-[280px]">
          {photos.map((photo) => (
            <div key={photo.id} className={`${photo.size} relative group overflow-hidden border border-white/10 rounded-2xl shadow-xl bg-black`}>
              <img 
                src={photo.url} 
                className="w-full h-full object-cover brightness-100 group-hover:brightness-110 transition-all duration-1000 group-hover:scale-105"
                alt={photo.tag}
              />
              {/* Degradado para texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Etiqueta flotante */}
              <div className="absolute bottom-6 left-6 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5 leading-none">Photo_Deployment_ID</p>
                <p className="text-lg font-black italic text-white uppercase tracking-tight leading-none group-hover:text-emerald-500 transition-colors">
                  {photo.tag}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================
          3. CITA Y MISIÓN: GLASSMORPHISM CARDS
          ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch mb-32">
        
        {/* CITA DEL JUGADOR */}
        <div className="bg-[#1a1a1a] border border-white/10 p-12 rounded-2xl shadow-xl flex flex-col justify-center relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-24 h-24 p-6 text-emerald-500 animate-pulse">
                <Heart size={24} />
           </div>
           
           <div className="relative z-10 pt-16">
               <Quote size={60} className="text-white opacity-10 mb-6" />
               <p className="text-4xl font-black italic uppercase text-white tracking-tighter leading-[1.15]">
                 "Tennis is just a game, <span className="text-emerald-500">but helping a child live better</span> is the real victory."
               </p>
               <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
                   <div className="w-12 h-[2px] bg-emerald-500"></div>
                   <p className="text-[12px] font-black uppercase tracking-[0.6em] text-white">Andrey Rublev</p>
               </div>
           </div>
        </div>

        {/* TEXTO DE MISIÓN & VISIÓN */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-2xl shadow-2xl relative flex flex-col">
            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-10 pb-4 border-b border-white/10">Mission & Vision UNIT_44</h4>
            
            <div className="space-y-8 flex-grow">
                {/* VERSIÓN EN ESPAÑOL */}
                <p className="text-slate-100 text-[15px] leading-relaxed font-semibold">
                      "Our goal is to provide resources and support to children worldwide fighting serious medical issues. Inspired by Andrey’s passion, we aim to close the healthcare gap, ensuring no health challenge prevents a child from reaching their full potential."
                </p>

               
            </div>

            <a 
              href="https://www.instagram.com/rublevfoundation/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between group border-t border-white/10 pt-8 mt-12 hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.3em] group-hover:text-emerald-500 transition-colors">Follow Mission Progress</span>
              <ExternalLink size={18} className="text-white group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
            </a>
        </div>
      </div>

      {/* =========================================
          4. TARJETAS DE IMPACTO REDISEÑADAS
          ========================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10 rounded-2xl overflow-hidden divide-y md:divide-y-0 md:divide-x divide-white/10 mb-10 shadow-xl">
        <StatBlock icon={Globe} label="Region Status" value="Worldwide" />
        <StatBlock icon={Users} label="Target Unit" value="Pediatric" />
        <StatBlock icon={ShieldCheck} label="Operational Values" value="Humanity" />
      </div>

      {/* FOOTER */}
      <div className="py-6 flex justify-between items-center text-slate-700">
          <span className="text-[9px] font-black uppercase tracking-[0.4em]">AR_FOUNDATION_CONSOLE // BCN_2026</span>
          <span className="text-[9px] font-black uppercase tracking-[0.4em] italic">Mission Status: Cycle Optimal</span>
      </div>
    </div>
  );
};

// Sub-componente para las tarjetas de impacto (Versión V3 Mejorada)
const StatBlock = ({ icon: Icon, label, value }) => (
  <div className="p-12 bg-[#1a1a1a] hover:bg-emerald-950/20 transition-all group relative overflow-hidden">
    {/* Decoración técnica de fondo sutil */}
    <div className="absolute top-0 right-0 p-8 text-emerald-950 group-hover:text-emerald-900 transition-colors opacity-30 pointer-events-none">
        <Icon size={120} strokeWidth={1} />
    </div>
    
    <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-3">{label}</p>
        <p className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none mb-2">{value}</p>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">Cause_Code // Optimal_Sync</p>
    </div>
  </div>
);

const ChevronRight = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

export default FoundationPage;