import * as CANNON from 'cannon-es';

export class WorldPhysics {
  private readonly world: CANNON.World
  private bodies: Map<string, CANNON.Body> = new Map()

  constructor() {
    this.world = new CANNON.World()
  }

  addBody(body: CANNON.Body, name: string){
    this.world.addBody(body)
    this.bodies.set(name, body)
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
