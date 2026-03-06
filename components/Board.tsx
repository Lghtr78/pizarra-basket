'use client'
import React, { useRef, useEffect } from 'react'
import { usePlayStore } from '@/store/playStore'
import Court, { COURT_WIDTH, COURT_HEIGHT } from './Court'
import PlayerPiece from './PlayerPiece'
import MovementArrows from './MovementArrows'

export default function Board() {
  const svgRef = useRef<SVGSVGElement>(null)
  const {
    players,
    play,
    currentFrameIndex,
    mode,
    isDemoPlaying,
    demoSpeed,
    challengeUserPositions,
    movePlayer,
    moveChallengePlayer,
    advanceDemoFrame,
    setDemoPlaying,
  } = usePlayStore()

  // Demo auto-avance
  useEffect(() => {
    if (mode !== 'demo' || !isDemoPlaying) return
    const timer = setTimeout(() => {
      advanceDemoFrame()
    }, demoSpeed)
    return () => clearTimeout(timer)
  }, [mode, isDemoPlaying, currentFrameIndex, demoSpeed, advanceDemoFrame])

  const currentFrame = play.keyframes[currentFrameIndex]
  const prevFrame = currentFrameIndex > 0 ? play.keyframes[currentFrameIndex - 1] : null

  const positions =
    mode === 'challenge' ? challengeUserPositions : currentFrame.positions

  const draggable = mode === 'edit' || mode === 'challenge'
  const handleMove = mode === 'edit' ? movePlayer : moveChallengePlayer

  // En demo, mostrar flechas del frame anterior al actual
  const showArrows = mode === 'demo' && prevFrame !== null

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[600px] relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
          className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
          style={{ touchAction: 'none' }}
        >
          <Court />
          {showArrows && (
            <MovementArrows from={prevFrame!.positions} to={currentFrame.positions} />
          )}
          {players.map((player) => {
            const pos = positions.find((p) => p.playerId === player.id)
            if (!pos) return null
            return (
              <PlayerPiece
                key={player.id}
                player={player}
                x={pos.x}
                y={pos.y}
                draggable={draggable}
                onMove={handleMove}
                svgRef={svgRef}
              />
            )
          })}
        </svg>

        {/* Indicador de frame en modo demo */}
        {mode === 'demo' && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {play.keyframes.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full border border-white/50 transition-all ${
                  i === currentFrameIndex ? 'bg-white scale-125' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
