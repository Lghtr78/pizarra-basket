'use client'
import React, { useState } from 'react'
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

const ANN_LABELS: Record<string, string> = {
  desplazamiento: '→ Desplaz.',
  pase: '⇢ Pase',
  dribling: '~→ Dribling',
  cortina: '⊣ Cortina',
  tiro: '⇒ Tiro',
}

export default function EditPanel() {
  const {
    play,
    players,
    currentFrameIndex,
    editTool,
    goToFrame,
    addKeyframe,
    removeKeyframe,
    insertFrameAfter,
    setPlayName,
    setEditTool,
    removeAnnotation,
    removeBall,
    saveToLibrary,
    addDefender,
    removeDefender,
    updateKeyframeDescription,
    updatePlayDescription,
  } = usePlayStore()

  const defenderCount = players.filter((p) => p.role === 'defense').length

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    saveToLibrary()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentFrame = play.keyframes[currentFrameIndex]
  const annotations = currentFrame.annotations ?? []
  const hasBall = !!currentFrame.ballPosition

  return (
    <div className="flex flex-col gap-4">

      {/* Toolbar de herramientas */}
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
        {editTool !== 'select' && editTool !== 'ball' && (
          <p className="text-xs text-white/40 mt-1.5 italic">
            Click y arrastrá en la cancha para dibujar.
          </p>
        )}
        {editTool === 'ball' && (
          <p className="text-xs text-white/40 mt-1.5 italic">
            Click en la cancha para ubicar la pelota.
          </p>
        )}
      </div>

      {/* Anotaciones del frame actual */}
      {(annotations.length > 0 || hasBall) && (
        <div>
          <label className="text-xs text-white/60 uppercase tracking-wider">En este frame</label>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {annotations.map((ann) => (
              <span
                key={ann.id}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70"
              >
                {ANN_LABELS[ann.type] ?? ann.type}
                <button
                  onClick={() => removeAnnotation(ann.id)}
                  className="text-red-400 hover:text-red-300"
                >×</button>
              </span>
            ))}
            {hasBall && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-xs text-white/70">
                ○ Pelota
                <button onClick={removeBall} className="text-red-400 hover:text-red-300">×</button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Defensores */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Defensores</label>
        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={removeDefender}
            disabled={defenderCount === 0}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xl font-bold disabled:opacity-30 transition-all flex items-center justify-center"
          >−</button>
          <span className="flex-1 text-center text-white font-semibold">
            {defenderCount} <span className="text-white/50 text-sm font-normal">de 5</span>
          </span>
          <button
            onClick={addDefender}
            disabled={defenderCount >= 5}
            className="w-9 h-9 rounded-lg bg-blue-500/80 hover:bg-blue-500 text-white text-xl font-bold disabled:opacity-30 transition-all flex items-center justify-center"
          >+</button>
        </div>
      </div>

      <div className="border-t border-white/10" />

      {/* Nombre */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Nombre de la jugada</label>
        <input
          className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 text-sm"
          value={play.name}
          onChange={(e) => setPlayName(e.target.value)}
          placeholder="Ej: Pick & Roll con 5"
        />
      </div>

      {/* Descripción global de la jugada */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Descripción general</label>
        <textarea
          className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 text-sm resize-none"
          rows={2}
          value={play.description ?? ''}
          onChange={(e) => updatePlayDescription(e.target.value)}
          placeholder="Objetivo táctico de la jugada (opcional)"
        />
      </div>

      {/* Keyframes */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">Frames de la jugada</label>
        <p className="text-xs text-white/40 mt-0.5 mb-2">
          Mové jugadores y dibujá símbolos en cada frame.
        </p>
        <div className="flex flex-wrap items-center gap-1">
          {play.keyframes.map((kf, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToFrame(i)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    i === currentFrameIndex
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {i === 0 ? 'Inicio' : `F${i}`}
                  {(kf.annotations?.length ?? 0) > 0 && (
                    <span className="ml-1 text-[10px] opacity-60">{kf.annotations!.length}</span>
                  )}
                </button>
                {play.keyframes.length > 1 && (
                  <button
                    onClick={() => removeKeyframe(i)}
                    className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/40 text-xs flex items-center justify-center"
                  >×</button>
                )}
              </div>
              {/* Botón insertar frame después de este */}
              <button
                onClick={() => insertFrameAfter(i)}
                title={`Insertar frame después de ${i === 0 ? 'Inicio' : `F${i}`}`}
                className="w-5 h-5 rounded-full bg-white/5 border border-dashed border-white/20 text-white/40 hover:border-orange-400 hover:text-orange-400 text-xs flex items-center justify-center transition-all"
              >+</button>
            </React.Fragment>
          ))}
          <button
            onClick={addKeyframe}
            className="px-3 py-1.5 rounded-lg text-sm bg-white/5 border border-dashed border-white/20 text-white/50 hover:border-orange-400 hover:text-orange-400 transition-all"
          >
            + Frame
          </button>
        </div>
      </div>

      {/* Descripción del frame actual */}
      <div>
        <label className="text-xs text-white/60 uppercase tracking-wider">
          Descripción del frame {currentFrameIndex === 0 ? 'inicial' : currentFrameIndex}
        </label>
        <textarea
          className="mt-1 w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:border-orange-400 text-sm resize-none"
          rows={2}
          value={currentFrame.description ?? ''}
          onChange={(e) => updateKeyframeDescription(currentFrameIndex, e.target.value)}
          placeholder="Explicación táctica (opcional, se muestra en Demo)"
        />
      </div>

      <div className="border-t border-white/10" />

      {/* Guardar en biblioteca */}
      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
          saved
            ? 'bg-green-500 text-white shadow-green-500/30'
            : 'bg-orange-500 hover:bg-orange-400 text-white shadow-orange-500/30'
        }`}
      >
        {saved ? '✓ Guardado en biblioteca' : '💾 Guardar en biblioteca'}
      </button>
    </div>
  )
}
