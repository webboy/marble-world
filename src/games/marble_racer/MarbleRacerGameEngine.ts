import type { GameWorld } from 'src/games/marble_racer/game_worlds/GameWorld'
import { GameWorldType } from 'src/games/marble_racer/types/game'
import { GrassWorld } from 'src/games/marble_racer/game_worlds/grass/GrassWorld'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { PlayerObject } from 'src/games/marble_racer/game_objects/player/PlayerObject'
import type { GoalObject } from 'src/games/marble_racer/game_objects/goal/GoalObject'
import type CANNON from 'cannon-es'

export class MarbleRacerGameEngine {
  protected game_world: GameWorld | null = null
  protected orbitControls: OrbitControls | null = null
  protected player: PlayerObject | null = null
  protected goal: GoalObject | null = null
  protected keysPressed: Record<string, boolean> = {}
  protected gameStarted: boolean = false
  protected maxTime: number = 0
  protected finalTime: number = 0
  protected score: number = 0
  protected timer: number = 0

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
    //this.orbitControls = new OrbitControls(camera, renderer.domElement)
    //this.orbitControls.enableDamping = true
    //this.orbitControls.update()

    // Add player and goal objects
    this.player = this.game_world?.addPlayer() ?? null
    this.goal = this.game_world?.addGoal() ?? null
  }

  start() {
    // Turn on timer
    this.gameStarted = true

    // Set max time
    this.maxTime = this.game_world?.getLevel()?.getMaxTime() ?? 0

    // Listeners
    window.addEventListener("keydown", (event) => {
      this.keysPressed[event.code] = true;
      this.handleMovement();
    });

    window.addEventListener("keyup", (event) => {
      this.keysPressed[event.code] = false;
    });

    // Setup collision listeners
    this.setupCollisionListeners()
  }

  setupCollisionListeners() {
    if (!this.player) return

    // Define collision handler
    const collisionHandler = (event: { body: CANNON.Body }) => {
      // Check if the player collided with the goal
      if (event.body.id === this.goal?.getBody().id && this.gameStarted) {
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
              maxTime: this.maxTime,
            }
          })
        document.dispatchEvent(event)
      }
      // Check if the player collided with the ground
      if (event.body.id === this.game_world?.getGround()?.getBody().id && this.gameStarted) {
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
              maxTime: this.maxTime
            }
          })
        document.dispatchEvent(event)
      }
    }

    // Add collision listener
    this.player.getBody().addEventListener('collide', collisionHandler)
  }

  handleMovement() {
    const speed = 1; // Adjust the speed value as needed

    if (this.keysPressed["KeyW"]) {
      this.player?.increaseVelocity(0, -speed); // Move forward
    }
    if (this.keysPressed["KeyS"]) {
      this.player?.increaseVelocity(0, speed); // Move backward
    }
    if (this.keysPressed["KeyA"]) {
      this.player?.increaseVelocity(-speed, 0); // Move left
    }
    if (this.keysPressed["KeyD"]) {
      this.player?.increaseVelocity(speed, 0); // Move right
    }
    if (this.keysPressed["KeyC"]) {
      this.player?.stop()
    }
    if (this.keysPressed["Space"]) {
      this.player?.jump(); // Jump
    }
  }

  updateCamera() {
    if (!this.player) return
    // Get player position
    const playerPosition = this.player.getBody().position
    // Get player velocity
    const playerVelocity = this.player.getBody().velocity

    // Increase camera Y position based on player velocity
    const cameraY =  Math.max(Math.abs(playerVelocity.x) * 0.5) + Math.max(Math.abs(playerVelocity.z) * 0.5)

    // Update camera position
    this.game_world?.updateCamera(
      [playerPosition.x, playerPosition.y + 15 + cameraY, playerPosition.z + 5],
      [playerPosition.x, playerPosition.y, playerPosition.z],
    )
  }

  loop() {

    // Update game world
    this.game_world?.update()

    // Update player
    this.player?.update()

    // Update goal
    this.goal?.update()

    // Update camera
    this.updateCamera()

    // Update orbit controls
    //this.orbitControls?.update()

    // Update timer
    if (this.gameStarted) {
      this.timer += 1
    }
  }
  onWindowResize() {
    if (this.game_world) {
      this.game_world.onWindowResize()
    }
  }

  // Update score
  updateScore():number {
    return this.score = Math.max(this.maxTime - this.timer, 0)
  }
}
