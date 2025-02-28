import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class PlayerObject extends GameObject {
  constructor(size: number = GAME_CONFIG.player.radius) {
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
      friction: 10.9,
      restitution: 0.5,
    });

    // Create a player CANNON shape
    const playerShape = new CANNON.Sphere(size);

    // Create a player CANNON body
    const body = new CANNON.Body({
      mass: 100,
      material: playerMaterial,
      shape: playerShape
    });

    super('player', mesh, body);

  }

  jump() {
    this.body.velocity.y = GAME_CONFIG.player.jumpForce;
  }

  async init() {
    if (this.isMobileDevice()) {
      await this.initGyroControls();
    } else {
      this.initKeyboardControls();
    }
  }

  private isMobileDevice(): boolean {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  }

  private initKeyboardControls() {
    window.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.moveForward();
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.moveBackward();
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'KeyC':
          this.stop();
          break;
        case 'Space':
          this.jump()
          break
      }
    });
  }

  private async initGyroControls() {
    if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
      try {
        const response = await (DeviceMotionEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
        }
      } catch (error) {
        console.error('Gyro permission request failed:', error);
      }
    } else {
      window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
    }
  }

  private handleDeviceOrientation(event: DeviceOrientationEvent) {
    if (event.beta !== null && event.gamma !== null) {
      this.handleGyro(event.beta, event.gamma);
    }
  }

  private handleGyro(beta: number, gamma: number) {
    if (beta > 5) this.moveBackward(Math.abs(beta/90));
    if (beta < -5) this.moveForward(Math.abs(beta/90));
    if (gamma > 5) this.moveRight(Math.abs(gamma/90));
    if (gamma < -5) this.moveLeft(Math.abs(gamma/90));
  }

  private moveForward(speed: number = 1) {
    // Move the player forward
    if (this.body.velocity.z > -GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.z -= speed
    }
  }
  private moveBackward(speed: number = 1) {
    // Move the player backward
    if (this.body.velocity.z < GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.z += speed
    }
  }
  private moveLeft(speed: number = 1) {
    // Move the player left
    if (this.body.velocity.x > -GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.x -= speed
    }
  }
  private moveRight(speed: number = 1) {
    // Move the player right
    if (this.body.velocity.x < GAME_CONFIG.player.maxSpeed) {
      this.body.velocity.x += speed
    }
  }
  private stop() {
    // Stop the player
    this.body.velocity.set(0, 0, 0)
    this.body.angularVelocity.set(0, 0, 0)
  }
}
