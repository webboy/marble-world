import * as CANNON from 'cannon-es';

export class WorldPhysics {
  private readonly world: CANNON.World
  private bodies: Map<string, CANNON.Body> = new Map()

  constructor() {
    this.world = new CANNON.World()
    this.world.gravity.set(0, -9.82, 0)
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
    // Create physics material for ground
    const groundMaterial = new CANNON.Material('groundMaterial')

    // Create ground box shape
    //const groundShape = new CANNON.Box(new CANNON.Vec3(10, 1, 10))
    const groundShape = new CANNON.Plane()

    // Create ground body
    const groundBody = new CANNON.Body({
      mass: 0,
      material: groundMaterial,
      shape: groundShape
    })

    // Set ground rotation
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

    // Add ground to world
    this.addBody(groundBody, 'ground')
  }
}
