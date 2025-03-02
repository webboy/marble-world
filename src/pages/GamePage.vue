<template>
  <q-page class="game-page q-pa-none">
    <!-- Canvas for game rendering -->
    <canvas ref="canvas" class="game-canvas"></canvas>

    <!-- Debug panel -->
    <q-card class="debug-panel q-pa-sm" flat>
      <q-card-section class="q-pa-xs">
        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Tilt X:</q-item-label>
                <q-item-label>{{ tiltX.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Tilt Y:</q-item-label>
                <q-item-label>{{ tiltY.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Accel X:</q-item-label>
                <q-item-label>{{ accelX.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Accel Y:</q-item-label>
                <q-item-label>{{ accelY.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>

        <div class="row">
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Velocity:</q-item-label>
                <q-item-label>X: {{ velocityX.toFixed(2) }} | Y: {{ velocityY.toFixed(2) }} | Z: {{ velocityZ.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-6">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Position:</q-item-label>
                <q-item-label>X: {{ playerPositionX.toFixed(2) }} | Y: {{ playerPositionY.toFixed(2) }} | Z: {{ playerPositionZ.toFixed(2) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Jump button -->
    <q-page-sticky position="bottom" class="jump-button-container">
      <q-btn round size="lg" color="primary" icon="keyboard_arrow_up" @click="onJump" />
      <q-btn round size="lg" color="primary" icon="help" @click="toggleGrid" class="q-ml-lg" />
    </q-page-sticky>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GameEngine } from 'src/game/GameEngine'

// References

// Debug panel values
const tiltX = ref(0);
const tiltY = ref(0);
const accelX = ref(0);
const accelY = ref(0);
// Velocity values
const velocityX = ref(0);
const velocityY = ref(0);
const velocityZ = ref(0);

//Position values
const playerPositionX = ref(0);
const playerPositionY = ref(0);
const playerPositionZ = ref(0);

// Show grid flag
const showGrid = ref(false);

// Canvas reference
const canvas = ref<HTMLCanvasElement>()

// Game engine reference (will be properly typed later)
let gameEngine: GameEngine | null = null;

// Jump button handler
const onJump = () => {
  console.log('Jump button clicked');
  // Will be implemented when game mechanics are added
  gameEngine?.player?.jump();
};

// Toggle grid visibility
const toggleGrid = () => {
  showGrid.value = !showGrid.value;
  gameEngine?.world3D.toggleDebug();
};

const animate = () => {
  // Update debug panel values
  velocityX.value = gameEngine?.player?.body.velocity.x || 0;
  velocityZ.value = gameEngine?.player?.body.velocity.z || 0;
  velocityY.value = gameEngine?.player?.body.velocity.y || 0;

  // Update player position
  playerPositionX.value = gameEngine?.player?.body.position.x || 0
  playerPositionY.value = gameEngine?.player?.body.position.y || 0
  playerPositionZ.value = gameEngine?.player?.body.position.z || 0

  // Update the game engine
  if (gameEngine) {
    gameEngine.loop();
  }
  // Request the next animation frame
  requestAnimationFrame(animate);
};

onMounted(async () => {
  // Game initialization will go here
  console.log('Game page mounted');
  // Instantiate the game engine
  if (canvas.value) {
    // Only initialize the GameEngine after the canvas is available
    gameEngine = new GameEngine(canvas.value);
    console.log('Game engine initialized');
    await gameEngine.start()
    animate()
  } else {
    console.error('Canvas element is not available');
  }
  // Listen for resize events
  window.addEventListener('resize', () => {
    gameEngine?.world3D.onWindowResize()
  });
});

onBeforeUnmount(() => {
  // Cleanup will go here
  console.log('Game page unmounting');
});
</script>

<style scoped>
.game-page {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.game-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #333;
}

.debug-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  z-index: 2;
}

.jump-button-container {
  position: fixed !important;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}
</style>
