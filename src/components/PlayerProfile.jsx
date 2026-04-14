import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Trophy, MapPin, User, Ruler, Star, Globe, 
  ExternalLink, ChevronRight, Zap, Swords, 
  Heart, LayoutDashboard, Calendar, BarChart3, 
  Medal, Smile, Activity, Target 
} from 'lucide-react'; 

const PlayerProfile = ({ activeTab, setActiveTab }) => {
  const [profile, setProfile] = useState(null);
  const RUSSIA_FLAG = "https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg";

  const navigation = [
    { id: 'stats', label: 'Dashboard', icon: <LayoutDashboard size={14} />, color: 'bg-white', text: 'text-white' },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={14} />, color: 'bg-white', text: 'text-white' },
    { id: 'ranking', label: 'Analysis', icon: <BarChart3 size={14} />, color: 'bg-white', text: 'text-white' },
    { id: 'h2h', label: 'H2H', icon: <Swords size={14} />, color: 'bg-[#FF0000]', text: 'text-[#FF0000]' }, 
    { id: 'titles', label: 'Honours', icon: <Medal size={14} />, color: 'bg-white', text: 'text-white' },
    { id: 'mood', label: 'Rublo', icon: <Smile size={14} />, color: 'bg-white', text: 'text-white' },
    { id: 'foundation', label: 'Foundation', icon: <Heart size={14} />, color: 'bg-emerald-500', text: 'text-emerald-500' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('full_player_data')
        .select('*')
        .eq('last_name', 'Rublev')
        .single();
      
      if (data) {
        setProfile({
          ...data,
          flag_url: data.flag_url || RUSSIA_FLAG
        });
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return (
    <div className="max-w-6xl mx-auto h-[400px] bg-transparent flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Athlete Data</p>
      </div>
    </div>
  );

  return (
    <div className="bg-transparent font-sans antialiased pb-2">
      
      {/* --- HERO SECTION TÁCTICO --- */}
      <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border-x border-b border-white/10 shadow-2xl overflow-hidden animate-in fade-in duration-1000">
        
        {/* BARRA DE SISTEMA SUPERIOR */}
        <div className="bg-black/60 text-white/40 text-[9px] font-black uppercase px-8 py-4 flex items-center justify-between tracking-[0.4em] border-b border-white/5">
          <div className="flex items-center gap-4">
            <User size={12} className="text-white/40" /> 
            <div className="flex items-center gap-2">
              <span className="text-white">ATHLETE PROFILE</span>
              <span className="opacity-20">//</span>
              <span>ID: RE-44-ANDREY</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-white/60">LIVE SYNC ACTIVE</span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-0 items-stretch h-[400px]">
          
          {/* FOTO CON AJUSTE PRO Y VIÑETA */}
          <div className="col-span-3 relative border-r border-white/10 overflow-hidden group bg-[#0a0a0a]">
            <img 
              src={profile.headshot_url} 
              alt={profile.last_name} 
              className="w-full h-full object-cover object-top brightness-[0.85] contrast-[1.1] grayscale-[0.2] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-[2000ms] ease-out"
            />
            {/* Sombra interna para efecto profundidad */}
            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.7)] pointer-events-none"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 flex items-center gap-3 relative z-10">
               <div className="w-10 h-10 rounded-full border border-white/20 p-1 backdrop-blur-md bg-black/40">
                  <img src={RUSSIA_FLAG} alt="Flag" className="w-full h-full object-cover rounded-full" />
               </div>
               <span className="text-[10px] font-black text-white italic tracking-widest uppercase">RUS</span>
            </div>
          </div>

          {/* PANEL DE DATOS */}
          <div className="col-span-9 p-12 flex flex-col justify-between relative bg-white/[0.01]">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] w-12 bg-red-600"></div>
                  <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Global Ranking Unit</span>
                </div>
                <h1 className="text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                  {profile.first_name} <span className="text-[#FF0000]">{profile.last_name}</span>
                </h1>
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-[0.4em] pt-2">Advanced Performance Dashboard</p>
              </div>

              {/* RANKING BOX */}
              <div className="bg-white/[0.03] border border-white/10 p-6 text-center min-w-[150px] shadow-2xl relative overflow-hidden group backdrop-blur-lg">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-red-600"></div>
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Target size={80} className="text-white" />
                </div>
                <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em] mb-2 italic">Live Rank</p>
                <p className="text-6xl font-black italic text-white tracking-tighter leading-none mb-2">
                  #{profile.live_rank || profile.current_rank}
                </p>
                <div className="h-[1px] w-full bg-white/10 my-3"></div>
                <p className="text-[10px] font-black text-white italic tracking-widest">
                  {profile.points} <span className="text-white/30 not-italic">PTS</span>
                </p>
              </div>
            </div>

            {/* GRILLA TÉCNICA */}
            <div className="grid grid-cols-3 gap-y-10 gap-x-12 py-10 border-t border-white/10 mt-auto">
              {[
                { label: 'Plays', value: profile.plays, icon: <Zap size={14} className="text-red-500" /> },
                { label: 'Height', value: profile.display_height, icon: <Ruler size={14} className="text-white/40" /> },
                { label: 'Age', value: '28 Years', icon: <Activity size={14} className="text-white/40" /> },
                { label: 'Nationality', value: 'Moscow, RUS', icon: <MapPin size={14} className="text-white/40" /> },
                { label: 'Career High', value: `#${profile.career_high}`, icon: <Star size={14} className="text-yellow-500" /> },
                { label: 'Turned Pro', value: '2014', icon: <Target size={14} className="text-white/40" /> },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 group cursor-default">
                  <div className="flex items-center gap-3">
                    <span className="transition-transform group-hover:scale-110 duration-300">{item.icon}</span>
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] leading-none">{item.label}</span>
                  </div>
                  <p className="text-lg font-black text-white uppercase tracking-tight leading-none italic group-hover:text-red-500 transition-colors">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            {/* FOOTER DEL HERO */}
            <div className="flex items-center justify-between pt-8 border-t border-white/10">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-sm">
                    <Trophy size={16} className="text-yellow-500" />
                    <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">
                      Titles: <span className="text-white ml-2 italic">17 Singles</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] border-l border-white/10 pl-6">
                    Coach: <span className="text-white/40 font-black">Fernando Vicente</span>
                  </span>
               </div>
               <div className="flex items-center gap-8">
                 <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em] italic">
                   Last Updated: {profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                 </p>
                 <button 
                    onClick={() => setActiveTab('titles')}
                    className="group text-[11px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 hover:text-red-500 transition-all"
                 >
                    <span>ARCHIVE</span>
                    <div className="p-1.5 bg-white/5 group-hover:bg-red-600 rounded-sm transition-colors">
                      <ChevronRight size={14} className="text-white" />
                    </div>
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NAVBAR REFINADO Y NÍTIDO --- */}
      <div className="max-w-6xl mx-auto bg-black/80 backdrop-blur-md border-x border-white/10 sticky top-0 z-[100] shadow-2xl">
        <div className="flex justify-between items-center px-4 overflow-x-auto no-scrollbar">
          <nav className="flex items-center">
            {navigation.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`group px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative flex items-center gap-3
                    ${isActive ? item.text : 'text-white hover:text-white/80'}`}
                >
                  <span className={`transition-colors duration-300 ${isActive ? '' : 'text-[#FF0000] group-hover:text-white/60'}`}>
                    {item.icon}
                  </span>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <div className={`absolute bottom-0 left-0 w-full h-[3px] animate-in slide-in-from-bottom-1 duration-300 ${item.color}`} />
                  )}
                  {isActive && (
                    <div className={`absolute inset-0 opacity-5 blur-lg ${item.color}`} />
                  )}
                </button>
              );
            })}
          </nav>
          
          <a 
            href="https://www.atptour.com/en/players/andrey-rublev/re44/overview" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all border-l border-white/10 pl-8 py-5 group"
          >
            <Globe size={14} className="group-hover:rotate-12 transition-transform" /> 
            <span>ATP Profile</span>
            <ExternalLink size={12} className="opacity-40" />
          </a>
        </div>
      </div>

    </div>
  );
};

export default PlayerProfile;