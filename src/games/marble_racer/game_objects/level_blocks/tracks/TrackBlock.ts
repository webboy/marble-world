import * as THREE from 'three'
import { GAME_CONFIG } from 'src/games/marble_racer/configuration/config'
import { LevelBlockOrientation, LevelBlockType } from 'src/games/marble_racer/types/game'
import { LevelBlock } from 'src/games/marble_racer/game_objects/level_blocks/LevelBlock'

export class TrackBlock extends LevelBlock {
  timeValue: number = 100;

  // Common colors
  protected static readonly DEFAULT_COLOR = 0x555555
  // Default texture path
  protected static readonly TEXTURE_PATH = 'src/game/assets/textures/track/'

  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: LevelBlockOrientation = LevelBlockOrientation.NORTH,
    mesh: THREE.Mesh | THREE.Group,
    name: string = 'track'
  ) {
    const type = LevelBlockType.TRACK
    // Call super constructor
    super(block_x, block_y, block_z, orientation, type, mesh)

    // Set the name
    this.name = name
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
    materials[4] = new THREE.MeshStandardMaterial({
      color: 'gray',
      map: trackTexture,
    })

    // Create geometry for track base
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.level_block.width,
      GAME_CONFIG.level_block.height,
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
  protected static createBaseMaterials(): THREE.MeshStandardMaterial[] {
    return Array(6).fill(null).map(() =>
      new THREE.MeshStandardMaterial({ color: this.DEFAULT_COLOR })
    )
  }

  /**
   * Creates a wall for the track block
   */
  protected static createWall(position: string) {

    // create material
    const material = new THREE.MeshStandardMaterial({ color: this.DEFAULT_COLOR })

    // create geometry
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.track_wall.thickness,
      GAME_CONFIG.level_block.height,
      GAME_CONFIG.track_wall.height
    )

    // create mesh
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.z = GAME_CONFIG.track_block.thickness * 1.5

    // set position relative to the track block. Position can be north, south, east, west
    switch (position) {
      case 'north':
        mesh.position.y = (GAME_CONFIG.level_block.depth / 2) - GAME_CONFIG.track_wall.thickness / 2
        mesh.rotation.z = Math.PI / 2
        break
      case 'south':
        mesh.position.y = (-GAME_CONFIG.level_block.depth / 2) + GAME_CONFIG.track_wall.thickness / 2
        mesh.rotation.z = -Math.PI / 2
        break
      case 'east':
        mesh.position.x = (GAME_CONFIG.level_block.depth / 2) - GAME_CONFIG.track_wall.thickness / 2
        break
      case 'west':
        mesh.position.x = (-GAME_CONFIG.level_block.depth / 2) + GAME_CONFIG.track_wall.thickness / 2
        break
    }
    return mesh
  }
}
