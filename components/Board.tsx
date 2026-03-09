'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react'
import { usePlayStore } from '@/store/playStore'
import Court, { COURT_WIDTH, COURT_HEIGHT } from './Court'
import PlayerPiece from './PlayerPiece'
import MovementArrows from './MovementArrows'
import AnnotationLayer from './AnnotationLayer'
import { AnnotationType } from '@/types/play'

const BALL_RADIUS = 10

export default function Board() {
  const svgRef = useRef<SVGSVGElement>(null)
  const {
    players,
    play,
    currentFrameIndex,
    mode,
    isDemoPlaying,
    demoSpeed,
    editTool,
    challengeUserPositions,
    movePlayer,
    moveChallengePlayer,
    advanceDemoFrame,
    addAnnotation,
    removeAnnotation,
    moveAnnotationControl,
    moveBall,
  } = usePlayStore()

  // useRef para evitar stale closure en los event handlers
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const [drawPreview, setDrawPreview] = useState<{ from: {x:number,y:number}; to: {x:number,y:number} } | null>(null)

  // Demo auto-avance
  useEffect(() => {
    if (mode !== 'demo' || !isDemoPlaying) return
    const timer = setTimeout(() => {
      advanceDemoFrame()
    }, demoSpeed)
    return () => clearTimeout(timer)
  }, [mode, isDemoPlaying, currentFrameIndex, demoSpeed, advanceDemoFrame])

  const getSVGCoords = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    const scaleX = COURT_WIDTH / rect.width
    const scaleY = COURT_HEIGHT / rect.height
    const svgX = (clientX - rect.left) * scaleX
    const svgY = (clientY - rect.top) * scaleY
    return {
      x: Math.max(1, Math.min(99, (svgX / COURT_WIDTH) * 100)),
      y: Math.max(1, Math.min(99, (svgY / COURT_HEIGHT) * 100)),
    }
  }, [])

  const isDrawingTool = mode === 'edit' && editTool !== 'select' && editTool !== 'ball'
  const isBallTool = mode === 'edit' && editTool === 'ball'

  const handleSVGMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!(isDrawingTool || isBallTool)) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (!coords) return
      if (isBallTool) { moveBall(coords.x, coords.y); return }
      drawStartRef.current = coords
      setDrawPreview({ from: coords, to: coords })
    },
    [isDrawingTool, isBallTool, getSVGCoords, moveBall]
  )

  const handleSVGMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawingTool || !drawStartRef.current) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (coords) setDrawPreview({ from: drawStartRef.current, to: coords })
    },
    [isDrawingTool, getSVGCoords]
  )

  const handleSVGMouseUp = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const start = drawStartRef.current
      if (!isDrawingTool || !start) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (coords) {
        const dx = coords.x - start.x
        const dy = coords.y - start.y
        if (Math.sqrt(dx * dx + dy * dy) > 2) {
          addAnnotation({
            type: editTool as AnnotationType,
            fromX: start.x,
            fromY: start.y,
            toX: coords.x,
            toY: coords.y,
          })
        }
      }
      drawStartRef.current = null
      setDrawPreview(null)
    },
    [isDrawingTool, getSVGCoords, addAnnotation, editTool]
  )

  // T4: drag de la pelota con herramienta ball
  const handleBallMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isBallTool) return
      e.stopPropagation()
      const move = (ev: MouseEvent) => {
        const coords = getSVGCoords(ev.clientX, ev.clientY)
        if (coords) moveBall(coords.x, coords.y)
      }
      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
    },
    [isBallTool, getSVGCoords, moveBall]
  )

  const currentFrame = play.keyframes[currentFrameIndex]
  const prevFrame = currentFrameIndex > 0 ? play.keyframes[currentFrameIndex - 1] : null

  const positions =
    mode === 'challenge' ? challengeUserPositions : currentFrame.positions

  const draggable = (mode === 'edit' || mode === 'challenge') && editTool === 'select'
  const handleMove = mode === 'edit' ? movePlayer : moveChallengePlayer

  const showMovementArrows = mode === 'demo' && prevFrame !== null
  const annotations = currentFrame.annotations ?? []
  const ballPos = currentFrame.ballPosition

  const preview =
    isDrawingTool && drawPreview
      ? {
          type: editTool as AnnotationType,
          fromX: drawPreview.from.x,
          fromY: drawPreview.from.y,
          toX: drawPreview.to.x,
          toY: drawPreview.to.y,
        }
      : null

  const svgCursor = isDrawingTool ? 'crosshair' : isBallTool ? 'cell' : 'default'
  // T3: duración de transición CSS para animación suave en demo
  const transitionDuration = mode === 'demo' ? Math.round(demoSpeed * 0.85) : 0

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-[600px] relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`}
          className="w-full h-auto rounded-xl shadow-2xl border border-gray-300"
          style={{ touchAction: 'none', cursor: svgCursor }}
          onMouseDown={handleSVGMouseDown}
          onMouseMove={handleSVGMouseMove}
          onMouseUp={handleSVGMouseUp}
          onMouseLeave={() => { drawStartRef.current = null; setDrawPreview(null) }}
        >
          <Court />

          {/* T3: estilos de transición para jugadores y animación de descripción */}
          <style>{`
            @keyframes desc-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
            .player-layer > g { transition: transform ${transitionDuration}ms ease-in-out; }
          `}</style>

          {/* Anotaciones del frame actual */}
          <AnnotationLayer
            annotations={annotations}
            preview={preview}
            onRemove={mode === 'edit' && editTool === 'select' ? removeAnnotation : undefined}
            onMoveControl={mode === 'edit' ? moveAnnotationControl : undefined}
            svgRef={svgRef}
          />

          {/* Flechas de movimiento automático en demo */}
          {showMovementArrows && (
            <MovementArrows from={prevFrame!.positions} to={currentFrame.positions} />
          )}

          {/* Jugadores — T3: wrapper para transiciones CSS */}
          <g className="player-layer">
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
          </g>

          {/* Pelota — T4: drag con herramienta ball */}
          {ballPos && (
            <g
              transform={`translate(${(ballPos.x / 100) * COURT_WIDTH}, ${(ballPos.y / 100) * COURT_HEIGHT})`}
              style={{ cursor: isBallTool ? 'cell' : 'default' }}
              onMouseDown={handleBallMouseDown}
            >
              <circle r={BALL_RADIUS} fill="none" stroke="#1f1f1f" strokeWidth={2.5} />
              <line x1={-BALL_RADIUS} y1={0} x2={BALL_RADIUS} y2={0} stroke="#1f1f1f" strokeWidth={1} opacity={0.5} />
              <line x1={0} y1={-BALL_RADIUS} x2={0} y2={BALL_RADIUS} stroke="#1f1f1f" strokeWidth={1} opacity={0.5} />
            </g>
          )}

          {/* Indicador de frame en demo */}
          {mode === 'demo' && (
            <g transform={`translate(${COURT_WIDTH / 2}, ${COURT_HEIGHT - 15})`}>
              {play.keyframes.map((_, i) => (
                <circle
                  key={i}
                  cx={(i - (play.keyframes.length - 1) / 2) * 16}
                  cy={0}
                  r={5}
                  fill={i === currentFrameIndex ? '#1f1f1f' : 'rgba(0,0,0,0.25)'}
                  stroke="rgba(0,0,0,0.4)"
                  strokeWidth={1}
                />
              ))}
            </g>
          )}
        </svg>

        {/* T5: overlay de descripción del frame en modo demo */}
        {mode === 'demo' && currentFrame.description && (
          <div
            key={currentFrameIndex}
            className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"
            style={{ animation: 'desc-fade-in 0.4s ease-out' }}
          >
            <div className="bg-black/70 text-white text-sm px-4 py-2 rounded-xl text-center backdrop-blur-sm">
              {currentFrame.description}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
