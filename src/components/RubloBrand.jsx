import React from 'react'
import { Sparkles, Heart, Globe } from 'lucide-react'

const RubloBrand = () => {
  return (
    <section className="py-32 px-12 bg-white text-black overflow-hidden relative">
      
      {/* El logo de fondo gigante sutil */}
      <div className="absolute top-0 right-0 opacity-[0.03] select-none pointer-events-none">
        <span className="text-[30rem] font-black tracking-tighter leading-none">RUBLO</span>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        
        {/* Lado Izquierdo: Concepto Visual */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-slate-100 rounded-[3rem] -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
          <div className="relative bg-slate-50 border border-slate-200 rounded-[3rem] p-12 aspect-square flex flex-col justify-between shadow-2xl overflow-hidden">
            
            {/* Simulación de Etiqueta de Ropa */}
            <div className="flex justify-between items-start">
               <div className="h-16 w-16 bg-black rounded-xl flex items-center justify-center">
                  <span className="text-white font-black text-2xl tracking-tighter italic">R.</span>
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 rotate-90 origin-right mt-8">
                 Spring Collection 2026
               </p>
            </div>

            <div>
               <h4 className="text-5xl font-black italic tracking-tighter mb-4 leading-none">
                 PLAY FOR <br /> THE KIDS.
               </h4>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 A brand by Andrey Rublev
               </p>
            </div>
            
            {/* Foto de producto (placeholder) */}
            <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={250} />
            </div>
          </div>
        </div>

        {/* Lado Derecho: La Filosofía */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-red-600 uppercase tracking-[0.4em]">The Brand Identity</h3>
            <h2 className="text-7xl font-black italic tracking-tighter leading-none uppercase">
              More than <br /> <span className="underline decoration-red-600 underline-offset-8">Clothing.</span>
            </h2>
          </div>

          <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
            Rublo is Andrey's personal project focused on spreading hope. 100% of the profits are dedicated to children's charities and world peace initiatives.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <Heart className="text-red-500" />
              <p className="text-xs font-black uppercase tracking-widest">Philanthropy</p>
              <p className="text-sm text-slate-500">Helping children in need globally.</p>
            </div>
            <div className="space-y-3">
              <Globe className="text-slate-900" />
              <p className="text-xs font-black uppercase tracking-widest">Sustainability</p>
              <p className="text-sm text-slate-500">Eco-conscious materials and production.</p>
            </div>
          </div>

          <button className="bg-black text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-red-600 transition-colors shadow-xl">
            Explore Collection
          </button>
        </div>

      </div>
    </section>
  )
}

export default RubloBrand;