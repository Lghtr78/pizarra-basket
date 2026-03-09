'use client'
import React from 'react'
import { usePlayStore } from '@/store/playStore'

export default function ChallengePanel() {
  const {
    play,
    challengeFrameIndex,
    challengeFrameScores,
    confirmChallengeFrame,
    resetChallenge,
    setMode,
  } = usePlayStore()

  const totalFrames = play.keyframes.length
  const isDone = challengeFrameIndex >= totalFrames

  const avgScore =
    isDone && challengeFrameScores.length > 0
      ? Math.round(challengeFrameScores.reduce((a, b) => a + b, 0) / challengeFrameScores.length)
      : 0

  const scoreLabel =
    avgScore >= 85 ? '¡Excelente!' : avgScore >= 60 ? '¡Bien!' : 'Seguí practicando'
  const scoreColor =
    avgScore >= 85 ? 'text-green-400' : avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-white font-semibold text-lg">{play.name}</p>
        <p className="text-white/50 text-sm mt-0.5">
          Posicioná a los jugadores de ataque en cada frame de la jugada.
        </p>
      </div>

      {/* Barra de progreso por frames */}
      <div className="flex gap-1">
        {Array.from({ length: totalFrames }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < challengeFrameScores.length
                ? 'bg-green-400'
                : i === challengeFrameIndex && !isDone
                ? 'bg-orange-400'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {isDone ? (
        /* Pantalla de resultados finales */
        <div className="flex flex-col gap-3 items-center py-4">
          <div className="text-6xl font-black text-white">{avgScore}</div>
          <div className="text-sm text-white/50">puntos promedio</div>
          <div className={`text-xl font-bold ${scoreColor}`}>{scoreLabel}</div>

          {/* Detalle por frame */}
          <div className="w-full flex flex-col gap-1 mt-2">
            {challengeFrameScores.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-white/50">Frame {i + 1}</span>
                <span
                  className={`font-semibold ${
                    s >= 85 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}
                >
                  {s} pts
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2 w-full">
            <button
              onClick={resetChallenge}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              Reintentar
            </button>
            <button
              onClick={() => setMode('demo')}
              className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-all"
            >
              Ver demo
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
            <p className="text-orange-300 text-sm font-medium">
              Frame {challengeFrameIndex + 1} de {totalFrames}
            </p>
            <p className="text-white/70 text-sm mt-1">
              Arrastré cada jugador de ataque a la posición que deberían tener en este frame.
            </p>
          </div>

          <button
            onClick={confirmChallengeFrame}
            className="py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/30"
          >
            Confirmar frame {challengeFrameIndex + 1}
          </button>

          <button
            onClick={resetChallenge}
            className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-sm transition-all"
          >
            Resetear
          </button>
        </>
      )}
    </div>
  )
}
