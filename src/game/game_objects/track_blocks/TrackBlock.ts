import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'
import { TrackBlockOrientation } from 'src/game/types/game'
import { PhysicsBodyUtility } from 'src/game/utilities/PhysicsBodyUtility'

export class TrackBlock extends GameObject {
  type: string
  orientation: TrackBlockOrientation

  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    type: string,
    orientation: TrackBlockOrientation = TrackBlockOrientation.NORTH,
    mesh: THREE.Mesh | THREE.Group
  ) {
    // Create a physics body utility
    const physicsUtility = new PhysicsBodyUtility()
    let body: CANNON.Body

    // ✅ Step 1: Rotate mesh parallel to the ground
    mesh.rotation.x = - Math.PI / 2;

    // ✅ Step 2: Apply the correct orientation (rotation on Y axis)
    let yRotation = 0; // Default NORTH
    switch (orientation) {
      case TrackBlockOrientation.EAST:
        yRotation = -Math.PI / 2;
        break;
      case TrackBlockOrientation.SOUTH:
        yRotation = Math.PI;
        break;
      case TrackBlockOrientation.WEST:
        yRotation = Math.PI / 2;
        break;
    }
    mesh.rotation.z = yRotation;

    // Create a track block CANNON body from Trimesh
    if (mesh instanceof THREE.Group) {
      body = physicsUtility.createPhysicsFromGroup(mesh, 0)
    } else {
      const shape = physicsUtility.createTrimeshFromMesh(mesh)
      if (!shape) {
        throw new Error('Failed to create a trimesh from the mesh')
      }

      // Create a CANNON body
      body = new CANNON.Body({
        mass: 0,
        shape,
      })
    }

    // Rotate the track block
    //body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

    // Create track block ID
    const id = `track-block-${block_x}-${block_y}-${block_z}`

    // Call super constructor
    super(id, mesh, body)

    // Set the type
    this.type = type

    // Set the position
    const position = [
      block_x * GAME_CONFIG.track_block.width,
      block_z * GAME_CONFIG.track_block.height + 1,
      block_y * GAME_CONFIG.track_block.depth,
    ]

    // Set the position
    this.mesh.position.set(position[0] || 0, position[1] || 0, position[2] || 0)
    this.body.position.set(position[0] || 0, position[1] || 0, position[2] || 0)

    // Set the orientation
    this.orientation = orientation

    // ✅ Step 4: Apply the same rotation to the physics body
    body.quaternion.setFromEuler(-Math.PI / 2, 0, yRotation, "XYZ");

    //Actual position
    console.log(`TrackBlock ${this.id} - ${this.orientation}`, this.body.position)
  }
}
