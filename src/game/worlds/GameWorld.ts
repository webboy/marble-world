import * as CANNON from 'cannon-es';
import type * as THREE from 'three';
import { GameWorldType } from 'src/game/types/game'

export class GameWorld {
  protected type: GameWorldType = GameWorldType.GRASS
  protected gravity: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)
  protected trackFriction: number = 0.5
  protected ambientLights: Map<string,THREE.AmbientLight> = new Map()
  protected directionalLights: Map<string,THREE.DirectionalLight> = new Map()

  getGravity() {
    return this.gravity
  }

  getTrackFriction() {
    return this.trackFriction
  }
}
