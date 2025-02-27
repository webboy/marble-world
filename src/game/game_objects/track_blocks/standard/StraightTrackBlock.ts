import * as THREE from 'three'
import { GAME_CONFIG } from 'src/game/configuration/config'

import { TrackBlock } from 'src/game/game_objects/track_blocks/TrackBlock'
import { TrackBlockOrientation } from 'src/game/types/game'

export class StraightTrackBlock extends TrackBlock {
  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: TrackBlockOrientation = TrackBlockOrientation.NORTH
  ) {
    // Create loader
    const loader = new THREE.TextureLoader()
    const trackTexture = loader.setPath("src/game/assets/textures/track/").load('TrackN.png')

    trackTexture.wrapS = THREE.RepeatWrapping
    trackTexture.wrapT = THREE.RepeatWrapping
    trackTexture.repeat.set(1, 1)

    // Create materials for the track block
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x555555 }), // Right
      new THREE.MeshBasicMaterial({ color: 0x555555 }), // Left
      new THREE.MeshBasicMaterial({ color: 0x555555 }), // Top (this is the one we modify!)
      new THREE.MeshBasicMaterial({ color: 0x555555 }), // Bottom
      new THREE.MeshBasicMaterial({ map: trackTexture }), // Front
      new THREE.MeshBasicMaterial({ color: 0x555555 })  // Back
    ];

    // Create a standard material for the walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xa0a0a0,
      metalness: 0.4,
      roughness: 0.6,
    });

    // Create a track block THREE geometry
    const geometry = new THREE.BoxGeometry(
      GAME_CONFIG.track_block.width,
      GAME_CONFIG.track_block.height,
      1,
    );

    // Create a mesh for the track base
    const mesh = new THREE.Mesh(geometry, materials);

    // Create a group to hold the track and walls
    const group = new THREE.Group();
    group.add(mesh);

    // Wall dimensions
    const wallHeight = GAME_CONFIG.track_block.height;  // Half the height of track
    const wallThickness = 1;
    const wallLength = 1;  // Same as track depth

    // Create East wall geometry
    const eastWallGeometry = new THREE.BoxGeometry(
      wallThickness,
      wallHeight,
      wallLength
    );

    // Create West wall geometry
    const westWallGeometry = new THREE.BoxGeometry(
      wallThickness,
      wallHeight,
      wallLength
    );

    // Create East and West wall meshes
    const eastWallMesh = new THREE.Mesh(eastWallGeometry, wallMaterial);
    const westWallMesh = new THREE.Mesh(westWallGeometry, wallMaterial);

    // Position the walls on the East and West sides of the track
    // East wall (right side when facing North)
    eastWallMesh.position.set(
      GAME_CONFIG.track_block.width / 2 - wallThickness / 2,  // Position at the right edge
      0,  // Position at half the wall height from bottom of track
      1  // Same Z position as track
    );

    // West wall (left side when facing North)
    westWallMesh.position.set(
      -GAME_CONFIG.track_block.width / 2 + wallThickness / 2,  // Position at the left edge
      0,  // Position at half the wall height from bottom of track
      1  // Same Z position as track
    )

    // Add walls to the group
    group.add(eastWallMesh);
    group.add(westWallMesh);

    super(block_x, block_y, block_z, 'straight', orientation, group);
  }
}
