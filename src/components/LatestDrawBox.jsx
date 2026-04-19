import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Target, ChevronRight, BarChart3, ExternalLink, Trophy, Clock, Swords } from 'lucide-react';

const LatestDrawBox = ({ setActiveTab }) => {
  const [draw, setDraw] = useState(null);
  const [isOut, setIsOut] = useState(false);
  const [nextTournament, setNextTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusAndDraw = async () => {
      setLoading(true);
      try {
        // 1. Buscamos el último partido registrado para ver si el torneo terminó para él
        const { data: lastMatch } = await supabase
          .from('tournament_matches_2026')
          .select('is_win, tournament_name, round')
          .eq('player_last_name', 'Rublev')
          .order('match_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        // 2. Buscamos el draw activo (si existe uno nuevo cargado en la tabla)
        const { data: currentDraw } = await supabase
          .from('current_draw')
          .select('*')
          .limit(1)
          .maybeSingle();

        // LÓGICA DE DECISIÓN:
        // Si el último partido fue una derrota O fue la Final (gane o pierda), el torneo terminó.
        const tournamentFinished = lastMatch ? (!lastMatch.is_win || lastMatch.round === 'F') : false;

        if (tournamentFinished) {
          setIsOut(true);
          // Buscamos el próximo torneo en el calendario que NO sea el que acaba de terminar
          const today = new Date().toISOString().split('T')[0];
          const { data: upcoming } = await supabase
            .from('atp_calendar_2026')
            .select('tournament_name, start_date, tournament_category')
            .filter('start_date', 'gte', today)
            .eq('is_entered', true)
            .neq('tournament_name', lastMatch?.tournament_name) // <--- Evita mostrar el que terminó hoy
            .order('start_date', { ascending: true })
            .limit(1)
            .maybeSingle();
          
          setNextTournament(upcoming);
        } else if (currentDraw && currentDraw.opponent) {
          // Si el torneo sigue activo y hay un rival en el draw
          setIsOut(false);
          setDraw(currentDraw);
        } else {
          setIsOut(false);
        }
      } catch (error) {
        console.error("Error syncing draw:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatusAndDraw();
  }, []);

  const handleAnalyzeH2H = () => {
    if (draw && draw.opponent) {
      setActiveTab('h2h'); 
    }
  };

  if (loading) return <div className="h-[500px] bg-[#111111] animate-pulse rounded-sm border border-white/10 max-w-md mx-auto" />;

  // Prioridad de nombres y categorías
  const tournamentName = isOut 
    ? (nextTournament?.tournament_name || "Madrid Open") 
    : (draw?.tournament_name || "Barcelona Open");

  const category = isOut 
    ? (nextTournament?.tournament_category || 'ATP 1000') 
    : (draw?.tournament_category || 'ATP 500');

  // Imagen dinámica: Si ya terminó Barcelona, ponemos una genérica de Madrid o Tierra Batida
  const bgImage = isOut 
    ? "https://upload.wikimedia.org/wikipedia/commons/2/29/Caroline_Wozniacki_and_Dinara_Safina_at_the_2009_Mutua_Madrile%C3%B1a_Madrid_Open.jpg"
    : "https://www.marketingregistrado.com/img/noticias/barcelona-open-cuales-sponsors.webp";

  return (
    <div className="relative bg-[#111111] border border-white/10 shadow-2xl overflow-hidden group h-full flex flex-col min-h-[500px] max-w-md mx-auto">
      
      {/* 📸 FOTO DE FONDO DINÁMICA */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bgImage}
          alt="Tournament Venue" 
          className="w-full h-full object-cover opacity-40 grayscale-[0.3] group-hover:scale-105 transition-transform duration-[4000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/80 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        
        {/* TOP BAR */}
        <div className="p-5 flex justify-between items-center border-b border-white/5 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Target size={14} className={isOut ? "text-amber-500" : "text-[#FF0000] animate-pulse"} />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
              {isOut ? 'Next Entry Confirmed' : 'Live Draw Feed'}
            </span>
          </div>
          <div className="flex items-center gap-2">
             <Trophy size={12} className="text-white/20" />
             <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] italic">
                {category}
             </span>
          </div>
        </div>

        <div className="p-8 mt-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-[1px] w-6 ${isOut ? 'bg-amber-500' : 'bg-[#FF0000]'}`}></div>
              <p className={`text-[9px] font-black uppercase tracking-[0.5em] ${isOut ? 'text-amber-500' : 'text-[#FF0000]'}`}>
                {isOut ? 'Next Destination' : 'Current Bracket'}
              </p>
            </div>
            <h4 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">
              {tournamentName} <span className={isOut ? "text-amber-500" : "text-[#FF0000]"}>.</span>
            </h4>
          </div>

          {isOut ? (
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 flex flex-col items-center text-center space-y-5">
              <div className="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Clock className="text-amber-500 animate-pulse" size={28} />
              </div>
              <div className="space-y-2">
                <span className="text-white font-black italic uppercase text-xl tracking-tighter block leading-tight">
                    Draw Sync Pending
                </span>
                <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
                  The {tournamentName} bracket hasn't been released yet. Rublev is confirmed in the entry list.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 relative animate-in slide-in-from-bottom-6 duration-700">
                <div className="bg-white p-5 flex justify-between items-center border-l-[6px] border-[#FF0000] shadow-2xl">
                    <div className="flex flex-col">
                        <span className="text-[16px] font-black uppercase text-black italic leading-none">A. Rublev</span>
                        <span className="text-[9px] font-bold text-black/40 uppercase tracking-widest mt-1">Status: Seeded</span>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] font-black bg-black text-white px-3 py-1 italic tracking-tighter">UNIT RE44</span>
                    </div>
                </div>

                <div className="flex justify-center py-1">
                    <div className="bg-[#111] p-2 rounded-full border border-white/10">
                        <Swords size={18} className="text-red-600" />
                    </div>
                </div>

                <div className="bg-slate-900/90 backdrop-blur-md p-5 flex justify-between items-center border-l-[6px] border-blue-600 shadow-xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[16px] font-black uppercase text-white italic leading-none">{draw?.opponent || 'TBD'}</span>
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">{draw?.current_round || 'Loading Round...'}</span>
                    </div>
                    <div className="text-right">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-blue-600 transition-colors">
                            <ChevronRight size={16} className="text-white" />
                        </div>
                    </div>
                </div>
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-3">
            <button 
              onClick={handleAnalyzeH2H}
              disabled={isOut}
              className={`py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 transition-all shadow-xl ${isOut ? 'opacity-20 cursor-not-allowed bg-black/40 border border-white/10 text-white' : 'bg-white text-black hover:bg-[#FF0000] hover:text-white'}`}
            >
              <BarChart3 size={14} /> Analyze H2H
            </button>
            <a 
              href="https://www.atptour.com/en/scores/current" 
              target="_blank" rel="noopener noreferrer"
              className="bg-black/40 backdrop-blur-sm border border-white/10 text-white/60 py-4 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:text-white hover:border-white transition-all"
            >
                ATP Scores <ExternalLink size={13} />
            </a>
          </div>
        </div>

        <div className="mt-auto bg-black/80 backdrop-blur-md p-4 border-t border-white/5 flex justify-between items-center">
          <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">RUB-SYS-DRAWS // {tournamentName.toUpperCase()}_2026</p>
          <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isOut ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-[0.2em]">
                {isOut ? 'AWAITING RE-SYNC' : 'LIVE SYNC ACTIVE'}
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestDrawBox;