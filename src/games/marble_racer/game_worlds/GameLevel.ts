import type { GameWorldBlockPosition, GameWorldType } from 'src/games/marble_racer/types/game'
import type { LevelBlock } from 'src/games/marble_racer/game_objects/level_blocks/LevelBlock'
import type { TrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/TrackBlock'
import { StartTrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/standard/StartTrackBlock'
import { LevelBlockOrientation } from 'src/games/marble_racer/types/game'
import {
  TurnRightTrackBlock
} from 'src/games/marble_racer/game_objects/level_blocks/tracks/standard/TurnRightTrackBlock'
import { StraightTrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/standard/StraightTrackBlock'
import { TurnLeftTrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/standard/TurnLeftTrackBlock'
import { GoalTrackBlock } from 'src/games/marble_racer/game_objects/level_blocks/tracks/standard/GoalTrackBlock'

export class GameLevel {
  name: string
  worldType: GameWorldType
  levelBlocks: Map<GameWorldBlockPosition, LevelBlock> = new Map()
  protected maxTime: number = 0
  protected trackZLevel: number = 1
  protected goalPosition: GameWorldBlockPosition = { x: 0, y: 0, z: 0 }
  protected startPosition: GameWorldBlockPosition = { x: 0, y: 0, z: 0 }

  constructor(name: string, worldType: GameWorldType) {
    this.name = name
    this.worldType = worldType
  }

  generateTrack():void {
    console.log(`Generating track for level ${this.name}`)
    // Generate track blocks
    this.startPosition = this.addTrackBlock(new StartTrackBlock(-1, 1, this.trackZLevel, LevelBlockOrientation.NORTH))

    // Add first corner
    this.addTrackBlock(new TurnRightTrackBlock(-1, 0, this.trackZLevel, LevelBlockOrientation.NORTH))

    // Add track blocks to the world
    for (let i = 0; i < 3; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, 0, this.trackZLevel, LevelBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }
    let cornerBlock
    cornerBlock = new TurnLeftTrackBlock(3, 0, this.trackZLevel, LevelBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = 1; i < 5; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(3, -i, this.trackZLevel, LevelBlockOrientation.NORTH)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(3, -5, this.trackZLevel, LevelBlockOrientation.NORTH)
    this.addTrackBlock(cornerBlock)

    for (let i = 4; i < 6; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(i, -5, this.trackZLevel, LevelBlockOrientation.EAST)
      this.addTrackBlock(trackBlock)
    }

    cornerBlock = new TurnRightTrackBlock(6, -5, this.trackZLevel, LevelBlockOrientation.EAST)
    this.addTrackBlock(cornerBlock)

    for (let i = -4; i < -1; i++) {
      // Create a straight track block with random orientation
      const trackBlock = new StraightTrackBlock(6, i, this.trackZLevel, LevelBlockOrientation.SOUTH)
      this.addTrackBlock(trackBlock)
    }

    // Add goal track block
    this.goalPosition = this.addTrackBlock(new GoalTrackBlock(6, 1, this.trackZLevel, LevelBlockOrientation.SOUTH))
  }

  addTrackBlock(trackBlock: TrackBlock): GameWorldBlockPosition {
    // Set position of track block
    const position: GameWorldBlockPosition = { x: trackBlock.block_x, y: trackBlock.block_y, z: trackBlock.block_z }

    // Add track block to the world
    this.levelBlocks.set(position, trackBlock)

    // Add time value to the max time
    this.maxTime += trackBlock.timeValue

    // Return position of track block
    return position
  }
}
