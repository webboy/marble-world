export const GAME_CONFIG = {
  // Size of the game world, it fits 10x10x10 track blocks
  world: {
    width: 100,
    height: 100,
    depth: 100,
  },

  // Size of the track block cube
  track_block: {
    width: 10,
    height: 10,
    depth: 10,
    thickness: 1,
  },
  track_wall: {
    height: 2,
    thickness: 0.5,
  },
  player: {
    // Radius of the player's marble
    radius: 1,
    // Base jump force
    jumpForce: 10,
    // max speed
    maxSpeed: 20,
    // Rotation speed
    rotationSpeed: 0.05,
  }
}
