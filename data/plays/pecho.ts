import { Play } from '@/types/play'

// Coordenadas: x 0=izquierda 100=derecha, y 0=aro 100=mediocampo
// Defensores se ubican fuera del rango visible (y≈98) ya que el PECHO
// es un sistema ofensivo sin defensores definidos.

export const pecho: Play = {
  id: 'pecho',
  name: 'Pecho',
  description:
    'Sistema de juego continuo. El 1 dribla hacia el 5, intercambian posición (T), y la pelota circula hasta generar la misma situación del lado opuesto.',
  keyframes: [
    {
      // Inicio: 1 con pelota en centro, 5 en T derecha, 2 top-right, 3 wing-izq, 4 top-left
      id: 'pecho-f0',
      positions: [
        { playerId: 'o1', x: 50, y: 75 },
        { playerId: 'o2', x: 82, y: 22 },
        { playerId: 'o3', x: 18, y: 50 },
        { playerId: 'o4', x: 18, y: 22 },
        { playerId: 'o5', x: 68, y: 38 },
        { playerId: 'd1', x: 10, y: 98 },
        { playerId: 'd2', x: 30, y: 98 },
        { playerId: 'd3', x: 50, y: 98 },
        { playerId: 'd4', x: 70, y: 98 },
        { playerId: 'd5', x: 90, y: 98 },
      ],
    },
    {
      // 1 llega a la T, intercambia con 5. 5 se abre al perímetro derecho. 3 y 4 rotan.
      id: 'pecho-f1',
      positions: [
        { playerId: 'o1', x: 68, y: 38 },
        { playerId: 'o2', x: 82, y: 40 },
        { playerId: 'o3', x: 22, y: 52 },
        { playerId: 'o4', x: 18, y: 25 },
        { playerId: 'o5', x: 85, y: 22 },
        { playerId: 'd1', x: 10, y: 98 },
        { playerId: 'd2', x: 30, y: 98 },
        { playerId: 'd3', x: 50, y: 98 },
        { playerId: 'd4', x: 70, y: 98 },
        { playerId: 'd5', x: 90, y: 98 },
      ],
    },
    {
      // 2 pasa a 3, 3 pasa a 4. 1 se coloca al lado opuesto. 5 rota a top-left.
      id: 'pecho-f2',
      positions: [
        { playerId: 'o1', x: 25, y: 65 },
        { playerId: 'o2', x: 80, y: 42 },
        { playerId: 'o3', x: 50, y: 68 },
        { playerId: 'o4', x: 22, y: 50 },
        { playerId: 'o5', x: 18, y: 22 },
        { playerId: 'd1', x: 10, y: 98 },
        { playerId: 'd2', x: 30, y: 98 },
        { playerId: 'd3', x: 50, y: 98 },
        { playerId: 'd4', x: 70, y: 98 },
        { playerId: 'd5', x: 90, y: 98 },
      ],
    },
    {
      // 4 pasa a 5 (T izquierda). 4 intercambia posición con 1. 1 se abre al perímetro. 2 y 3 rotan.
      id: 'pecho-f3',
      positions: [
        { playerId: 'o1', x: 32, y: 35 },
        { playerId: 'o2', x: 75, y: 55 },
        { playerId: 'o3', x: 52, y: 68 },
        { playerId: 'o4', x: 30, y: 50 },
        { playerId: 'o5', x: 18, y: 40 },
        { playerId: 'd1', x: 10, y: 98 },
        { playerId: 'd2', x: 30, y: 98 },
        { playerId: 'd3', x: 50, y: 98 },
        { playerId: 'd4', x: 70, y: 98 },
        { playerId: 'd5', x: 90, y: 98 },
      ],
    },
  ],
}
