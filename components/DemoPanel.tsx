'use client'
import React from 'react'
import { usePlayStore } from '@/store/playStore'

export default function DemoPanel() {
  const {
    play,
    currentFrameIndex,
    isDemoPlaying,
    demoSpeed,
    setDemoPlaying,
    setDemoSpeed,
    goToFrame,
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
  }

  return (
    <div className="flex flex-col gap-4">
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
          className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${
            isDemoPlaying
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
          Velocidad — {demoSpeed < 800 ? 'Rápida' : demoSpeed < 1400 ? 'Normal' : 'Lenta'}
        </label>
        <input
          type="range"
          min={400}
          max={2500}
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
