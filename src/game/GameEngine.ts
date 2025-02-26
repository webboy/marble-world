import { WorldD3 } from 'src/game/world3d/WorldD3'
import { WorldPhysics } from 'src/game/world_physics/WorldPhysics'
import { PlayerObject } from 'src/game/game_objects/player/PlayerObject'

export class GameEngine{
  world3D: WorldD3
  worldPhysics: WorldPhysics
  player: PlayerObject | null = null

  constructor(canvas: HTMLCanvasElement){

    this.worldPhysics = new WorldPhysics()
    this.world3D = new WorldD3(canvas, this.worldPhysics.getWorld())
  }
  start() {
    // Initiate the worlds
    this.world3D.init();
    this.worldPhysics.init();

    // Add the player to the world
    this.player = new PlayerObject();
    this.player.init()
    this.player.body.position.set(0, 2, 0);
    this.world3D.addObject(this.player.mesh);
    this.worldPhysics.addBody(this.player.body, this.player.id);
  }

  updateCamera(){
    if (!this.player) return
    // Set camera behind the player
    const playerPosition = this.player.body.position
    this.world3D.camera.position.set(playerPosition.x, playerPosition.y + 2, playerPosition.z + 5)
    this.world3D.camera.lookAt(playerPosition.x, playerPosition.y, playerPosition.z)
  }

  public loop() {
    this.worldPhysics.update();
    this.world3D.update();
    this.player?.update()
    this.updateCamera()
  }
}
