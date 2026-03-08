import { Play } from '@/types/play'

const PICK_AND_ROLL: Play = {
  id: 'demo-pnr',
  name: 'Pick & Roll',
  keyframes: [
    {
      id: 'pnr-1',
      positions: [
        { playerId: 'o1', x: 50, y: 72 },
        { playerId: 'o2', x: 15, y: 58 },
        { playerId: 'o3', x: 85, y: 58 },
        { playerId: 'o4', x: 15, y: 36 },
        { playerId: 'o5', x: 78, y: 36 },
        { playerId: 'd1', x: 50, y: 65 },
        { playerId: 'd2', x: 15, y: 52 },
        { playerId: 'd3', x: 85, y: 52 },
        { playerId: 'd4', x: 20, y: 30 },
        { playerId: 'd5', x: 74, y: 30 },
      ],
    },
    {
      id: 'pnr-2',
      positions: [
        // 5 sube a poner el screen para 1
        { playerId: 'o1', x: 50, y: 72 },
        { playerId: 'o2', x: 10, y: 55 },
        { playerId: 'o3', x: 90, y: 55 },
        { playerId: 'o4', x: 15, y: 36 },
        { playerId: 'o5', x: 55, y: 62 }, // 5 sube al screen
        { playerId: 'd1', x: 50, y: 66 },
        { playerId: 'd2', x: 10, y: 50 },
        { playerId: 'd3', x: 90, y: 50 },
        { playerId: 'd4', x: 20, y: 30 },
        { playerId: 'd5', x: 60, y: 56 }, // d5 sigue a 5
      ],
    },
    {
      id: 'pnr-3',
      positions: [
        // 1 usa el screen, 5 empieza el roll
        { playerId: 'o1', x: 38, y: 62 }, // sale por izquierda
        { playerId: 'o2', x: 10, y: 48 },
        { playerId: 'o3', x: 90, y: 48 },
        { playerId: 'o4', x: 15, y: 36 },
        { playerId: 'o5', x: 50, y: 48 }, // empieza el roll
        { playerId: 'd1', x: 42, y: 58 }, // persigue a 1
        { playerId: 'd2', x: 10, y: 44 },
        { playerId: 'd3', x: 90, y: 44 },
        { playerId: 'd4', x: 20, y: 30 },
        { playerId: 'd5', x: 52, y: 40 }, // hedging
      ],
    },
    {
      id: 'pnr-4',
      positions: [
        // 1 con balón en el codo, 5 llegó al aro
        { playerId: 'o1', x: 30, y: 52 },
        { playerId: 'o2', x: 10, y: 42 },
        { playerId: 'o3', x: 90, y: 42 },
        { playerId: 'o4', x: 15, y: 36 },
        { playerId: 'o5', x: 48, y: 20 }, // llegó al aro
        { playerId: 'd1', x: 34, y: 48 },
        { playerId: 'd2', x: 10, y: 38 },
        { playerId: 'd3', x: 90, y: 38 },
        { playerId: 'd4', x: 20, y: 30 },
        { playerId: 'd5', x: 50, y: 32 }, // ayudando bajo
      ],
    },
  ],
}

const DRIVE_AND_KICK: Play = {
  id: 'demo-dk',
  name: 'Drive & Kick',
  keyframes: [
    {
      id: 'dk-1',
      positions: [
        { playerId: 'o1', x: 50, y: 72 },
        { playerId: 'o2', x: 15, y: 55 },
        { playerId: 'o3', x: 85, y: 55 },
        { playerId: 'o4', x: 12, y: 36 },
        { playerId: 'o5', x: 50, y: 28 }, // 5 en el poste alto
        { playerId: 'd1', x: 50, y: 65 },
        { playerId: 'd2', x: 15, y: 50 },
        { playerId: 'd3', x: 85, y: 50 },
        { playerId: 'd4', x: 15, y: 30 },
        { playerId: 'd5', x: 48, y: 22 },
      ],
    },
    {
      id: 'dk-2',
      positions: [
        // 1 penetra hacia la derecha
        { playerId: 'o1', x: 62, y: 62 },
        { playerId: 'o2', x: 10, y: 46 }, // abre corner izq
        { playerId: 'o3', x: 90, y: 46 }, // sale del corner
        { playerId: 'o4', x: 10, y: 28 }, // corner izq profundo
        { playerId: 'o5', x: 50, y: 26 },
        { playerId: 'd1', x: 60, y: 58 },
        { playerId: 'd2', x: 10, y: 42 },
        { playerId: 'd3', x: 80, y: 42 }, // cierra
        { playerId: 'd4', x: 15, y: 26 },
        { playerId: 'd5', x: 52, y: 20 },
      ],
    },
    {
      id: 'dk-3',
      positions: [
        // 1 penetra fondo, 3 abierto en ala
        { playerId: 'o1', x: 72, y: 50 },
        { playerId: 'o2', x: 8, y: 40 },
        { playerId: 'o3', x: 92, y: 40 }, // abierto!
        { playerId: 'o4', x: 8, y: 26 },
        { playerId: 'o5', x: 50, y: 24 },
        { playerId: 'd1', x: 65, y: 46 },
        { playerId: 'd2', x: 10, y: 36 },
        { playerId: 'd3', x: 86, y: 36 }, // corriendo a cerrar
        { playerId: 'd4', x: 15, y: 22 },
        { playerId: 'd5', x: 52, y: 18 },
      ],
    },
    {
      id: 'dk-4',
      positions: [
        // Kick out a 3, tiro abierto
        { playerId: 'o1', x: 65, y: 44 },
        { playerId: 'o2', x: 8, y: 36 },
        { playerId: 'o3', x: 94, y: 36 }, // recibe y tira
        { playerId: 'o4', x: 8, y: 22 },
        { playerId: 'o5', x: 52, y: 20 }, // ataca rebote
        { playerId: 'd1', x: 60, y: 40 },
        { playerId: 'd2', x: 10, y: 32 },
        { playerId: 'd3', x: 90, y: 30 }, // llega tarde
        { playerId: 'd4', x: 15, y: 20 },
        { playerId: 'd5', x: 55, y: 16 },
      ],
    },
  ],
}

const FAST_BREAK: Play = {
  id: 'demo-fb',
  name: 'Contraataque 3×2',
  keyframes: [
    {
      id: 'fb-1',
      positions: [
        // 3 ofensivos corren contra 2 defensivos
        { playerId: 'o1', x: 50, y: 70 },
        { playerId: 'o2', x: 20, y: 62 },
        { playerId: 'o3', x: 80, y: 62 },
        { playerId: 'o4', x: 32, y: 80 }, // trailing
        { playerId: 'o5', x: 68, y: 80 }, // trailing
        { playerId: 'd1', x: 50, y: 82 }, // atrás
        { playerId: 'd2', x: 28, y: 75 }, // atrás
        { playerId: 'd3', x: 72, y: 75 }, // atrás
        { playerId: 'd4', x: 36, y: 42 }, // en posición
        { playerId: 'd5', x: 64, y: 42 }, // en posición
      ],
    },
    {
      id: 'fb-2',
      positions: [
        // 1 conduce, 2 y 3 abren carriles
        { playerId: 'o1', x: 50, y: 56 },
        { playerId: 'o2', x: 12, y: 48 },
        { playerId: 'o3', x: 88, y: 48 },
        { playerId: 'o4', x: 32, y: 66 },
        { playerId: 'o5', x: 68, y: 66 },
        { playerId: 'd1', x: 50, y: 70 },
        { playerId: 'd2', x: 28, y: 62 },
        { playerId: 'd3', x: 72, y: 62 },
        { playerId: 'd4', x: 40, y: 38 }, // colapsa al centro
        { playerId: 'd5', x: 60, y: 38 },
      ],
    },
    {
      id: 'fb-3',
      positions: [
        // 1 pasa a 3, d5 va a cerrar
        { playerId: 'o1', x: 44, y: 46 },
        { playerId: 'o2', x: 10, y: 36 },
        { playerId: 'o3', x: 88, y: 36 }, // recibe el pase
        { playerId: 'o4', x: 32, y: 55 },
        { playerId: 'o5', x: 56, y: 28 }, // ataca el aro
        { playerId: 'd1', x: 50, y: 56 },
        { playerId: 'd2', x: 25, y: 50 },
        { playerId: 'd3', x: 75, y: 50 },
        { playerId: 'd4', x: 44, y: 30 }, // ayuda al centro
        { playerId: 'd5', x: 82, y: 30 }, // cierra sobre 3
      ],
    },
    {
      id: 'fb-4',
      positions: [
        // 3 pasa al 5 solo debajo del aro
        { playerId: 'o1', x: 42, y: 40 },
        { playerId: 'o2', x: 8, y: 30 },
        { playerId: 'o3', x: 86, y: 30 },
        { playerId: 'o4', x: 32, y: 48 },
        { playerId: 'o5', x: 50, y: 16 }, // solo al aro!
        { playerId: 'd1', x: 48, y: 48 },
        { playerId: 'd2', x: 22, y: 42 },
        { playerId: 'd3', x: 74, y: 42 },
        { playerId: 'd4', x: 48, y: 26 },
        { playerId: 'd5', x: 80, y: 24 }, // llega tarde
      ],
    },
  ],
}

const ZONE_ATTACK: Play = {
  id: 'demo-zone',
  name: 'Ataque Zona 2-3',
  keyframes: [
    {
      id: 'zone-1',
      positions: [
        { playerId: 'o1', x: 50, y: 72 },
        { playerId: 'o2', x: 22, y: 60 },
        { playerId: 'o3', x: 78, y: 60 },
        { playerId: 'o4', x: 18, y: 38 },
        { playerId: 'o5', x: 50, y: 32 }, // flash al poste
        // Zona 2-3
        { playerId: 'd1', x: 36, y: 46 },
        { playerId: 'd2', x: 64, y: 46 },
        { playerId: 'd3', x: 20, y: 28 },
        { playerId: 'd4', x: 50, y: 24 },
        { playerId: 'd5', x: 80, y: 28 },
      ],
    },
    {
      id: 'zone-2',
      positions: [
        // Pase a 2 en ala izq, zona se mueve
        { playerId: 'o1', x: 50, y: 70 },
        { playerId: 'o2', x: 18, y: 58 }, // recibe
        { playerId: 'o3', x: 82, y: 56 },
        { playerId: 'o4', x: 12, y: 36 }, // corner izq
        { playerId: 'o5', x: 50, y: 30 },
        { playerId: 'd1', x: 24, y: 46 }, // zona se mueve izq
        { playerId: 'd2', x: 58, y: 44 },
        { playerId: 'd3', x: 15, y: 28 }, // cierra a 4
        { playerId: 'd4', x: 50, y: 24 },
        { playerId: 'd5', x: 82, y: 28 },
      ],
    },
    {
      id: 'zone-3',
      positions: [
        // Swing rápido a 3 en ala derecha, zona desbalanceada
        { playerId: 'o1', x: 50, y: 68 },
        { playerId: 'o2', x: 18, y: 56 },
        { playerId: 'o3', x: 85, y: 54 }, // recibe swing
        { playerId: 'o4', x: 12, y: 34 },
        { playerId: 'o5', x: 50, y: 28 },
        { playerId: 'd1', x: 34, y: 46 }, // zona desbalanceada
        { playerId: 'd2', x: 68, y: 44 }, // tarda en cerrar
        { playerId: 'd3', x: 18, y: 28 },
        { playerId: 'd4', x: 50, y: 24 },
        { playerId: 'd5', x: 80, y: 26 }, // cierra a 3
      ],
    },
    {
      id: 'zone-4',
      positions: [
        // 5 recibe pase en el boquete de la zona
        { playerId: 'o1', x: 50, y: 66 },
        { playerId: 'o2', x: 15, y: 52 },
        { playerId: 'o3', x: 85, y: 52 },
        { playerId: 'o4', x: 10, y: 30 },
        { playerId: 'o5', x: 50, y: 22 }, // en el boquete!
        { playerId: 'd1', x: 30, y: 44 },
        { playerId: 'd2', x: 70, y: 44 },
        { playerId: 'd3', x: 18, y: 26 }, // no puede llegar a 5
        { playerId: 'd4', x: 50, y: 26 }, // colapsando tarde
        { playerId: 'd5', x: 82, y: 26 },
      ],
    },
  ],
}

export const DEMO_PLAYS: Play[] = [
  PICK_AND_ROLL,
  DRIVE_AND_KICK,
  FAST_BREAK,
  ZONE_ATTACK,
]
