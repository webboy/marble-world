import type { MovementController } from 'src/game/types/game'
import type  { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import * as CANNON from 'cannon-es'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class TorqueController implements MovementController {
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

  moveForward(torque: number = 10): void {
    // Apply torque to tilt forward (pitch)
    const worldTorque = new CANNON.Vec3(-torque * this.body.mass, 0, 0);
    this.body.applyTorque(worldTorque);
  }

  moveBackward(torque: number = 10): void {
    // Apply torque to tilt backward (pitch)
    const worldTorque = new CANNON.Vec3(torque * this.body.mass, 0, 0);
    this.body.applyTorque(worldTorque);
  }

  moveLeft(torque: number = 10): void {
    // Apply torque to rotate left (yaw)
    const worldTorque = new CANNON.Vec3(0, 0, torque * this.body.mass);
    this.body.applyTorque(worldTorque);
  }

  moveRight(torque: number = 10): void {
    // Apply torque to rotate right (yaw)
    const worldTorque = new CANNON.Vec3(0, 0, -torque * this.body.mass);
    this.body.applyTorque(worldTorque);
  }

  stop(): void {
    // Stop the player
    this.body.velocity.set(0, 0, 0)
    this.body.angularVelocity.set(0, 0, 0)
  }
}
