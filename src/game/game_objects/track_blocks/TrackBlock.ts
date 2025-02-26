import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GameObject } from 'src/game/game_objects/GameObject'

export class TrackBlock extends GameObject {
    constructor(x: number, y: number, z: number) {
      // Create a track block THREE material
      const material = new THREE.MeshStandardMaterial({
        color: 0x808080,
        metalness: 0.3,
        roughness: 0.4
      })

      // Create a track block THREE geometry
      const geometry = new THREE.BoxGeometry(10, 1, 10)

      // Create a mesh
      const mesh = new THREE.Mesh(geometry, material)

      // Create a track block CANNON shape
      const shape = new CANNON.Box(new CANNON.Vec3(10, 1, 10))

      // Create a track block CANNON body
      const body = new CANNON.Body({
        mass: 0,
        shape: shape
      })

      // Create track block ID
      const id = `track-block-${x}-${y}-${z}`

      // Call super constructor
      super(id, mesh, body);
    }
}
