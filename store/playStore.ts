'use client'
import { create } from 'zustand'
import { Play, Keyframe, PlayerPosition, AppMode, Player, Annotation, EditorTool } from '@/types/play'

const LIBRARY_KEY = 'pizarra-basket-library'

function loadLibraryFromStorage(): Play[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY) ?? '[]') as Play[]
  } catch {
    return []
  }
}

function persistLibrary(library: Play[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library))
}

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

const DEFAULT_INITIAL_POSITIONS: PlayerPosition[] = [
  { playerId: 'o1', x: 50, y: 63 },   // Base (PG) — tope del arco de 3, centro
  { playerId: 'o2', x: 83, y: 47 },   // Escolta (SG) — ala derecha, línea de 3
  { playerId: 'o3', x: 17, y: 47 },   // Alero (SF) — ala izquierda, línea de 3
  { playerId: 'o4', x: 94, y: 16 },   // Ala-pívot (PF) — esquina derecha (corner 3)
  { playerId: 'o5', x: 6,  y: 16 },   // Pívot (C) — esquina izquierda (corner 3)
  { playerId: 'd1', x: 50, y: 55 },
  { playerId: 'd2', x: 30, y: 45 },
  { playerId: 'd3', x: 70, y: 45 },
  { playerId: 'd4', x: 35, y: 30 },
  { playerId: 'd5', x: 65, y: 30 },
]

const FIVE_OUT: PlayerPosition[] = [
  { playerId: 'o1', x: 50, y: 78 },
  { playerId: 'o2', x: 83, y: 55 },
  { playerId: 'o3', x: 17, y: 55 },
  { playerId: 'o4', x: 68, y: 30 },
  { playerId: 'o5', x: 32, y: 30 },
]

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function makeInitialPlay(): Play {
  return {
    id: makeId(),
    name: 'Nueva jugada',
    keyframes: [
      { id: makeId(), positions: DEFAULT_INITIAL_POSITIONS, annotations: [] },
    ],
  }
}

interface PlayStore {
  players: Player[]
  play: Play
  currentFrameIndex: number
  mode: AppMode
  demoSpeed: number
  isDemoPlaying: boolean
  challengeUserPositions: PlayerPosition[]
  challengeFrameIndex: number
  challengeFrameScores: number[]
  editTool: EditorTool
  library: Play[]

  // edit actions
  setPlayName: (name: string) => void
  updatePlayDescription: (description: string) => void
  movePlayer: (playerId: string, x: number, y: number) => void
  addKeyframe: () => void
  removeKeyframe: (frameIndex: number) => void
  insertFrameAfter: (index: number) => void
  goToFrame: (index: number) => void
  setEditTool: (tool: EditorTool) => void
  addAnnotation: (ann: Omit<Annotation, 'id'>) => void
  removeAnnotation: (annId: string) => void
  moveAnnotationControl: (annId: string, cx: number, cy: number) => void
  moveAnnotationFrom: (annId: string, fromX: number, fromY: number) => void
  moveAnnotationTo: (annId: string, toX: number, toY: number) => void
  moveBall: (x: number, y: number) => void
  removeBall: () => void
  updateKeyframeDescription: (frameIndex: number, description: string) => void

  // defender management
  addDefender: () => void
  removeDefender: () => void

  // library actions
  saveToLibrary: () => void
  removeFromLibrary: (playId: string) => void

  // demo actions
  setMode: (mode: AppMode) => void
  setDemoSpeed: (ms: number) => void
  setDemoPlaying: (playing: boolean) => void
  advanceDemoFrame: () => void

  // challenge actions
  moveChallengePlayer: (playerId: string, x: number, y: number) => void
  resetChallenge: () => void
  scoreChallenge: () => number
  confirmChallengeFrame: () => void

  // library
  loadPlay: (play: Play) => void

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
  challengeFrameIndex: 0,
  challengeFrameScores: [],
  editTool: 'select',
  library: loadLibraryFromStorage(),

  setPlayName: (name) =>
    set((s) => ({ play: { ...s.play, name } })),

  updatePlayDescription: (description) =>
    set((s) => ({ play: { ...s.play, description: description || undefined } })),

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
        annotations: [],
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

  insertFrameAfter: (index) =>
    set((s) => {
      const source = s.play.keyframes[index]
      const newFrame: Keyframe = {
        id: makeId(),
        positions: source.positions.map((p) => ({ ...p })),
        annotations: [],
      }
      const keyframes = [
        ...s.play.keyframes.slice(0, index + 1),
        newFrame,
        ...s.play.keyframes.slice(index + 1),
      ]
      return { play: { ...s.play, keyframes }, currentFrameIndex: index + 1 }
    }),

  goToFrame: (index) => set({ currentFrameIndex: index }),

  addDefender: () =>
    set((s) => {
      const count = s.players.filter((p) => p.role === 'defense').length
      if (count >= 5) return s
      const n = count + 1
      const id = `d${n}`
      const newPlayer: Player = { id, label: 'D', role: 'defense', color: '#3b82f6' }
      const newPos: PlayerPosition = { playerId: id, x: 40 + n * 5, y: 45 }
      return {
        players: [...s.players, newPlayer],
        play: {
          ...s.play,
          keyframes: s.play.keyframes.map((kf) => ({
            ...kf,
            positions: [...kf.positions, { ...newPos }],
          })),
        },
      }
    }),

  removeDefender: () =>
    set((s) => {
      const defenders = s.players.filter((p) => p.role === 'defense')
      if (defenders.length === 0) return s
      const last = defenders[defenders.length - 1]
      return {
        players: s.players.filter((p) => p.id !== last.id),
        play: {
          ...s.play,
          keyframes: s.play.keyframes.map((kf) => ({
            ...kf,
            positions: kf.positions.filter((p) => p.playerId !== last.id),
          })),
        },
      }
    }),

  setEditTool: (editTool) => set({ editTool }),

  addAnnotation: (ann) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]

      // Detectar jugador cercano al origen de la flecha
      let playerId: string | undefined = undefined
      if (ann.type === 'desplazamiento') {
        const THRESHOLD = 8
        let minDist = Infinity
        for (const pos of frame.positions) {
          const dx = pos.x - ann.fromX
          const dy = pos.y - ann.fromY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < THRESHOLD && dist < minDist) {
            minDist = dist
            playerId = pos.playerId
          }
        }
      }

      const annotations = [
        ...(frame.annotations ?? []),
        { ...ann, id: makeId(), ...(playerId ? { playerId } : {}) }
      ]
      frames[s.currentFrameIndex] = { ...frame, annotations }
      return { play: { ...s.play, keyframes: frames } }
    }),

  removeAnnotation: (annId) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]
      const annotations = (frame.annotations ?? []).filter((a) => a.id !== annId)
      frames[s.currentFrameIndex] = { ...frame, annotations }
      return { play: { ...s.play, keyframes: frames } }
    }),

  moveAnnotationControl: (annId, cx, cy) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]
      const annotations = (frame.annotations ?? []).map((a) =>
        a.id === annId ? { ...a, cx, cy } : a
      )
      frames[s.currentFrameIndex] = { ...frame, annotations }
      return { play: { ...s.play, keyframes: frames } }
    }),

  moveAnnotationFrom: (annId, fromX, fromY) =>
    set((s) => ({
      play: {
        ...s.play,
        keyframes: s.play.keyframes.map((kf, i) =>
          i !== s.currentFrameIndex ? kf : {
            ...kf,
            annotations: (kf.annotations ?? []).map((ann) =>
              ann.id !== annId ? ann : { ...ann, fromX, fromY }
            ),
          }
        ),
      },
    })),

  moveAnnotationTo: (annId, toX, toY) =>
    set((s) => ({
      play: {
        ...s.play,
        keyframes: s.play.keyframes.map((kf, i) =>
          i !== s.currentFrameIndex ? kf : {
            ...kf,
            annotations: (kf.annotations ?? []).map((ann) =>
              ann.id !== annId ? ann : { ...ann, toX, toY }
            ),
          }
        ),
      },
    })),

  moveBall: (x, y) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]
      frames[s.currentFrameIndex] = { ...frame, ballPosition: { x, y } }
      return { play: { ...s.play, keyframes: frames } }
    }),

  removeBall: () =>
    set((s) => {
      const frames = [...s.play.keyframes]
      const frame = frames[s.currentFrameIndex]
      frames[s.currentFrameIndex] = { ...frame, ballPosition: undefined }
      return { play: { ...s.play, keyframes: frames } }
    }),

  updateKeyframeDescription: (frameIndex, description) =>
    set((s) => {
      const frames = [...s.play.keyframes]
      frames[frameIndex] = { ...frames[frameIndex], description: description || undefined }
      return { play: { ...s.play, keyframes: frames } }
    }),

  saveToLibrary: () =>
    set((s) => {
      const snapshot = JSON.parse(JSON.stringify(s.play)) as Play
      const idx = s.library.findIndex((p) => p.id === snapshot.id)
      const library = idx >= 0
        ? s.library.map((p, i) => (i === idx ? snapshot : p))
        : [...s.library, snapshot]
      persistLibrary(library)
      return { library }
    }),

  removeFromLibrary: (playId) =>
    set((s) => {
      const library = s.library.filter((p) => p.id !== playId)
      persistLibrary(library)
      return { library }
    }),

  setMode: (mode) =>
    set(() => {
      if (mode === 'challenge') {
        return {
          mode,
          currentFrameIndex: 0,
          challengeUserPositions: FIVE_OUT.map((p) => ({ ...p })),
          challengeFrameIndex: 0,
          challengeFrameScores: [],
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
    set(() => ({
      challengeUserPositions: FIVE_OUT.map((p) => ({ ...p })),
      challengeFrameIndex: 0,
      challengeFrameScores: [],
    })),

  scoreChallenge: () => {
    const s = get()
    const target = s.play.keyframes[s.challengeFrameIndex].positions
      .filter((p) => p.playerId.startsWith('o'))
    const user = s.challengeUserPositions
    let totalError = 0
    for (const t of target) {
      const u = user.find((p) => p.playerId === t.playerId)
      if (!u) continue
      const dx = t.x - u.x
      const dy = t.y - u.y
      totalError += Math.sqrt(dx * dx + dy * dy)
    }
    const score = Math.max(0, Math.round(100 - (totalError / 705) * 100))
    return score
  },

  confirmChallengeFrame: () =>
    set((s) => {
      const target = s.play.keyframes[s.challengeFrameIndex].positions
        .filter((p) => p.playerId.startsWith('o'))
      const user = s.challengeUserPositions
      let totalError = 0
      for (const t of target) {
        const u = user.find((p) => p.playerId === t.playerId)
        if (!u) continue
        const dx = t.x - u.x
        const dy = t.y - u.y
        totalError += Math.sqrt(dx * dx + dy * dy)
      }
      const score = Math.max(0, Math.round(100 - (totalError / 705) * 100))
      const challengeFrameScores = [...s.challengeFrameScores, score]
      const nextFrameIndex = s.challengeFrameIndex + 1
      return {
        challengeFrameScores,
        challengeFrameIndex: nextFrameIndex,
        challengeUserPositions: FIVE_OUT.map((p) => ({ ...p })),
      }
    }),

  loadPlay: (play) =>
    set({ play: { ...play, id: makeId() }, currentFrameIndex: 0, mode: 'edit' }),

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
