import type { GameWorld } from 'src/games/marble_racer/game_worlds/GameWorld'
import { GameWorldType } from 'src/games/marble_racer/types/game'
import { GrassWorld } from 'src/games/marble_racer/game_worlds/grass/GrassWorld'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export class MarbleRacerGameEngine {
  protected game_world: GameWorld | null = null
  protected orbitControls: OrbitControls | null = null

  init(canvas: HTMLCanvasElement, world_type: GameWorldType, level_name: string = 'A-1') {
    switch (world_type) {
      case GameWorldType.GRASS:
        this.game_world = new GrassWorld(canvas)
        break
      case GameWorldType.FROZEN:
        // this.game_world = new SnowWorld(canvas)
        break
      case GameWorldType.DESERT:
        // this.game_world = new SandWorld(canvas)
        break
      default:
        throw new Error('Invalid world type')
    }

    if (this.game_world) {
      this.game_world.init()
      this.game_world.generateLevel(level_name)
    }

    // Set up orbit controls
    const camera = this.game_world?.getCamera()
    const renderer = this.game_world?.getRenderer()
    if (!camera || !renderer) {
      throw new Error('Camera or renderer not found')
    }
    this.orbitControls = new OrbitControls(camera, renderer.domElement)
    this.orbitControls.enableDamping = true
    this.orbitControls.update()
  }

  loop() {

    // Update game world
    this.game_world?.update()

    // Update orbit controls
    this.orbitControls?.update()
  }
  onWindowResize() {
    if (this.game_world) {
      this.game_world.onWindowResize()
    }
  }
}
