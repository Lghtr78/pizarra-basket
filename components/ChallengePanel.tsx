'use client'
import React from 'react'
import { usePlayStore } from '@/store/playStore'
import { EditorTool } from '@/types/play'

const TOOLS: { id: EditorTool; label: string; desc: string; activeClass: string }[] = [
  { id: 'select',         label: '✋',  desc: 'Mover',    activeClass: 'bg-white/30 text-white ring-1 ring-white/40' },
  { id: 'desplazamiento', label: '→',   desc: 'Desplaz.', activeClass: 'bg-white text-gray-900' },
  { id: 'pase',           label: '⇢',   desc: 'Pase',     activeClass: 'bg-yellow-400 text-gray-900' },
  { id: 'dribling',       label: '~→',  desc: 'Dribling', activeClass: 'bg-orange-500 text-white' },
  { id: 'cortina',        label: '⊣',   desc: 'Cortina',  activeClass: 'bg-blue-400 text-white' },
  { id: 'tiro',           label: '⇒',   desc: 'Tiro',     activeClass: 'bg-red-400 text-white' },
  { id: 'ball',           label: '○',   desc: 'Pelota',   activeClass: 'bg-white/30 text-white ring-1 ring-white/40' },
]

export default function ChallengePanel() {
  const {
    play,
    editTool,
    setEditTool,
    challengeFrameIndex,
    challengeFrameScores,
    challengeUserAnnotations,
    challengeReviewingFrame,
    confirmChallengeFrame,
    advanceChallengeFrame,
    clearChallengeAnnotations,
    resetChallenge,
    setMode,
  } = usePlayStore()

  const totalFrames = play.keyframes.length
  // isDone: todos los frames confirmados Y ya salió de la revisión del último
  const isDone = challengeFrameIndex >= totalFrames && !challengeReviewingFrame

  const avgScore =
    isDone && challengeFrameScores.length > 0
      ? Math.round(challengeFrameScores.reduce((a, b) => a + b, 0) / challengeFrameScores.length)
      : 0

  const scoreLabel =
    avgScore >= 85 ? '¡Excelente!' : avgScore >= 60 ? '¡Bien!' : 'Seguí practicando'
  const scoreColor =
    avgScore >= 85 ? 'text-green-400' : avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'

  const currentFrame = play.keyframes[challengeFrameIndex] ?? null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-white font-semibold text-lg">{play.name}</p>
        <p className="text-white/50 text-sm mt-0.5">
          Armá la jugada tal como lo haría el entrenador.
        </p>
      </div>

      {/* Barra de progreso por frames */}
      <div className="flex gap-1">
        {Array.from({ length: totalFrames }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1.5 rounded-full ${
              i < challengeFrameScores.length
                ? challengeFrameScores[i] >= 85
                  ? 'bg-green-400'
                  : challengeFrameScores[i] >= 60
                  ? 'bg-yellow-400'
                  : 'bg-red-400'
                : i === challengeFrameIndex && !isDone
                ? 'bg-orange-400'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {challengeReviewingFrame ? (
        /* ── Pantalla de revisión: board congelado, se muestra score del frame ── */
        (() => {
          const frameScore = challengeFrameScores[challengeFrameIndex]
          const isLast = challengeFrameIndex >= totalFrames - 1
          const scoreColor =
            frameScore >= 85 ? 'text-green-400' : frameScore >= 60 ? 'text-yellow-400' : 'text-red-400'
          const scoreLabel =
            frameScore >= 85 ? '¡Excelente!' : frameScore >= 60 ? '¡Bien!' : 'Podés mejorar'
          return (
            <div className="flex flex-col gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2">
                <p className="text-white/50 text-xs uppercase tracking-wider">
                  Frame {challengeFrameIndex + 1} de {totalFrames}
                </p>
                <div className={`text-5xl font-black ${scoreColor}`}>{frameScore}</div>
                <div className={`text-sm font-semibold ${scoreColor}`}>{scoreLabel}</div>
                <p className="text-white/40 text-xs text-center mt-1">
                  El board muestra lo que armaste
                </p>
              </div>

              <button
                onClick={advanceChallengeFrame}
                className="py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-base transition-all shadow-lg shadow-orange-500/20"
              >
                {isLast ? 'Ver resultados finales →' : `Continuar al frame ${challengeFrameIndex + 2} →`}
              </button>

              <button
                onClick={resetChallenge}
                className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 text-sm transition-all"
              >
                Resetear todo
              </button>
            </div>
          )
        })()
      ) : isDone ? (
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
          {/* Info del frame actual */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
            <p className="text-orange-300 text-sm font-medium">
              Frame {challengeFrameIndex + 1} de {totalFrames}
            </p>
            {currentFrame?.description ? (
              <p className="text-white/80 text-sm mt-1 italic">&ldquo;{currentFrame.description}&rdquo;</p>
            ) : (
              <p className="text-white/50 text-sm mt-1">
                Posicioná jugadores, pelota y anotaciones como corresponde.
              </p>
            )}
          </div>

          {/* Toolbar — mismo que edit */}
          <div>
            <label className="text-xs text-white/60 uppercase tracking-wider">Herramientas</label>
            <div className="grid grid-cols-7 gap-1 mt-2">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setEditTool(tool.id)}
                  title={tool.desc}
                  className={`flex flex-col items-center justify-center py-2 rounded-lg text-sm font-bold transition-all ${
                    editTool === tool.id
                      ? tool.activeClass
                      : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <span className="text-base leading-none">{tool.label}</span>
                  <span className="text-[9px] mt-0.5 opacity-70 leading-none">{tool.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Confirmar */}
          <button
            onClick={confirmChallengeFrame}
            className="py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-lg transition-all shadow-lg shadow-green-500/30"
          >
            Confirmar frame {challengeFrameIndex + 1}
          </button>

          {/* Acciones secundarias */}
          <div className="flex gap-2">
            <button
              onClick={clearChallengeAnnotations}
              disabled={challengeUserAnnotations.length === 0}
              className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white/60 text-sm transition-all"
              title="Borra todas las líneas y flechas dibujadas"
            >
              ✕ Limpiar líneas
            </button>
            <button
              onClick={resetChallenge}
              className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-sm transition-all"
            >
              Resetear todo
            </button>
          </div>
        </>
      )}
    </div>
  )
}
