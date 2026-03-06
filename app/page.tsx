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

  return (
    <main className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      {/* Header */}
      <header className="px-4 pt-5 pb-3 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div>
          <h1 className="text-xl font-black tracking-tight text-white">
            🏀 Pizarra <span className="text-orange-500">Basket</span>
          </h1>
          <p className="text-white/40 text-xs mt-0.5">La Plata · Básquet formativo</p>
        </div>
        <button
          onClick={() => setShowShare(!showShare)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            showShare
              ? 'bg-orange-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          Compartir
        </button>
      </header>

      {/* Share panel */}
      {showShare && (
        <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <SharePanel />
          </div>
        </div>
      )}

      {/* Mode tabs */}
      <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setShowShare(false) }}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                mode === m.id
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Board */}
      <div className="px-4 max-w-2xl mx-auto w-full">
        <Board />
      </div>

      {/* Panel según modo */}
      <div className="px-4 pt-4 pb-8 max-w-2xl mx-auto w-full flex-1">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          {mode === 'edit' && <EditPanel />}
          {mode === 'demo' && <DemoPanel />}
          {mode === 'challenge' && <ChallengePanel />}
        </div>
      </div>
    </main>
  )
}
