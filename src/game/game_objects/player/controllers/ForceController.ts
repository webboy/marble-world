import type { MovementController } from 'src/game/types/game'
import type  { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import * as CANNON from 'cannon-es'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class ForceController implements MovementController {
  player: PlayerObject
  body: CANNON.Body

  constructor(player: PlayerObject) {
    this.player = player
    this.body = player.body
  }

  jump(jumpPower: number = 0): void {
    // Apply an upward force for jumping
    this.body.velocity.y = jumpPower
  }

  moveBackward(force: number = 1): void {
    // Apply force in the forward direction
    this.body.applyForce(new CANNON.Vec3(0, 0, force * this.body.mass), this.body.position);
  }

  moveForward(force: number = 1): void {
    // Apply force in the backward direction
    this.body.applyForce(new CANNON.Vec3(0, 0, -force * this.body.mass), this.body.position);
  }

  moveLeft(force: number = 1): void {
    // Apply force to move left
    this.body.applyForce(new CANNON.Vec3(-force * this.body.mass, 0, 0), this.body.position);
  }

  moveRight(force: number = 1): void {
    // Apply force to move right
    this.body.applyForce(new CANNON.Vec3(force * this.body.mass, 0, 0), this.body.position);
  }

  stop(): void {
    // Stop the player
    this.body.velocity.set(0, 0, 0)
    this.body.angularVelocity.set(0, 0, 0)
  }
}
