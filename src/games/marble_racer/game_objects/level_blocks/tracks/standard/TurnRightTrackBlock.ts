import * as THREE from 'three'
import { TrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/TrackBlock'
import { LevelBlockOrientation } from 'src/games/marble_racer/types/game'

export class TurnRightTrackBlock extends TrackBlock {
  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: LevelBlockOrientation = LevelBlockOrientation.NORTH
  ) {
    // Create mesh group
    const group = new THREE.Group()

    // Add track base to group
    group.add(TurnRightTrackBlock.createTrackBase('TurnRight.png'))

    // Add walls to group
    group.add(TurnRightTrackBlock.createWall('north'))
    group.add(TurnRightTrackBlock.createWall('west'))

    // Call parent constructor
    super(block_x, block_y, block_z, orientation, group, 'turn-right')
  }
}
