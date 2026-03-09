'use client'
import React from 'react'
import { usePlayStore } from '@/store/playStore'
import { DEMO_PLAYS } from '@/lib/demoPlays'

interface DemoPanelProps {
  onPlay?: () => void
}

export default function DemoPanel({ onPlay }: DemoPanelProps) {
  const {
    play,
    currentFrameIndex,
    isDemoPlaying,
    demoSpeed,
    library,
    setDemoPlaying,
    setDemoSpeed,
    goToFrame,
    loadPlay,
    removeFromLibrary,
  } = usePlayStore()

  const total = play.keyframes.length
  const isLast = currentFrameIndex === total - 1

  const handlePlayPause = () => {
    if (isLast && !isDemoPlaying) {
      goToFrame(0)
      setTimeout(() => setDemoPlaying(true), 50)
    } else {
      setDemoPlaying(!isDemoPlaying)
    }
    if (!isDemoPlaying) onPlay?.()
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Mis jugadas (biblioteca del usuario) */}
      {library.length > 0 && (
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Mis jugadas</p>
          <div className="grid grid-cols-2 gap-2">
            {library.map((p) => (
              <div key={p.id} className="relative group">
                <button
                  onClick={() => loadPlay(p)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-all pr-7 ${
                    play.id === p.id
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="block font-semibold truncate">{p.name}</span>
                  <span className="text-xs opacity-60">{p.keyframes.length} frames</span>
                </button>
                <button
                  onClick={() => removeFromLibrary(p.id)}
                  className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/30 text-white/50 hover:bg-red-500/70 hover:text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  title="Eliminar"
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ejemplos */}
      <div>
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Ejemplos</p>
        <div className="grid grid-cols-2 gap-2">
          {DEMO_PLAYS.map((p) => (
            <button
              key={p.id}
              onClick={() => loadPlay(p)}
              className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${
                play.id === p.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
              }`}
            >
              <span className="block font-semibold">{p.name}</span>
              <span className="text-xs opacity-60">{p.keyframes.length} frames</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10" />

      {/* Info de la jugada actual */}
      <div>
        <p className="text-white font-semibold text-lg">{play.name}</p>
        <p className="text-white/50 text-sm mt-0.5">
          Frame {currentFrameIndex + 1} de {total}
        </p>
      </div>

      {/* Controles principales */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => goToFrame(0)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          title="Reiniciar"
        >
          ⏮
        </button>
        <button
          onClick={() => goToFrame(Math.max(0, currentFrameIndex - 1))}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          title="Frame anterior"
        >
          ◀
        </button>
        <button
          onClick={handlePlayPause}
          disabled={total <= 1}
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
            total <= 1
              ? 'bg-white/10 opacity-40 cursor-not-allowed'
              : isDemoPlaying
              ? 'bg-orange-500 shadow-orange-500/30'
              : 'bg-green-500 shadow-green-500/30 hover:bg-green-400'
          }`}
        >
          {isDemoPlaying ? '⏸ Pausar' : isLast ? '▶ Repetir' : '▶ Play'}
        </button>
        <button
          onClick={() => goToFrame(Math.min(total - 1, currentFrameIndex + 1))}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          title="Siguiente frame"
        >
          ▶
        </button>
        <button
          onClick={() => goToFrame(total - 1)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
          title="Ir al final"
        >
          ⏭
        </button>
      </div>

      {/* Velocidad */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">
          Velocidad — {demoSpeed < 1200 ? 'Rápida' : demoSpeed < 2800 ? 'Normal' : 'Lenta'}
        </label>
        <input
          type="range"
          min={400}
          max={4200}
          step={100}
          value={demoSpeed}
          onChange={(e) => setDemoSpeed(Number(e.target.value))}
          className="w-full mt-2 accent-orange-500"
        />
        <div className="flex justify-between text-xs text-white/30 mt-0.5">
          <span>Rápida</span>
          <span>Lenta</span>
        </div>
      </div>

      {/* Barra de progreso de frames */}
      <div className="flex gap-1.5">
        {play.keyframes.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDemoPlaying(false); goToFrame(i) }}
            className={`flex-1 h-2 rounded-full transition-all ${
              i <= currentFrameIndex ? 'bg-orange-500' : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
