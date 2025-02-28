import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import { GameObject } from 'src/game/game_objects/GameObject'
import { GAME_CONFIG } from 'src/game/configuration/config'
import { TrackBlockOrientation } from 'src/game/types/game'
import { PhysicsBodyUtility } from 'src/game/utilities/PhysicsBodyUtility'

export class TrackBlock extends GameObject {
  block_x: number
  block_y: number
  block_z: number
  type: string
  orientation: TrackBlockOrientation

  // Common colors
  protected static readonly DEFAULT_COLOR = 0x555555
  // Default texture path
  protected static readonly TEXTURE_PATH = 'src/game/assets/textures/track/'

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

    // Set the block coordinates
    this.block_x = block_x
    this.block_y = block_y
    this.block_z = block_z

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
  }

  /**
   * Creates the base track with appropriate texture
   */
  protected static createTrackBase(texture: string): THREE.Mesh {
    // Create texture
    const trackTexture = this.loadTexture(texture)

    const alphaMap = (new THREE.TextureLoader()).setPath(this.TEXTURE_PATH).load('SideTracks.png')

    // Create materials array with texture on the appropriate face
    const materials = this.createBaseMaterials()
    materials[4] = new THREE.MeshBasicMaterial({
      map: trackTexture,
      //alphaMap: alphaMap,
      //transparent: true,
      //color: 'gray',
    }) // Front face

    //materials[4].transparent = true

    // Create geometry for track base
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.track_block.width,
      GAME_CONFIG.track_block.height,
      GAME_CONFIG.track_block.thickness
    )

    // Return the complete mesh
    return new THREE.Mesh(geometry, materials)
  }

  /**
   * Loads the appropriate texture
   */
  protected static loadTexture(textureName: string): THREE.Texture {
    const loader = new THREE.TextureLoader()
    const texture = loader.setPath(this.TEXTURE_PATH).load(textureName)

    // Configure texture properties
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)

    return texture
  }

  /**
   * Creates basic materials for track components
   */
  protected static createBaseMaterials(): THREE.MeshBasicMaterial[] {
    return Array(6).fill(null).map(() =>
      new THREE.MeshBasicMaterial({ color: this.DEFAULT_COLOR })
    )
  }

  /**
   * Creates a wall for the track block
   */
  protected static createWall(position: string) {
    // create material
    const material = new THREE.MeshBasicMaterial({ color: this.DEFAULT_COLOR })

    // create geometry
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.track_wall.thickness,
      GAME_CONFIG.track_block.height,
      GAME_CONFIG.track_wall.height
    )

    // create mesh
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.z = GAME_CONFIG.track_block.thickness * 1.5

    // set position relative to the track block. Position can be north, south, east, west
    switch (position) {
      case 'north':
        mesh.position.y = (GAME_CONFIG.track_block.depth / 2) - GAME_CONFIG.track_wall.thickness / 2
        mesh.rotation.z = Math.PI / 2
        break
      case 'south':
        mesh.position.y = (-GAME_CONFIG.track_block.depth / 2) + GAME_CONFIG.track_wall.thickness / 2
        mesh.rotation.z = -Math.PI / 2
        break
      case 'east':
        mesh.position.x = (GAME_CONFIG.track_block.depth / 2) - GAME_CONFIG.track_wall.thickness / 2
        break
      case 'west':
        mesh.position.x = (-GAME_CONFIG.track_block.depth / 2) + GAME_CONFIG.track_wall.thickness / 2
        break
    }

    return mesh
  }
}
