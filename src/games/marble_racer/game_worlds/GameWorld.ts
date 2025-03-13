import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'
import { GameWorldType } from 'src/games/marble_racer/types/game'
import type { GameObject } from 'src/games/marble_racer/game_objects/GameObject'
import { GameLevel } from 'src/games/marble_racer/game_worlds/GameLevel'
import { PlayerObject } from 'src/games/marble_racer/game_objects/player/PlayerObject'
import { GoalObject } from 'src/games/marble_racer/game_objects/goal/GoalObject'
import { GAME_CONFIG } from 'src/games/marble_racer/configuration/config'
import type { GroundObject } from 'src/games/marble_racer/game_objects/ground/GroundObject'


export class GameWorld {
  protected type: GameWorldType = GameWorldType.GRASS
  protected scene: THREE.Scene = new THREE.Scene()
  protected camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  protected renderer: THREE.WebGLRenderer | null = null
  protected ambientLights: Map<string, THREE.AmbientLight> = new Map()
  protected directionalLights: Map<string, THREE.DirectionalLight> = new Map()
  protected ground: GameObject | null = null
  protected physicsWorld: CANNON.World = new CANNON.World()
  private cannonDebug: { update: () => void, scene: THREE.Scene } | null = null // Reference to cannon debugger
  protected gravity: CANNON.Vec3 = new CANNON.Vec3(0, 0, 0)
  protected level: GameLevel | null = null

  constructor(canvas: HTMLCanvasElement) {
    // Set up renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    })

    // Set renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    // Set shadow properties
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  init() {

    // Loop through ambient lights and add them to the scene
    this.ambientLights.forEach((light) => {
      this.scene.add(light)
    })

    // Loop through directional lights and add them to the scene
    this.directionalLights.forEach((light) => {
      this.scene.add(light)
    })

    // Add ground object if it exists
    if (this.ground) {
      this.addObject(this.ground)
    }

    // Attach debugger to Three.js scene and Cannon world
    this.cannonDebug = cannonDebugger(this.scene, this.physicsWorld, {
      color: 0xff0000, // Red wireframe for physics
      scale: 1 // Scale of wireframe
    }) as { update: () => void; scene: THREE.Scene };

    // Add axis helper
    const axesHelper = new THREE.AxesHelper(50)
    //this.scene.add(axesHelper)

    // Set up the physics world
    this.physicsWorld.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z)

    console.log('Game world initialized')
  }

  update() {
    this.renderer?.render(this.scene, this.camera)
    this.physicsWorld.step(1 / 60)
    if (this.cannonDebug)
      this.cannonDebug.update();
  }

  generateLevel(name: string): GameLevel {
    console.log('Generating level')
    // Instantiate level class
    this.level = new GameLevel(name, this.type)
    // Generate level blocks
    this.level.generateTrack()
    // Loop through level blocks and add them to the scene
    this.level.levelBlocks.forEach((block) => {
      this.addObject(block)
    })
    // Return the level
    return this.level
  }

  addObject(object: GameObject): void {
    this.scene.add(object.getMesh())
    this.physicsWorld.addBody(object.getBody())
  }

  addPlayer(): PlayerObject {
    const player = new PlayerObject()
    const startPosition = this.level?.getStartPosition()
    console.log('Start position: ',startPosition)
    player.getBody().position.set(
      startPosition?.x ? startPosition.x * GAME_CONFIG.level_block.width : 0,
      (startPosition?.z ? startPosition.z * GAME_CONFIG.level_block.height : 0) + 3,
      startPosition?.y ? startPosition.y * GAME_CONFIG.level_block.depth : 0
    )
    this.addObject(player)
    return player
  }

  addGoal(): GoalObject {
    const goal = new GoalObject()
    const goalPosition = this.level?.getGoalPosition()
    goal.getBody().position.set(
      goalPosition?.x ? goalPosition.x * GAME_CONFIG.level_block.width : 0,
      (goalPosition?.z ? goalPosition.z * GAME_CONFIG.level_block.height : 0) + 3,
      goalPosition?.y ? goalPosition.y * GAME_CONFIG.level_block.depth : 0,
    )
    this.addObject(goal)
    return goal
  }

  // Getters
  getLevel(): GameLevel | null {
    return this.level
  }

  getScene() {
    return this.scene
  }

  getPhysicsWorld() {
    return this.physicsWorld
  }

  getRenderer() {
    return this.renderer
  }

  getCamera() {
    return this.camera
  }

  getGround(): GroundObject | null {
    return this.ground
  }

  updateCamera(position: [ x: number, y: number, z: number ], lookAt: [ x: number, y: number, z: number ]) {
    const targetPosition = new THREE.Vector3(...position)
    const targetLookAt = new THREE.Vector3(...lookAt)
    this.camera.position.lerp(targetPosition, 0.5)
    this.camera.lookAt(targetLookAt)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
