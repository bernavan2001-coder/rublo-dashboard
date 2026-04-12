import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const HeroRublev = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data: dbData } = await supabase
        .from('player_titles')
        .select('*')
        .eq('last_name', 'Rublev')
        .single()
      
      if (dbData) setData(dbData)
    }
    fetchHeroData()
  }, [])

  // Datos por defecto mientras carga o si falla la DB
  const rank = data?.ranking || 16 
  const totalTitles = data?.total_titles || 17

  return (
    <div className="relative w-full min-h-[70vh] bg-[#020617] flex items-center px-12 overflow-hidden border-b border-slate-800">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      
      <div className="relative z-10 max-w-5xl">
        <div className="flex items-center gap-3 mb-6 text-red-500 font-black tracking-[0.4em] text-[10px]">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          LIVE PERFORMANCE STATUS
        </div>
        
        <h1 className="text-[12vw] font-black italic tracking-tighter leading-[0.75] text-white uppercase">
          Andrey<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-400 to-red-600">
            Rublev.
          </span>
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-12">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Live Rank</p>
            {/* Si no hay data, mostramos un guión o un efecto de carga */}
            <p className="text-5xl font-black italic">
              {data ? `#${rank}` : '---'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">ATP Titles</p>
            <p className="text-5xl font-black italic text-red-600">
              {data ? totalTitles : '--'}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Forehand</p>
            <p className="text-5xl font-black italic font-mono">135<span className="text-sm font-normal text-slate-400 ml-1 italic">km/h</span></p>
          </div>
          <div className="flex flex-col justify-end">
             <div className="flex items-center gap-2 text-yellow-500 opacity-80 hover:opacity-100 transition-opacity">
                <span className="text-2xl">🥇</span>
                <span className="text-[9px] font-black uppercase leading-tight">Olympic Gold<br/>Mixed Doubles</span>
             </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-16 top-1/2 -translate-y-1/2 rotate-90 opacity-[0.03] select-none">
        <span className="text-[18rem] font-black tracking-tighter text-white">RUBLO</span>
      </div>
    </div>
  )
}

export default HeroRublev;