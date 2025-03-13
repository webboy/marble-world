import * as THREE from 'three'
import { GameWorld } from 'src/games/marble_racer/game_worlds/GameWorld'
import { GroundObject } from 'src/games/marble_racer/game_objects/ground/GroundObject'

export class GrassWorld extends GameWorld {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    // Load png image as a scene background
    const loader = new THREE.CubeTextureLoader()

    this.scene.background = loader
      .setPath('src/game/assets/textures/skybox2/')
      .load(['2.png', '1.png', '3.png', '4.png', '5.png', '6.png'])

    // Set camera
    this.camera.position.set(-50, 50, 50)

    // Set up ground
    this.ground = new GroundObject()

    // Set up ambient light
    this.ambientLights.set(
      'ambientLight',
      new THREE.AmbientLight(0xffffff, 1)
    )

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(100, 100, 50)
    directionalLight.castShadow = true

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 8048; // default
    directionalLight.shadow.mapSize.height = 8048; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;

    this.directionalLights.set(
      'directionalLight',
      directionalLight)

    // Set gravity
    this.gravity.set(0, -9.82, 0)
  }

  override init() {
    super.init()
  }

}
