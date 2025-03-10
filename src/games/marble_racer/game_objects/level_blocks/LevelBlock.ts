import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GameObject } from 'src/games/marble_racer/game_objects/GameObject'
import { LevelBlockOrientation, LevelBlockType } from 'src/games/marble_racer/types/game'
import { PhysicsBodyUtility } from 'src/games/utilities/PhysicsBodyUtility'
import { GAME_CONFIG } from 'src/games/marble_racer/configuration/config'

export class LevelBlock extends GameObject{
  type: LevelBlockType = LevelBlockType.TRACK
  name: string = 'level_block'
  block_x: number
  block_y: number
  block_z: number
  orientation: LevelBlockOrientation = LevelBlockOrientation.NORTH

  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: LevelBlockOrientation = LevelBlockOrientation.NORTH,
    type: LevelBlockType = LevelBlockType.TRACK,
    mesh: THREE.Mesh | THREE.Group,
    name: string = 'level_block'
  ) {
    // Create a physics body utility
    const physicsUtility = new PhysicsBodyUtility()
    let body: CANNON.Body

    // Step 1: Rotate mesh parallel to the ground
    mesh.rotation.x = - Math.PI / 2;

    // Step 2: Apply the correct orientation (rotation on Y axis)
    let yRotation = 0; // Default NORTH
    switch (orientation) {
      case LevelBlockOrientation.EAST:
        yRotation = -Math.PI / 2;
        break;
      case LevelBlockOrientation.SOUTH:
        yRotation = Math.PI;
        break;
      case LevelBlockOrientation.WEST:
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
        type: CANNON.Body.STATIC,
        shape,
      })
    }

    // Create ID
    const id = `block-${type}-${block_x}-${block_y}-${block_z}`

    // Call super constructor
    super(id, mesh, body)

    // Set the name
    this.name = name

    // Set position
    this.block_x = block_x
    this.block_y = block_y
    this.block_z = block_z

    // Set the type
    this.type = type

    // Set the position
    const position = [
      block_x * GAME_CONFIG.level_block.width,
      block_z * GAME_CONFIG.level_block.height + 1,
      block_y * GAME_CONFIG.level_block.depth,
    ]

    // Set the position
    this.mesh.position.set(position[0] || 0, position[1] || 0, position[2] || 0)
    this.body.position.set(position[0] || 0, position[1] || 0, position[2] || 0)

    // Set the orientation
    this.orientation = orientation

    // Step 3: Apply the same rotation to the physics body
    body.quaternion.setFromEuler(-Math.PI / 2, 0, yRotation, "XYZ");
  }
}
