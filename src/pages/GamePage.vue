<template>
  <q-page class="game-page q-pa-none">
    <!-- Canvas for game rendering -->
    <canvas ref="canvas" class="game-canvas"></canvas>

    <!-- Debug panel -->
    <q-card class="debug-panel q-pa-sm" flat v-if="showDebug">
      <q-card-section class="q-pa-xs">
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <q-item dense>
              <q-item-section>
                <q-item-label caption>Timer:</q-item-label>
                <q-item-label>{{ timer.toFixed(2) }}</q-item-label>
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
      <q-btn round size="lg" color="primary" icon="help" @click="toggleDebug" class="q-ml-lg" />
    </q-page-sticky>

    <!-- Instructions dialog -->
    <q-dialog
      v-model="showInstructions"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="instructions-dialog">
        <q-card-section class="text-center q-pt-lg">
          <h4 class="text-weight-bold q-mt-none q-mb-md">Game Instructions</h4>
        </q-card-section>

        <q-card-section class="q-px-lg">
          <p>Welcome to the game! Here are the instructions on how to play:</p>
          <ul>
            <li>Use the jump button to navigate obstacles</li>
            <li>Collect power-ups along the way</li>
            <li>Avoid falling off the platform</li>
            <li>Reach the end before time runs out</li>
          </ul>
          <p class="text-weight-medium">Good luck!</p>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            color="primary"
            label="START"
            class="start-button q-py-sm q-px-xl"
            size="lg"
            @click="startGame"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <!-- Game Over dialog -->
    <q-dialog
      v-model="showGameOver"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="instructions-dialog">
        <q-card-section class="text-center q-pt-lg">
          <h4 class="text-weight-bold q-mt-none q-mb-md">Game Instructions</h4>
        </q-card-section>

        <q-card-section class="q-px-lg">
          <p>Welcome to the game! Here are the instructions on how to play:</p>
          <ul>
            <li>Use the jump button to navigate obstacles</li>
            <li>Collect power-ups along the way</li>
            <li>Avoid falling off the platform</li>
            <li>Reach the end before time runs out</li>
          </ul>
          <p class="text-weight-medium">Good luck!</p>
        </q-card-section>

        <q-card-actions align="center" class="q-pb-md">
          <q-btn
            color="primary"
            label="START"
            class="start-button q-py-sm q-px-xl"
            size="lg"
            @click="startGame"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { GameEngine } from 'src/game/GameEngine'

// References

// Dialog control
const showInstructions = ref(true);
const showGameOver = ref(false);

// Debug panel values
const timer = ref(0)
// Velocity values
const velocityX = ref(0);
const velocityY = ref(0);
const velocityZ = ref(0);

//Position values
const playerPositionX = ref(0);
const playerPositionY = ref(0);
const playerPositionZ = ref(0);

// Show grid flag
const showDebug = ref(false);

// Canvas reference
const canvas = ref<HTMLCanvasElement>()

// Game engine reference (will be properly typed later)
let gameEngine: GameEngine | null = null;
let animationFrameId: number | null = null;

// Jump button handler
const onJump = () => {
  console.log('Jump button clicked');
  // Will be implemented when game mechanics are added
  gameEngine?.player?.jump();
};

// Toggle grid visibility
const toggleDebug = () => {
  showDebug.value = !showDebug.value;
};

// Start game function
const startGame = async () => {
  showInstructions.value = false;

  // Initialize game if not already done
  if (gameEngine && !gameEngine.isStarted()) {
    await gameEngine.start();
    console.log('Game started');
  }
};

const showInstructionsDialog = () => {
  showInstructions.value = true;
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

  // Update timer
  timer.value = gameEngine?.getCurrentTime() || 0;

  // Update the game engine
  if (gameEngine) {
    gameEngine.loop();
  }
  // Request the next animation frame
  animationFrameId = requestAnimationFrame(animate);
};

onMounted(() => {
  // Game initialization will go here
  console.log('Game page mounted');
  // Instantiate the game engine
  if (canvas.value) {
    // Only initialize the GameEngine after the canvas is available
    gameEngine = new GameEngine(canvas.value);
    console.log('Game engine initialized');
    gameEngine.init();
    // Only start animation loop, don't start game yet
    animate();
    // Listen for game-finished event
    document.addEventListener('game-finished', (event: Event) => {
      console.log('Game finished:', event);
      // Stop the animation loop
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      // Show the instructions dialog again
      showInstructionsDialog();
    })
  } else {
    console.error('Canvas element is not available');
  }
  // Listen for resize events
  window.addEventListener('resize', () => {
    gameEngine?.world3D.onWindowResize()
  });

  // Show instructions dialog
  showInstructionsDialog();
});

onBeforeUnmount(() => {
  // Cancel animation frame to prevent memory leaks
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  // Clean up game engine resources
  if (gameEngine) {
    gameEngine = null;
  }

  // Remove event listeners
  window.removeEventListener('resize', () => {
    gameEngine?.world3D.onWindowResize()
  });

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

.instructions-dialog {
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
}

.start-button {
  font-size: 1.2rem;
  letter-spacing: 1px;
  font-weight: bold;
  border-radius: 4px;
  transition: transform 0.2s;
}

.start-button:hover {
  transform: scale(1.05);
}
</style>
