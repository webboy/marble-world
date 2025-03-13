import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameObject } from 'src/games/marble_racer/game_objects/GameObject'
import { GAME_CONFIG } from 'src/games/marble_racer/configuration/config'

export class PlayerObject extends GameObject {
  static mass: number = 50
  constructor(size: number = GAME_CONFIG.player.radius) {

    // Create canvas for texture
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 256

    if (!context) {
      throw new Error('Unable to obtain 2D context for the canvas')
    }

    // Create pattern
    context.fillStyle = '#e60000' // Base red color
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Add stripes
    context.fillStyle = '#ff3333' // Lighter red for stripes
    const stripeWidth = canvas.width / 8
    for (let i = 0; i < canvas.height; i += stripeWidth * 2) {
      context.fillRect(0, i, canvas.width, stripeWidth)
    }

    // Add some circular patterns
    context.strokeStyle = '#cc0000' // Darker red for circles
    context.lineWidth = 2
    for (let i = 0; i < 4; i++) {
      const radius = (canvas.width / 4) * (i + 1)
      context.beginPath()
      context.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2)
      context.stroke()
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.3,
      roughness: 0.4,
    })

    // Create a player THREE geometry
    const geometry = new THREE.SphereGeometry(size, 32, 32)

    // Create a mesh
    const mesh = new THREE.Mesh(geometry, material)

    // Create a player CANNON material
    const playerMaterial = new CANNON.Material({
      friction: 0.9,
      restitution: 0.5,
    })

    // Create a player CANNON shape
    const playerShape = new CANNON.Sphere(size)

    // Create a player CANNON body
    const body = new CANNON.Body({
      mass: PlayerObject.mass,
      material: playerMaterial,
      shape: playerShape,
    })

    super('player', mesh, body)
  }

  // Apply velocity to the player object
  increaseVelocity(x: number = 0, y: number = 0) {
    // Increase X axis velocity
    if (this.body.velocity.x <= GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.x += x
    }
    // Increase Y axis velocity
    if (this.body.velocity.y <= GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.z += y
    }
  }

  //Stop the player object
  stop() {
    this.body.velocity.set(0, 0, 0)
    this.body.angularVelocity.set(0, 0, 0)
  }

  // Jump
  jump() {
    this.body.velocity.y = GAME_CONFIG.player.jumpForce
  }
}
