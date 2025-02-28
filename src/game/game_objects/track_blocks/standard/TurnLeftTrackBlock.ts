import * as THREE from 'three'
import { TrackBlock } from 'src/game/game_objects/track_blocks/TrackBlock'
import { TrackBlockOrientation } from 'src/game/types/game'

export class TurnLeftTrackBlock extends TrackBlock {
  constructor(
    block_x: number,
    block_y: number,
    block_z: number,
    orientation: TrackBlockOrientation = TrackBlockOrientation.NORTH
  ) {
    // Create mesh group
    const group = new THREE.Group()

    // Add track base to group
    group.add(TurnLeftTrackBlock.createTrackBase('TurnLeft.png'))

    // Add walls to group
    group.add(TurnLeftTrackBlock.createWall('north'))
    group.add(TurnLeftTrackBlock.createWall('east'))

    // Call parent constructor
    super(block_x, block_y, block_z, 'turn-left', orientation, group)
  }
}
