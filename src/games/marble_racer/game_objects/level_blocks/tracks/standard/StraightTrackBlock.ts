import * as THREE from 'three'
import { TrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/TrackBlock'
import { LevelBlockOrientation } from 'src/games/marble_racer/types/game'

export class StraightTrackBlock extends TrackBlock {
  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: LevelBlockOrientation = LevelBlockOrientation.NORTH
  ) {
    // Create mesh group
    const group = new THREE.Group()

    // Add track base to group
    group.add(StraightTrackBlock.createTrackBase('SideTracks.png'))

    // Add walls to group
    group.add(StraightTrackBlock.createWall('west'))
    group.add(StraightTrackBlock.createWall('east'))

    // Call parent constructor
    super(block_x, block_y, block_z, orientation, group, 'straight')
  }
}
