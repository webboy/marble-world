import type { GameObject } from 'src/games/marble_racer/game_objects/GameObject'

export enum GameWorldType {
  GRASS = 'grass',
  DESERT = 'desert',
  FROZEN = 'frozen',
  MOON = 'moon',
  LAVA = 'lava'
}

export interface GameWorldBlockPosition {
  x: number
  y: number
  z: number
}

export enum LevelBlockType {
  TRACK = 'track',
  DECORATION = 'decoration',
}

export enum LevelBlockOrientation {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west'
}
