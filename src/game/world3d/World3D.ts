import * as THREE from 'three'
import type { World } from 'cannon-es'
import cannonDebugger from 'cannon-es-debugger'

export class World3D {
  private readonly scene: THREE.Scene
  private readonly camera: THREE.PerspectiveCamera
  private readonly ambientLight: THREE.AmbientLight
  private readonly directionalLight: THREE.DirectionalLight
  private renderer: THREE.WebGLRenderer
  private cannonDebug: { update: () => void, scene: THREE.Scene } | null = null // Reference to cannon debugger
  private readonly physicsWorld: World // Reference to physics world
  private debugVisible = true; // Track visibility state of the debugger


  constructor(canvas: HTMLCanvasElement, physicsWorld: World) {
    // Create scene
    this.scene = new THREE.Scene()
    // Load png image as a scene background
    const loader = new THREE.CubeTextureLoader()

    this.scene.background = loader.setPath("src/game/assets/textures/skybox2/").load([
      '1.png', '2.png', '3.png', '4.png', '5.png', '6.png'
    ])

    // Set camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.set(0, 20, 5)
    //this.camera.lookAt(0, 0, 0)

    // Set renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    // Add ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.5)
    this.scene.add(this.ambientLight)

    // Add directional light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    this.directionalLight.position.set(10, 10, 0)
    this.scene.add(this.directionalLight)

    // Add reference to physics world
    this.physicsWorld = physicsWorld

    // Attach debugger to Three.js scene and Cannon world
    this.cannonDebug = cannonDebugger(this.scene, this.physicsWorld, {
      color: 0xff0000, // Red wireframe for physics
      scale: 1 // Scale of wireframe
    }) as { update: () => void; scene: THREE.Scene }; // Cast the return value to include "scene"


  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  addObject(object: THREE.Object3D) {
    this.scene.add(object)
  }

  update() {
    if (this.debugVisible) {
      if (this.cannonDebug)
        this.cannonDebug.update(); // Refresh physics wireframe if visible
    }

    this.renderer.render(this.scene, this.camera)
  }

  updateCamera(position: [ x: number, y: number, z: number ], lookAt: [ x: number, y: number, z: number ]) {
    const targetPosition = new THREE.Vector3(...position)
    this.camera.position.lerp(targetPosition, 0.5)
    this.camera.lookAt(...lookAt)
  }

  public onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // New method to toggle the visibility of the cannon debugger
  toggleDebug() {
    console.log('Toggling debug visibility');
    this.debugVisible = !this.debugVisible; // Toggle visibility state
  }

}
