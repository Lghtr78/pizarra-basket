'use client'
import React, { useState } from 'react'
import { usePlayStore } from '@/store/playStore'
import Board from '@/components/Board'
import EditPanel from '@/components/EditPanel'
import DemoPanel from '@/components/DemoPanel'
import ChallengePanel from '@/components/ChallengePanel'
import SharePanel from '@/components/SharePanel'
import { AppMode } from '@/types/play'

const MODES: { id: AppMode; label: string; emoji: string }[] = [
  { id: 'edit', label: 'Editor', emoji: '✏️' },
  { id: 'demo', label: 'Demo', emoji: '▶' },
  { id: 'challenge', label: 'Desafío', emoji: '🎯' },
]

export default function Home() {
  const { mode, setMode } = usePlayStore()
  const [showShare, setShowShare] = useState(false)
  const [panelCollapsed, setPanelCollapsed] = useState(false)

  return (
    <main className="h-screen bg-[#0f1117] text-white flex flex-col overflow-hidden">

      {/* Header — fila superior compacta con tabs integrados */}
      <header className="flex items-center gap-3 px-4 py-2 border-b border-white/10 shrink-0">
        {/* Logo */}
        <div className="shrink-0">
          <h1 className="text-base font-black tracking-tight text-white leading-none">
            🏀 Pizarra <span className="text-orange-500">Basket</span>
          </h1>
          <p className="text-white/30 text-[10px]">La Plata · Básquet formativo</p>
        </div>

        {/* Tabs de modo — centro */}
        <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl flex-1 max-w-xs mx-auto">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setShowShare(false) }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        {/* Botón Compartir */}
        <div className="shrink-0">
          <button
            onClick={() => setShowShare(!showShare)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showShare ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Compartir
          </button>
        </div>
      </header>

      {/* Panel flotante Compartir */}
      {showShare && (
        <div className="px-4 py-2 border-b border-white/10 shrink-0">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
            <SharePanel />
          </div>
        </div>
      )}

      {/* Cuerpo principal — horizontal */}
      <div className="flex flex-1 overflow-hidden">

        {/* Cancha — ocupa todo el espacio disponible */}
        <div className="flex-1 flex items-center justify-center p-3 overflow-hidden">
          <Board />
        </div>

        {/* Panel lateral derecho */}
        {!panelCollapsed && (
          <div className="w-72 shrink-0 border-l border-white/10 flex flex-col overflow-hidden">
            {/* Botón colapsar */}
            <div className="flex justify-end px-3 pt-2 shrink-0">
              <button
                onClick={() => setPanelCollapsed(true)}
                className="text-white/30 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-all"
                title="Colapsar panel"
              >
                ‹ Ocultar
              </button>
            </div>
            {/* Contenido del panel con scroll */}
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                {mode === 'edit' && <EditPanel />}
                {mode === 'demo' && <DemoPanel onPlay={() => setPanelCollapsed(true)} />}
                {mode === 'challenge' && <ChallengePanel />}
              </div>
            </div>
          </div>
        )}

        {/* Botón para expandir panel cuando está colapsado */}
        {panelCollapsed && (
          <div className="flex items-start pt-2 pr-2 shrink-0">
            <button
              onClick={() => setPanelCollapsed(false)}
              className="text-white/30 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-all"
              title="Expandir panel"
            >
              › Panel
            </button>
          </div>
        )}

      </div>
    </main>
  )
}
