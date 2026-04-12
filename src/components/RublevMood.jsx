import React from 'react';
import { Quote, ShoppingBag, Music, PlayCircle, Target, UserCheck } from 'lucide-react';

const RublevMood = () => {
  return (
    <div className="animate-in fade-in duration-1000 max-w-6xl mx-auto">
      
      {/* 1. HERO SECTION: Intensity vs. Calm */}
      <div className="grid md:grid-cols-2 gap-4 mb-8 overflow-hidden rounded-sm">
        <div className="h-[450px] relative group cursor-pointer overflow-hidden border border-red-950 bg-black">
          <img 
            src="https://s.yimg.com/ny/api/res/1.2/Bgbz4Nv2nO1IWjcj0eUIrA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNztjZj13ZWJw/https://s.yimg.com/os/creatr-uploaded-images/2025-07/0aeae030-5a94-11f0-bf37-19bea6c2f83e" 
            alt="Intensity" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-transparent to-transparent opacity-90"></div>
          <div className="flex flex-col justify-end p-10 h-full relative z-10">
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">On-Court <br /> Intensity</h2>
            <p className="text-xs font-bold text-red-400 uppercase tracking-[0.3em]">The power and the famous Bweh!</p>
          </div>
        </div>

        <div className="h-[450px] relative group cursor-pointer overflow-hidden border border-slate-900 bg-black">
          <img 
            src="https://hauteliving.com/wp-content/uploads/2024/07/CVR1_AndreyRublev.jpeg" 
            alt="Calm" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
          <div className="flex flex-col justify-end p-10 h-full relative z-10">
            <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Off-Court <br /> Calm</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">Deep music and peaceful mind</p>
          </div>
        </div>
      </div>

      {/* 2. MAIN CARDS SECTION (RUBLO & MUSIC) */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        
        {/* Rublo Brand */}
        <div className="bg-[#1a1a1a] border border-white/5 p-10 hover:border-white/20 transition-all cursor-pointer shadow-2xl group flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-10">
              <ShoppingBag className="text-white/20" size={24} />
              <span className="text-[9px] font-black bg-white text-black px-4 py-1.5 uppercase tracking-[0.3em]">Official Archive</span>
            </div>
            <h3 className="text-4xl font-black uppercase italic mb-6 text-white tracking-tighter leading-none">
              RUBLO: <br /><span className="text-[#FF0000]">Play for the Kids.</span>
            </h3>
            <p className="text-xs text-white/40 leading-relaxed mb-10 font-bold uppercase tracking-wider">
              A philosophy turned into textile. 100% of profits are donated to children's foundations worldwide. No War. No Ego. Only Love.
            </p>
          </div>
          <div className="h-80 bg-[#111] border border-white/5 flex items-center justify-center p-8 overflow-hidden">
            <img 
              src="https://rubloshop.com/cdn/shop/files/logo_new_4.png?v=1736699038&width=120" 
              alt="Rublo Logo" 
              className="w-32 h-auto invert brightness-0 opacity-80 group-hover:scale-110 transition-transform duration-1000" 
            />
          </div>
        </div>

        {/* Music Playlist */}
        <div className="bg-[#0f0f0f] border border-white/5 p-8 hover:border-red-500/30 transition-all shadow-2xl group rounded-sm flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <Music className="text-red-500" size={24} />
            <span className="text-[9px] font-black bg-red-600/10 text-red-500 border border-red-500/20 px-3 py-1 uppercase tracking-widest">Pre-Match Mix</span>
          </div>
          <h3 className="text-3xl font-black uppercase italic mb-4 text-white tracking-tighter">The <span className="text-red-500">Hard Rock</span> Era</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium">La intensidad de Andrey nace de su playlist. Rock pesado y Metal para canalizar la energía antes de entrar a la arena.</p>
          <div className="space-y-4">
            {[ 
              { title: 'In the End', band: 'Linkin Park', img: 'https://lastfm.freetls.fastly.net/i/u/ar0/7e2052e324fd6753725da8b05bcf4c37.jpg' }, 
              { title: 'Jumpsuit', band: 'Twenty One Pilots', img: 'https://i.etsystatic.com/52489282/r/il/f44b4d/6439569220/il_fullxfull.6439569220_70sc.jpg' },
              { title: 'Nothing Else Matters', band: 'Metallica', img: 'https://gcdn.emol.cl/los-90/files/2021/09/193973_detail-00.jpg' } 
            ].map((song) => (
              <div key={song.title} className="flex items-center gap-4 p-4 bg-white/5 rounded-sm hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                <div className="w-12 h-12 rounded-sm overflow-hidden border border-white/10 shrink-0">
                  <img src={song.img} alt={song.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-black text-white uppercase block tracking-tight">{song.title}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{song.band}</span>
                </div>
                <PlayCircle size={20} className="text-red-500 opacity-60 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GEAR & QUOTES SECTION */}
      <div className="grid md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-1 bg-white p-10 text-black flex flex-col justify-center">
          <Quote size={40} className="mb-8 text-black/10" fill="currentColor" />
          <p className="text-3xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8">
            "I just want to be a better person. <br /> In my heart. <br />In my soul."
          </p>
          <div className="h-[2px] w-12 bg-black mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Life Philosophy</p>
        </div>

        <div className="md:col-span-2 border border-slate-900 bg-slate-950 p-8 text-white shadow-sm relative overflow-hidden group cursor-pointer flex items-center gap-10">
          <div className="w-1/3 relative z-10">
             <img src="https://allthingstennis.co.uk/cdn/shop/files/GravityPro20252.png?v=1736101818" alt="Racket" className="w-full h-full object-contain rotate-[15deg] group-hover:rotate-[20deg] transition-transform duration-500"  />
          </div>
          <div className="flex-1 relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-red-500" size={24} />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Official Gear</span>
            </div>
            <h4 className="text-4xl font-black uppercase italic mb-2 tracking-tighter">Head Gravity Pro</h4>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">
              Custom Stringing: Luxilon 4G / Wilson Natural Gut <br /> 
              Tension: 24/23 KG <br />
              Bag: Rublo x Play for the Kids Limited Edition
            </p>
          </div>
          <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* 4. BRAND FOOTER */}
      <div className="text-center py-20 border-t border-slate-200 flex flex-col items-center gap-4">
        <div className="flex items-center gap-6">
          <h4 className="text-9xl font-black text-slate-100 uppercase italic select-none tracking-tighter leading-none">RUBLO</h4>
          <UserCheck className="text-slate-200" size={80} />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">No war. No ego. Only love.</p>
      </div>
      {/* 4. DOCUMENTARY SECTION: The Journey */}
<div className="mb-20">
  <div className="flex items-center gap-4 mb-8">
    <div className="h-px bg-slate-200 flex-1"></div>
    <h3 className="text-xs font-black uppercase tracking-[0.5em] text-slate-400 italic">Essential Viewing</h3>
    <div className="h-px bg-slate-200 flex-1"></div>
  </div>

  {/* 4. DOCUMENTARY SECTION: The Journey (Image Link Edition) */}
<div className="mb-20">
  

  <a 
    href="https://www.youtube.com/watch?v=I3pegJw8hZQ&t=148s" 
    target="_blank" 
    rel="noopener noreferrer"
    className="block bg-[#0f0f0f] p-4 rounded-sm shadow-2xl border border-white/5 group hover:border-red-500/30 transition-all duration-500"
  >
    <div className="relative aspect-video overflow-hidden rounded-sm bg-black">
      {/* Miniatura del Video */}
      <img 
        src="https://longform.atptour.com/andrey-rublev-breaking-back/assets/tcbYhGbRpx/16x9-end-card-v2-1920x1080.jpg" 
        alt="Andrey Rublev: The Journey" 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
      />
      
      {/* Botón de Play Central */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
          <PlayCircle size={40} className="text-white fill-white" />
        </div>
      </div>

      {/* Overlay de Tiempo / Tag */}
      <div className="absolute bottom-6 right-6 bg-black/80 px-3 py-1 rounded-sm text-[10px] font-black text-white uppercase tracking-widest border border-white/10">
        29.19 MIN
      </div>
    </div>
    
    <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-4 pb-4">
      <div>
        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> ATP Uncovered Special
        </p>
        <h4 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
          The <span className="text-slate-500 text-3xl italic">Journey</span>
        </h4>
        <p className="text-[9px] font-bold text-slate-500 uppercase mt-2 tracking-widest">Click to watch on YouTube ↗</p>
      </div>
      
      <div className="max-w-md">
        <p className="text-xs text-slate-400 font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4">
          "The most important thing is to be a good person... tennis is just a game, but how you treat people stays forever."
        </p>
      </div>
    </div>
  </a>
</div>
</div>
    </div>
  );
};

export default RublevMood;