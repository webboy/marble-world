import { World3D } from 'src/game/world3d/World3D'
import { WorldPhysics } from 'src/game/world_physics/WorldPhysics'
import { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import { GroundObject } from 'src/game/game_objects/ground/GroundObject'
import type { TrackBlock } from 'src/game/game_objects/track_blocks/TrackBlock'
import type { TrackBlockPosition } from 'src/game/types/game';
import { TrackBlockOrientation } from 'src/game/types/game'
import { StraightTrackBlock } from 'src/game/game_objects/track_blocks/standard/StraightTrackBlock'

export class GameEngine {
  world3D: World3D
  worldPhysics: WorldPhysics
  player: PlayerObject | null = null
  trackBlocks: Map<TrackBlockPosition, TrackBlock> = new Map()

  constructor(canvas: HTMLCanvasElement) {
    this.worldPhysics = new WorldPhysics()
    this.world3D = new World3D(canvas, this.worldPhysics.getWorld())
  }
  start() {
    // Initiate the worlds
    this.world3D.init()
    this.worldPhysics.init()

    // Add the ground to the world
    const ground = new GroundObject()
    //this.world3D.addObject(ground.mesh)
    this.worldPhysics.addBody(ground.body, ground.id)

    // Add track blocks to the world
    for (let i = 0; i < 50; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(0, i, 0, TrackBlockOrientation.SOUTH)
      this.world3D.addObject(trackBlock.mesh)
      this.worldPhysics.addBody(trackBlock.body, trackBlock.id)
    }

    // Add the player to the world
    this.player = new PlayerObject()
    this.player.init()
    this.player.body.position.set(0, 20, 0)
    this.world3D.addObject(this.player.mesh)
    this.worldPhysics.addBody(this.player.body, this.player.id)
  }

  updateCamera() {
    if (!this.player) return
    // Set camera behind the player
    const playerPosition = this.player.body.position
    this.world3D.updateCamera(
      [playerPosition.x, 20, playerPosition.z + 15],
      [playerPosition.x, playerPosition.y, playerPosition.z],
    )
  }

  public loop() {
    //console.log('Player position:', this.player?.body.position)
    this.worldPhysics.update()
    this.world3D.update()
    this.player?.update()
    this.updateCamera()
  }
}
