import type { PlayerObject } from 'src/game/game_objects/player/PlayerObject'

export interface TrackBlockPosition {
    x: number
    y: number
    z: number
}

export enum TrackBlockOrientation {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west'
}

export interface MovementController {
    player: PlayerObject
    moveForward(speed?: number): void
    moveBackward(speed?: number): void
    moveLeft(speed?: number): void
    moveRight(speed?: number): void
    jump(jumpPower?: number): void
    stop(): void
}
