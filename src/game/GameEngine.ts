import type * as CANNON from 'cannon-es'
import { World3D } from 'src/game/3d/World3D'
import { WorldPhysics } from 'src/game/physics/WorldPhysics'
import { PlayerObject } from 'src/game/game_objects/player/PlayerObject'
import { GroundObject } from 'src/game/game_objects/ground/GroundObject'
import type { TrackBlock } from 'src/game/game_objects/track_blocks/TrackBlock'
import type { TrackBlockPosition } from 'src/game/types/game';
import { TrackBlockOrientation } from 'src/game/types/game'
import { StraightTrackBlock } from 'src/game/game_objects/track_blocks/standard/StraightTrackBlock'
import { TurnLeftTrackBlock } from 'src/game/game_objects/track_blocks/standard/TurnLeftTrackBlock'
import { TurnRightTrackBlock } from 'src/game/game_objects/track_blocks/standard/TurnRightTrackBlock'
import type { GameObject } from 'src/game/game_objects/GameObject'
import { GoalObject } from 'src/game/game_objects/goal/GoalObject'
import { GAME_CONFIG } from 'src/game/configuration/config'
import { StartTrackBlock } from 'src/game/game_objects/track_blocks/standard/StartTrackBlock'
import { GoalTrackBlock } from 'src/game/game_objects/track_blocks/standard/GoalTrackBlock'

export class GameEngine {
  world3D: World3D
  worldPhysics: WorldPhysics
  player: PlayerObject | null = null
  playerID: number | null = null
  goal: GoalObject | null = null
  goalID: number | null = null
  groundID: number | null = null
  trackBlocks: Map<TrackBlockPosition, TrackBlock> = new Map()
  gameObjects: Map<string, GameObject> = new Map()
  private timer: number = 0
  private gameStarted: boolean = false
  private finalTime: number = 0
  private maxTime: number = 0
  private score: number = 0
  private trackZLevel: number = 1
  // Initial player position for reset
  private initialPlayerPosition = { x: 0, y: 10, z: 0 }
  // Initial goal position for reset
  private initialGoalPosition = { x: 0, y: 10, z: 0 }

  constructor(canvas: HTMLCanvasElement) {
    this.worldPhysics = new WorldPhysics()
    this.world3D = new World3D(canvas, this.worldPhysics.getWorld())
  }

  init() {
    // Initiate the worlds
    this.world3D.init()
    this.worldPhysics.init()

    // Add the ground to the world
    const ground = new GroundObject()
    this.world3D.addObject(ground.mesh)
    this.worldPhysics.addBody(ground.body, ground.id)
    this.groundID = ground.body.id

    // Draw the track
    this.drawTracks()

    // Add the player to the world
    this.player = new PlayerObject(GAME_CONFIG.player.radius, this.worldPhysics.getWorld())
    this.addGameObject(this.player)
    this.playerID = this.player.body.id

    // Get position of the first track block
    const firstTrackBlock = this.trackBlocks.get(
      this.trackBlocks.keys().next().value
    )

    // Set player position to the first track block
    if (firstTrackBlock) {
      this.initialPlayerPosition = firstTrackBlock.body.position
      this.player.body.position.set(this.initialPlayerPosition.x, this.initialPlayerPosition.y + 2, this.initialPlayerPosition.z)
    } else {
      console.error('Failed to set player position to the first track block')
      this.player.body.position.set(0, 10, 0)
    }

    // Add Goal object to the world
    this.goal = new GoalObject()
    this.addGameObject(this.goal)
    this.goalID = this.goal.body.id

    // Get the last track block
    const keys = Array.from(this.trackBlocks.keys());
    const lastKey = keys.length > 0 ? keys[keys.length - 1] : undefined;
    const lastTrackBlock = lastKey !== undefined ? this.trackBlocks.get(lastKey) : undefined;
    if (lastTrackBlock) {
      this.initialGoalPosition = lastTrackBlock.body.position
      this.goal.body.position.set(this.initialGoalPosition.x, this.initialGoalPosition.y + 3, this.initialGoalPosition.z)
    } else {
      console.error('Failed to set goal position to the last track block')
      this.goal.body.position.set(0, 10, 0)
    }
  }

  async start() {
    // Start the player
    if (!this.player) return
    await this.player.start()
    this.gameStarted = true

    // Listen for player collision
    this.setupCollisionListeners()
  }

  setupCollisionListeners() {
    if (!this.player) return

    // Define collision handler
    const collisionHandler = (event: { body: CANNON.Body }) => {
      // Check if the player collided with the goal
      if (event.body.id === this.goalID && this.isStarted()) {
        this.finalTime = this.timer
        this.gameStarted = false
        // Update score
        this.updateScore()
        // Dispatch event
        const event = new CustomEvent(
          'game-finished',
          {
            detail: {
              status: 'success',
              finalTime: this.finalTime,
              score: this.score,
            }
          })
        document.dispatchEvent(event)
      }
      // Check if the player collided with the ground
      if (event.body.id === this.groundID && this.isStarted()) {
        this.finalTime = this.timer
        this.gameStarted = false
        // Update score
        this.updateScore()
        // Dispatch event
        const event = new CustomEvent(
          'game-finished',
          {
            detail: {
              status: 'failure',
              finalTime: this.finalTime,
              score: 0,
            }
          })
        document.dispatchEvent(event)
      }
    }

    // Add collision listener
    this.player.body.addEventListener('collide', collisionHandler)
  }

  // Restart the game
  restart() {
    console.log('Restarting game...')

    // Reset timer and score
    this.timer = 0
    this.finalTime = 0
    this.score = 0
    this.gameStarted = false

    // Reset player position and velocity
    if (this.player) {
      this.player.body.position.set(
        this.initialPlayerPosition.x,
        this.initialPlayerPosition.y + 2,
        this.initialPlayerPosition.z
      )
      this.player.body.velocity.set(0, 0, 0)
      this.player.body.angularVelocity.set(0, 0, 0)
    }

    // Reset goal position
    if (this.goal) {
      this.goal.body.velocity.set(0, 0, 0)
      this.goal.body.angularVelocity.set(0, 0, 0)
      this.goal.body.position.set(
        this.initialGoalPosition.x,
        this.initialGoalPosition.y + 3,
        this.initialGoalPosition.z
      )
    }

    console.log('Game reset complete')
  }

  drawTracks() {
    // Add start track block
    this.addTrackBlock(new StartTrackBlock(-1, 1, this.trackZLevel, TrackBlockOrientation.NORTH))

    // Add first corner
    this.addTrackBlock(new TurnRightTrackBlock(-1, 0, this.trackZLevel, TrackBlockOrientation.NORTH))

    // Add track blocks to the world
    for (let i = 0; i < 3; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, 0, this.trackZLevel, TrackBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }
    let cornerBlock
    cornerBlock = new TurnLeftTrackBlock(3, 0, this.trackZLevel, TrackBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = 1; i < 5; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(3, -i, this.trackZLevel, TrackBlockOrientation.NORTH)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(3, -5, this.trackZLevel, TrackBlockOrientation.NORTH)
    this.addTrackBlock(cornerBlock)

    for (let i = 4; i < 6; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, -5, this.trackZLevel, TrackBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(6, -5, this.trackZLevel, TrackBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = -4; i < -1; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(6, i, this.trackZLevel, TrackBlockOrientation.SOUTH)
      this.addTrackBlock(trackBlock)
    }

    // Add goal track block
    this.addTrackBlock(new GoalTrackBlock(6, 1, this.trackZLevel, TrackBlockOrientation.SOUTH))
  }

  // Add game object to the world
  addGameObject(gameObject: GameObject) {
    this.gameObjects.set(gameObject.id, gameObject)
    this.world3D.addObject(gameObject.mesh)
    this.worldPhysics.addBody(gameObject.body, gameObject.id)
  }

  // Add track block to the world
  addTrackBlock(trackBlock: TrackBlock) {
    // Add track block to the world
    this.trackBlocks.set({ x: trackBlock.block_x, y: trackBlock.block_y, z: trackBlock.block_z }, trackBlock)

    // Add game object to the world
    this.addGameObject(trackBlock)

    // Add time value to the max time
    this.maxTime += trackBlock.timeValue
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
    this.goal?.update()
    this.updateCamera()

    // Update timer
    if (this.gameStarted)
    {
      this.timer += 1
    }
  }

  // Check if the game is started
  isStarted() {
    return this.gameStarted
  }

  // Get the final time
  getFinalTime() {
    return (this.finalTime / 60).toFixed(2)
  }

  // Get current time
  getCurrentTime() {
    return this.timer
  }

  // Update score
  updateScore():number {
    return this.score = Math.max(this.maxTime - this.timer, 0)
  }

}
