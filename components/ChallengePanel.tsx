'use client'
import React, { useState } from 'react'
import { usePlayStore } from '@/store/playStore'

export default function ChallengePanel() {
  const { play, resetChallenge, scoreChallenge, setMode } = usePlayStore()
  const [result, setResult] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    const score = scoreChallenge()
    setResult(score)
    setSubmitted(true)
  }

  const handleRetry = () => {
    resetChallenge()
    setResult(null)
    setSubmitted(false)
  }

  const scoreLabel = result === null ? '' : result >= 85 ? '¡Excelente!' : result >= 60 ? '¡Bien!' : 'Seguí practicando'
  const scoreColor = result === null ? '' : result >= 85 ? 'text-green-400' : result >= 60 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-white font-semibold text-lg">{play.name}</p>
        <p className="text-white/50 text-sm mt-0.5">
          Miraste el demo. Ahora reproducí la jugada final ubicando a todos los jugadores en su posición correcta.
        </p>
      </div>

      {submitted ? (
        <div className="flex flex-col gap-3 items-center py-4">
          <div className="text-6xl font-black text-white">{result}</div>
          <div className="text-sm text-white/50">puntos sobre 100</div>
          <div className={`text-xl font-bold ${scoreColor}`}>{scoreLabel}</div>

          <div className="flex gap-3 mt-2 w-full">
            <button
              onClick={handleRetry}
              className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all"
            >
              Intentar de nuevo
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
            <p className="text-orange-300 text-sm font-medium">Instrucción</p>
            <p className="text-white/70 text-sm mt-1">
              Arrastré cada jugador a la posición que deberían tener al <strong className="text-white">final</strong> de la jugada.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            className="py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/30"
          >
            Confirmar posiciones
          </button>

          <button
            onClick={handleRetry}
            className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-sm transition-all"
          >
            Resetear
          </button>
        </>
      )}
    </div>
  )
}
