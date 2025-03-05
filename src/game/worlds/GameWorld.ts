import * as CANNON from 'cannon-es';

export class GameWorld {
  gravity: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)
  trackFriction: number = 0.5



  // Set gravity for the world
  setGravity(x: number, y: number, z: number) {
    this.gravity.set(x, y, z)
  }

  // Set track friction for the world
  setTrackFriction(friction: number) {
    this.trackFriction = friction
  }
}
