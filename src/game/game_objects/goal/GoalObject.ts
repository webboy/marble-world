import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class GoalObject extends GameObject{

  // Define the constructor. Coordinates are related to track block position
  constructor(radius: number = GAME_CONFIG.player.radius *3.5) {
    // Define the mesh geometry
    const geometry = new THREE.SphereGeometry(radius, 32, 32)

    // Create canvas for texture
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 256

    if (!context) {
      throw new Error('Unable to obtain 2D context for the canvas')
    }

    // Create pattern
    context.fillStyle = '#0000e6' // Base red color
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Add stripes
    context.fillStyle = '#3333ff' // Lighter red for stripes
    const stripeWidth = canvas.width / 8
    for (let i = 0; i < canvas.height; i += stripeWidth * 2) {
      context.fillRect(0, i, canvas.width, stripeWidth)
    }

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(2, 2)

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.7,
      roughness: 0.4,
    })

    // Define sphere mesh
    const mesh = new THREE.Mesh(
      geometry,
      material
    )

    // Create a player CANNON material
    const goalMaterial = new CANNON.Material({
      friction: 0.9,
      restitution: 0.5,
    })


    // Define sphere body
    const body = new CANNON.Body({
      mass: 1,
      shape: new CANNON.Sphere(radius),
      material: goalMaterial,
    })

    // Define ID
    const id = 'goal'
    super(id, mesh, body)
  }
}
