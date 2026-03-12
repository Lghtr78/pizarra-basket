'use client'
import React, { useRef, useState, useCallback } from 'react'
import { usePlayStore } from '@/store/playStore'
import Court, { COURT_WIDTH, COURT_HEIGHT } from './Court'
import PlayerPiece from './PlayerPiece'
import AnnotationLayer from './AnnotationLayer'
import NarrativeOverlay from './NarrativeOverlay'
import { useNarrativeEngine } from '@/hooks/useNarrativeEngine'
import { AnnotationType } from '@/types/play'

const BALL_RADIUS = 12

// Interpolación sobre curva bezier cuadrática
function bezierPoint(t: number, p0x: number, p0y: number, cpx: number, cpy: number, p2x: number, p2y: number) {
  const m = 1 - t
  return {
    x: m * m * p0x + 2 * m * t * cpx + t * t * p2x,
    y: m * m * p0y + 2 * m * t * cpy + t * t * p2y,
  }
}

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
    challengeUserBallPosition,
    challengeUserAnnotations,
    movePlayer,
    moveChallengePlayer,
    moveChallengeUserBall,
    advanceDemoFrame,
    addAnnotation,
    removeAnnotation,
    moveAnnotationControl,
    moveAnnotationFrom,
    moveAnnotationTo,
    addChallengeAnnotation,
    removeChallengeAnnotation,
    moveChallengeAnnotationControl,
    moveChallengeAnnotationFrom,
    moveChallengeAnnotationTo,
    moveBall,
  } = usePlayStore()

  // Narrative Engine — reemplaza el timer y el rAF de demo
  const engine = useNarrativeEngine({
    mode,
    isDemoPlaying,
    currentFrameIndex,
    play,
    demoSpeed,
    advanceDemoFrame,
  })

  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const [drawPreview, setDrawPreview] = useState<{ from: {x:number,y:number}; to: {x:number,y:number} } | null>(null)

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

  const isInteractiveMode = mode === 'edit' || mode === 'challenge'
  const isDrawingTool = isInteractiveMode && editTool !== 'select' && editTool !== 'ball'
  const isBallTool    = isInteractiveMode && editTool === 'ball'

  // Rutas de mutación según modo
  const effectiveMoveBall    = mode === 'challenge' ? moveChallengeUserBall : moveBall
  const effectiveAddAnn      = mode === 'challenge' ? addChallengeAnnotation : addAnnotation
  const effectiveRemoveAnn   = mode === 'challenge' ? removeChallengeAnnotation : removeAnnotation
  const effectiveMoveCtrl    = mode === 'challenge' ? moveChallengeAnnotationControl : moveAnnotationControl
  const effectiveMoveFrom    = mode === 'challenge' ? moveChallengeAnnotationFrom : moveAnnotationFrom
  const effectiveMoveTo      = mode === 'challenge' ? moveChallengeAnnotationTo : moveAnnotationTo

  const handleSVGMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!(isDrawingTool || isBallTool)) return
      const coords = getSVGCoords(e.clientX, e.clientY)
      if (!coords) return
      if (isBallTool) { effectiveMoveBall(coords.x, coords.y); return }
      drawStartRef.current = coords
      setDrawPreview({ from: coords, to: coords })
    },
    [isDrawingTool, isBallTool, getSVGCoords, effectiveMoveBall]
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
          effectiveAddAnn({
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
    [isDrawingTool, getSVGCoords, effectiveAddAnn, editTool]
  )

  // Drag de la pelota con herramienta ball
  const handleBallMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isBallTool) return
      e.stopPropagation()
      const move = (ev: MouseEvent) => {
        const coords = getSVGCoords(ev.clientX, ev.clientY)
        if (coords) effectiveMoveBall(coords.x, coords.y)
      }
      const up = () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
    },
    [isBallTool, getSVGCoords, effectiveMoveBall]
  )

  const currentFrame = play.keyframes[currentFrameIndex]
  const prevFrame = currentFrameIndex > 0 ? play.keyframes[currentFrameIndex - 1] : null

  const positions    = mode === 'challenge' ? challengeUserPositions : currentFrame.positions
  const annotations  = mode === 'challenge' ? challengeUserAnnotations : (currentFrame.annotations ?? [])
  const ballPos      = mode === 'challenge' ? challengeUserBallPosition : currentFrame.ballPosition

  const draggable  = isInteractiveMode && editTool === 'select'
  const handleMove = mode === 'edit' ? movePlayer : moveChallengePlayer

  // Posición efectiva de la pelota — movida por el engine en pase/dribling
  const movingBall = engine.movingBall
  let effectiveBallX: number = ballPos?.x ?? (movingBall?.fromX ?? 50)
  let effectiveBallY: number = ballPos?.y ?? (movingBall?.fromY ?? 50)
  if (movingBall && engine.movingBallProgress > 0) {
    const t   = engine.movingBallProgress
    const cpx = movingBall.cx ?? (movingBall.fromX + movingBall.toX) / 2
    const cpy = movingBall.cy ?? (movingBall.fromY + movingBall.toY) / 2
    const m   = 1 - t
    effectiveBallX = m*m*movingBall.fromX + 2*m*t*cpx + t*t*movingBall.toX
    effectiveBallY = m*m*movingBall.fromY + 2*m*t*cpy + t*t*movingBall.toY
  }

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
  // CSS transition solo para navegación manual en demo (engine toma el control al reproducir)
  const transitionDuration = mode === 'demo' && !isDemoPlaying ? Math.round(demoSpeed * 0.85) : 0

  return (
    <div className="w-full flex items-center justify-center">
      <div className="w-full max-w-[690px] relative">
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

          {/* Estilos de transición para jugadores */}
          <style>{`
            @keyframes desc-fade-in { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
            .player-layer > g { transition: transform ${transitionDuration}ms ease-in-out; }
          `}</style>

          {/* Anotaciones */}
          <AnnotationLayer
            annotations={annotations}
            preview={preview}
            onRemove={isInteractiveMode && editTool === 'select' ? effectiveRemoveAnn : undefined}
            onMoveControl={isInteractiveMode ? effectiveMoveCtrl : undefined}
            onMoveFrom={isInteractiveMode ? effectiveMoveFrom : undefined}
            onMoveTo={isInteractiveMode ? effectiveMoveTo : undefined}
            svgRef={svgRef}
            narrativeMode={mode === 'demo' && isDemoPlaying}
            visibleAnnotationIds={engine.visibleAnnotationIds}
            drawingAnnotationId={engine.drawingAnnotationId}
            drawingProgress={engine.drawingProgress}
            annotationOpacity={engine.annotationOpacity}
          />

          {/* Jugadores — opacidad controlada por el engine en fase players_appear */}
          <g
            className="player-layer"
            style={{ opacity: mode === 'demo' && isDemoPlaying ? engine.playerOpacity : 1 }}
          >
            {players.map((player) => {
              const pos = positions.find((p) => p.playerId === player.id)
              if (!pos) return null

              // Calcular posición efectiva: bezier, lineal o posición del frame
              let effectiveX = pos.x
              let effectiveY = pos.y

              if (mode === 'demo' && isDemoPlaying && prevFrame && engine.animProgress > 0 && engine.animProgress < 1) {
                const prevPos = prevFrame.positions.find((p) => p.playerId === player.id)
                const annotation = (prevFrame.annotations ?? []).find(
                  (a) => a.type === 'desplazamiento' && a.playerId === player.id
                )
                if (annotation && prevPos) {
                  const cpx = annotation.cx ?? (annotation.fromX + annotation.toX) / 2
                  const cpy = annotation.cy ?? (annotation.fromY + annotation.toY) / 2
                  const pt = bezierPoint(engine.animProgress, annotation.fromX, annotation.fromY, cpx, cpy, annotation.toX, annotation.toY)
                  effectiveX = pt.x
                  effectiveY = pt.y
                } else if (prevPos) {
                  effectiveX = prevPos.x + (pos.x - prevPos.x) * engine.animProgress
                  effectiveY = prevPos.y + (pos.y - prevPos.y) * engine.animProgress
                }
              }

              return (
                <PlayerPiece
                  key={player.id}
                  player={player}
                  x={effectiveX}
                  y={effectiveY}
                  draggable={draggable}
                  onMove={handleMove}
                  svgRef={svgRef}
                />
              )
            })}
          </g>

          {/* Pelota */}
          {(ballPos || movingBall) && (
            <g
              transform={`translate(${(effectiveBallX / 100) * COURT_WIDTH}, ${(effectiveBallY / 100) * COURT_HEIGHT})`}
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

        {/* Overlay narrativo durante reproducción */}
        {mode === 'demo' && isDemoPlaying && (
          <NarrativeOverlay
            segments={engine.segments}
            currentIndex={engine.currentSegmentIndex}
            frameKey={currentFrameIndex}
          />
        )}

        {/* Descripción estática cuando demo está pausado */}
        {mode === 'demo' && !isDemoPlaying && currentFrame.description && (
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
