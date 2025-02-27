import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'

export class GroundObject extends GameObject {
  constructor(width: number = 100, height: number = 100) {
    // Create a texture for the ground
    // Create canvas for tile texture
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    if (!context) {
      throw new Error('Unable to obtain 2D context for the canvas');
    }

    // Set background color
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tile grid
    const tileSize = canvas.width / 10; // 10x10 grid
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 2;

    // Vertical lines
    for (let x = 0; x <= 10; x++) {
      context.beginPath();
      context.moveTo(x * tileSize, 0);
      context.lineTo(x * tileSize, canvas.height);
      context.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= 10; y++) {
      context.beginPath();
      context.moveTo(0, y * tileSize);
      context.lineTo(canvas.width, y * tileSize);
      context.stroke();
    }

    // Slight texture variation
    context.globalAlpha = 0.05;
    context.fillStyle = 'black';
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if ((x + y) % 2 === 0) {
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
    context.globalAlpha = 1;

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Adjust the texture scaling to ensure square tiles
    // The scaling factor ensures the texture repeats proportionally to width and height
    const textureRepeatX = width / 10; // Scale proportional to board width
    const textureRepeatY = height / 10; // Scale proportional to board height
    texture.repeat.set(textureRepeatX, textureRepeatY);
    // Create a ground THREE material
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.3,
      roughness: 0.4
    });

    // Create a ground THREE geometry
    const geometry = new THREE.PlaneGeometry(GAME_CONFIG.world.width, GAME_CONFIG.world.height);

    // Create a mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2

    // Create a ground CANNON shape
    const shape = new CANNON.Plane();

    // Create physics material for ground
    const groundMaterial = new CANNON.Material('groundMaterial')

    // Create a ground CANNON body
    const body = new CANNON.Body({
      mass: 0,
      shape: shape,
      material: groundMaterial
    });

    body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

    // Set ID
    const id = 'ground';
    super(id, mesh, body);
  }
}
