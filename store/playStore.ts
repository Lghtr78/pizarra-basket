'use client'
import { create } from 'zustand'
import { Play, Keyframe, PlayerPosition, AppMode, Player } from '@/types/play'

const DEFAULT_PLAYERS: Player[] = [
  { id: 'o1', label: '1', role: 'offense', color: '#f97316' },
  { id: 'o2', label: '2', role: 'offense', color: '#f97316' },
  { id: 'o3', label: '3', role: 'offense', color: '#f97316' },
  { id: 'o4', label: '4', role: 'offense', color: '#f97316' },
  { id: 'o5', label: '5', role: 'offense', color: '#f97316' },
  { id: 'd1', label: 'D', role: 'defense', color: '#3b82f6' },
  { id: 'd2', label: 'D', role: 'defense', color: '#3b82f6' },
  { id: 'd3', label: 'D', role: 'defense', color: '#3b82f6' },
  { id: 'd4', label: 'D', role: 'defense', color: '#3b82f6' },
  { id: 'd5', label: 'D', role: 'defense', color: '#3b82f6' },
]

const DEFAULT_POSITIONS: PlayerPosition[] = [
  { playerId: 'o1', x: 50, y: 75 },
  { playerId: 'o2', x: 25, y: 60 },
  { playerId: 'o3', x: 75, y: 60 },
  { playerId: 'o4', x: 20, y: 40 },
  { playerId: 'o5', x: 80, y: 40 },
  { playerId: 'd1', x: 50, y: 55 },
  { playerId: 'd2', x: 30, y: 45 },
  { playerId: 'd3', x: 70, y: 45 },
  { playerId: 'd4', x: 35, y: 30 },
  { playerId: 'd5', x: 65, y: 30 },
]

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function makeInitialPlay(): Play {
  return {
    id: makeId(),
    name: 'Nueva jugada',
    keyframes: [
      { id: makeId(), positions: DEFAULT_POSITIONS },
    ],
  }
}

interface PlayStore {
  players: Player[]
  play: Play
  currentFrameIndex: number
  mode: AppMode
  demoSpeed: number // ms por frame
  isDemoPlaying: boolean
  challengeUserPositions: PlayerPosition[]

  // edit actions
  setPlayName: (name: string) => void
  movePlayer: (playerId: string, x: number, y: number) => void
  addKeyframe: () => void
  removeKeyframe: (frameIndex: number) => void
  goToFrame: (index: number) => void

  // demo actions
  setMode: (mode: AppMode) => void
  setDemoSpeed: (ms: number) => void
  setDemoPlaying: (playing: boolean) => void
  advanceDemoFrame: () => void

  // challenge actions
  moveChallengePlayer: (playerId: string, x: number, y: number) => void
  resetChallenge: () => void
  scoreChallenge: () => number // 0-100

  // serialization
  exportCode: () => string
  importCode: (code: string) => boolean
  loadPlay: (play: Play) => void
}

export const usePlayStore = create<PlayStore>((set, get) => ({
  players: DEFAULT_PLAYERS,
  play: makeInitialPlay(),
  currentFrameIndex: 0,
  mode: 'edit',
  demoSpeed: 1200,
  isDemoPlaying: false,
  challengeUserPositions: [],

  setPlayName: (name) =>
    set((s) => ({ play: { ...s.play, name } })),

  movePlayer: (playerId, x, y) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]
      const positions = frame.positions.map((p) =>
        p.playerId === playerId ? { ...p, x, y } : p
      )
      frames[s.currentFrameIndex] = { ...frame, positions }
      return { play: { ...s.play, keyframes: frames } }
    }),

  addKeyframe: () =>
    set((s) => {
      const last = s.play.keyframes[s.play.keyframes.length - 1]
      const newFrame: Keyframe = {
        id: makeId(),
        positions: last.positions.map((p) => ({ ...p })),
      }
      const keyframes = [...s.play.keyframes, newFrame]
      return {
        play: { ...s.play, keyframes },
        currentFrameIndex: keyframes.length - 1,
      }
    }),

  removeKeyframe: (frameIndex) =>
    set((s) => {
      if (s.play.keyframes.length <= 1) return s
      const keyframes = s.play.keyframes.filter((_, i) => i !== frameIndex)
      const currentFrameIndex = Math.min(s.currentFrameIndex, keyframes.length - 1)
      return { play: { ...s.play, keyframes }, currentFrameIndex }
    }),

  goToFrame: (index) => set({ currentFrameIndex: index }),

  setMode: (mode) =>
    set((s) => {
      if (mode === 'challenge') {
        const firstFrame = s.play.keyframes[0]
        return {
          mode,
          currentFrameIndex: 0,
          challengeUserPositions: firstFrame.positions.map((p) => ({ ...p })),
        }
      }
      return { mode, currentFrameIndex: 0 }
    }),

  setDemoSpeed: (demoSpeed) => set({ demoSpeed }),
  setDemoPlaying: (isDemoPlaying) => set({ isDemoPlaying }),

  advanceDemoFrame: () =>
    set((s) => {
      const next = s.currentFrameIndex + 1
      if (next >= s.play.keyframes.length) {
        return { currentFrameIndex: 0, isDemoPlaying: false }
      }
      return { currentFrameIndex: next }
    }),

  moveChallengePlayer: (playerId, x, y) =>
    set((s) => ({
      challengeUserPositions: s.challengeUserPositions.map((p) =>
        p.playerId === playerId ? { ...p, x, y } : p
      ),
    })),

  resetChallenge: () =>
    set((s) => ({
      challengeUserPositions: s.play.keyframes[0].positions.map((p) => ({ ...p })),
    })),

  scoreChallenge: () => {
    const s = get()
    const target = s.play.keyframes[s.play.keyframes.length - 1].positions
    const user = s.challengeUserPositions
    let totalError = 0
    for (const t of target) {
      const u = user.find((p) => p.playerId === t.playerId)
      if (!u) continue
      const dx = t.x - u.x
      const dy = t.y - u.y
      totalError += Math.sqrt(dx * dx + dy * dy)
    }
    // máximo error teórico: 10 jugadores * ~141 (diagonal) = 1410
    const score = Math.max(0, Math.round(100 - (totalError / 1410) * 100))
    return score
  },

  exportCode: () => {
    const { play } = get()
    return btoa(JSON.stringify(play))
  },

  importCode: (code) => {
    try {
      const play = JSON.parse(atob(code)) as Play
      set({ play, currentFrameIndex: 0, mode: 'edit' })
      return true
    } catch {
      return false
    }
  },

  loadPlay: (play) =>
    set({ play, currentFrameIndex: 0, isDemoPlaying: false }),
}))
