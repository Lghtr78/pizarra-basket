'use client'
import React from 'react'
import { usePlayStore } from '@/store/playStore'

export default function EditPanel() {
  const { play, currentFrameIndex, goToFrame, addKeyframe, removeKeyframe, setPlayName } =
    usePlayStore()

  return (
    <div className="flex flex-col gap-4">
      {/* Nombre de la jugada */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Nombre de la jugada</label>
        <input
          className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 text-sm"
          value={play.name}
          onChange={(e) => setPlayName(e.target.value)}
          placeholder="Ej: Juego del 5 con bloqueo"
        />
      </div>

      {/* Keyframes */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Frames de la jugada</label>
        <p className="text-xs text-white/40 mt-0.5 mb-2">
          Cada frame es una posición en la jugada. Mové los jugadores y agregá frames.
        </p>
        <div className="flex flex-wrap gap-2">
          {play.keyframes.map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <button
                onClick={() => goToFrame(i)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  i === currentFrameIndex
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {i === 0 ? 'Inicio' : `F${i}`}
              </button>
              {play.keyframes.length > 1 && (
                <button
                  onClick={() => removeKeyframe(i)}
                  className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 text-xs flex items-center justify-center"
                  title="Eliminar frame"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addKeyframe}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-dashed border-white/20 text-white/50 hover:border-orange-400 hover:text-orange-400 transition-all"
          >
            + Frame
          </button>
        </div>
      </div>

      <p className="text-xs text-white/30 italic">
        Tip: editá las posiciones en cada frame para construir la jugada paso a paso.
      </p>
    </div>
  )
}
