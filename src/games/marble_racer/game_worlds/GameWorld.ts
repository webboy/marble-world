import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import type { GameWorldBlockPosition} from 'src/games/marble_racer/types/game';
import { GameWorldType } from 'src/games/marble_racer/types/game'
import type { GameObject } from 'src/games/marble_racer/game_objects/GameObject'
import { GameLevel } from 'src/games/marble_racer/game_worlds/GameLevel'

export class GameWorld {
  protected type: GameWorldType = GameWorldType.GRASS
  protected scene: THREE.Scene = new THREE.Scene()
  protected camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  protected renderer: THREE.WebGLRenderer | null = null
  protected ambientLights: Map<string, THREE.AmbientLight> = new Map()
  protected directionalLights: Map<string, THREE.DirectionalLight> = new Map()
  protected ground: GameObject | null = null
  protected physicsWorld: CANNON.World = new CANNON.World()
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

    // Set up the physics world
    this.physicsWorld.gravity.set(this.gravity.x, this.gravity.y, this.gravity.z)

    console.log('Game world initialized')
  }

  update() {
    this.renderer?.render(this.scene, this.camera)
    this.physicsWorld.step(1 / 60)
  }

  generateLevel(name: string) {
    console.log('Generating level')
    // Instantiate level class
    this.level = new GameLevel(name, this.type)
    // Generate level blocks
    this.level.generateTrack()
    // Loop through level blocks and add them to the scene
    this.level.levelBlocks.forEach((block) => {
      this.addObject(block)
    })
  }

  addObject(object: GameObject): void {
    this.scene.add(object.getMesh())
    this.physicsWorld.addBody(object.getBody())
  }

  // Getters
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

  updateCamera(position: [ x: number, y: number, z: number ], lookAt: [ x: number, y: number, z: number ]) {
    const targetPosition = new THREE.Vector3(...position)
    this.camera.position.lerp(targetPosition, 0.2)
    this.camera.lookAt(...lookAt)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
}
