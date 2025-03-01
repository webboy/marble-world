import type { MovementController } from 'src/game/types/game'
import type { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import type CANNON from 'cannon-es'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class VelocityController implements MovementController{
  player: PlayerObject
  body: CANNON.Body

  constructor(player: PlayerObject) {
    this.player = player
    this.body = player.body
  }

  jump(jumpPower: number = 0): void {
    // Jump the player
    this.body.velocity.y = jumpPower
  }

  moveBackward(speed: number = 1): void {
    // Move the player backward
    if (this.body.velocity.z < GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.z += speed
    }
  }

  moveForward(speed: number = 1): void {
    // Move the player forward
    if (this.body.velocity.z > -GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.z -= speed
    }
  }

  moveLeft(speed: number = 1): void {
    // Move the player left
    if (this.body.velocity.x > -GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.x -= speed
    }
  }

  moveRight(speed: number = 1): void {
    // Move the player right
    if (this.body.velocity.x < GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.x += speed
    }
  }
  stop(): void {
    // Stop the player
    this.body.velocity.set(0, 0, 0)
    this.body.angularVelocity.set(0, 0, 0)
  }
}
