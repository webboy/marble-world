import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameObject } from 'src/game/game_objects/GameObject'

export class PlayerObject extends GameObject {
  constructor(size: number = 1) {
    // Create a player THREE material with stripes
    // Create canvas for texture
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 256
    canvas.height = 256

    if (!context) {
      throw new Error('Unable to obtain 2D context for the canvas');
    }

    // Create pattern
    context.fillStyle = '#e60000'  // Base red color
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Add stripes
    context.fillStyle = '#ff3333'  // Lighter red for stripes
    const stripeWidth = canvas.width / 8
    for (let i = 0; i < canvas.height; i += stripeWidth * 2) {
      context.fillRect(0, i, canvas.width, stripeWidth)
    }

    // Add some circular patterns
    context.strokeStyle = '#cc0000'  // Darker red for circles
    context.lineWidth = 2
    for (let i = 0; i < 4; i++) {
      const radius = canvas.width / 4 * (i + 1)
      context.beginPath()
      context.arc(canvas.width/2, canvas.height/2, radius, 0, Math.PI * 2)
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
      roughness: 0.4
    })

    // Create a player THREE geometry
    const geometry = new THREE.SphereGeometry(size, 32, 32);

    // Create a mesh
    const mesh = new THREE.Mesh(geometry, material);

    // Create a player CANNON material
    const playerMaterial = new CANNON.Material({
      friction: 0.1,
      restitution: 0.5
    });

    // Create a player CANNON shape
    const playerShape = new CANNON.Sphere(size);

    // Create a player CANNON body
    const body = new CANNON.Body({
      mass: 1,
      material: playerMaterial,
      shape: playerShape
    });

    super('player', mesh, body);

  }

  jump() {
    this.body.velocity.y = 15;
  }

  init() {
    // Set controls
    document.onkeydown = (e) => {
      switch (e.key) {
        case 'w':
          this.body.velocity.z -= 1;
          break;
        case 's':
          this.body.velocity.z += 1;
          break;
        case 'a':
          this.body.velocity.x -= 1;
          break;
        case 'd':
          this.body.velocity.x += 1;
          break;
        case 'c':
          this.body.velocity.z = 0;
          this.body.velocity.x = 0;
          break
        case ' ':
          this.jump();
          break;
      }
    }
  }

}
