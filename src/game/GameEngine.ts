import type * as CANNON from 'cannon-es'
import { World3D } from 'src/game/world3d/World3D'
import { WorldPhysics } from 'src/game/world_physics/WorldPhysics'
import { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import { GroundObject } from 'src/game/game_objects/ground/GroundObject'
import type { TrackBlock } from 'src/game/game_objects/track_blocks/TrackBlock'
import type { TrackBlockPosition } from 'src/game/types/game';
import { TrackBlockOrientation } from 'src/game/types/game'
import { StraightTrackBlock } from 'src/game/game_objects/track_blocks/standard/StraightTrackBlock'
import { TurnLeftTrackBlock } from 'src/game/game_objects/track_blocks/standard/TurnLeftTrackBlock'
import { TurnRightTrackBlock } from 'src/game/game_objects/track_blocks/standard/TurnRightTrackBlock'
import type { GameObject } from 'src/game/game_objects/GameObject'

export class GameEngine {
  world3D: World3D
  worldPhysics: WorldPhysics
  player: PlayerObject | null = null
  trackBlocks: Map<TrackBlockPosition, TrackBlock> = new Map()
  gameObjects: Map<string, GameObject> = new Map()

  constructor(canvas: HTMLCanvasElement) {
    this.worldPhysics = new WorldPhysics()
    this.world3D = new World3D(canvas, this.worldPhysics.getWorld())
  }
  async start() {
    // Initiate the worlds
    this.world3D.init()
    this.worldPhysics.init()

    // Add the ground to the world
    const ground = new GroundObject()
    this.world3D.addObject(ground.mesh)
    this.worldPhysics.addBody(ground.body, ground.id)

    // Add track blocks to the world
    for (let i = 0; i < 3; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, 0, 1, TrackBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }
    let cornerBlock
    cornerBlock = new TurnLeftTrackBlock(3, 0, 1, TrackBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = 1; i < 5; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(3, -i, 1, TrackBlockOrientation.NORTH)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(3, -5, 1, TrackBlockOrientation.NORTH)
    this.addTrackBlock(cornerBlock)

    for (let i = 4; i < 6; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, -5, 1, TrackBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(6, -5, 1, TrackBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = -4; i < 1; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(6, i, 1, TrackBlockOrientation.SOUTH)
      this.addTrackBlock(trackBlock)
    }

    // Add the player to the world
    this.player = new PlayerObject(1, this.worldPhysics.getWorld())
    await this.player.init()
    // Get position of the first track block
    const trackBlock = this.trackBlocks.get(
      this.trackBlocks.keys().next().value
    )

    // Set player position to the first track block
    if (trackBlock) {
      //console.log('Track block position:', trackBlock.body.position)
      const trackBlockPosition = trackBlock.body.position
      this.player.body.position.set(trackBlockPosition.x, trackBlockPosition.y + 10, trackBlockPosition.z)
    } else {
      console.error('Failed to set player position to the first track block')
      this.player.body.position.set(0, 10, 0)
    }
    this.addGameObject(this.player)

    // Listen for player collision
    this.player.body.addEventListener('collide', (event: { body: CANNON.Body }) => {
      //console.log('Player collided with', event.body)
    })
  }

  // Add game object to the world
  addGameObject(gameObject: GameObject) {
    this.gameObjects.set(gameObject.id, gameObject)
    this.world3D.addObject(gameObject.mesh)
    this.worldPhysics.addBody(gameObject.body, gameObject.id)
  }

  // Add track block to the world
  addTrackBlock(trackBlock: TrackBlock) {
    this.trackBlocks.set({ x: trackBlock.block_x, y: trackBlock.block_y, z: trackBlock.block_z }, trackBlock)
    this.addGameObject(trackBlock)
  }

  updateCamera() {
    if (!this.player) return
    // Set camera behind the player
    const playerPosition = this.player.body.position
    //const playerVelocity = this.player.body.velocity
    this.world3D.updateCamera(
      [playerPosition.x, playerPosition.y + 29, playerPosition.z + 3],
      [playerPosition.x, playerPosition.y, playerPosition.z],
    )
  }

  public loop() {
    this.worldPhysics.update()
    this.world3D.update()
    this.player?.update()
    this.updateCamera()
  }
}
