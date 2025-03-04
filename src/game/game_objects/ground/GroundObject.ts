import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'
import { ChessBoardCanvasMaterial } from 'src/game/game_objects/materials/canvases/ChessBoardCanvasMaterial'
import { TextureMaterial } from 'src/game/game_objects/materials/TextureMaterial'

export class GroundObject extends GameObject {
  constructor(width: number = GAME_CONFIG.world.width * 10, height: number = GAME_CONFIG.world.height * 10) {

    // Create canvas for tile texture
    const material = new TextureMaterial('grass/grass.jpg', 10,10)

    // Create a ground THREE geometry
    const geometry = new THREE.PlaneGeometry(width, height);

    // Create a mesh
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2

    // Create a ground CANNON shape
    const shape = new CANNON.Plane();

    // Create physics material for ground
    const groundMaterial = new CANNON.Material('groundMaterial');

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
