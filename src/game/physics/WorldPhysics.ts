import * as CANNON from 'cannon-es';

export class WorldPhysics {
  private readonly world: CANNON.World

  constructor() {
    this.world = new CANNON.World()
  }

  addBody(body: CANNON.Body){
    this.world.addBody(body)
  }

  update() {
    this.world.step(1 / 60)
  }

  getWorld(){
    return this.world
  }

  init() {
    this.world.gravity.set(0, -9.82, 0)
  }
}
