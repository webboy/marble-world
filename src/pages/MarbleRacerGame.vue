<template>
  <q-page class="game-page q-pa-none">
    <!-- Canvas for game rendering -->
    <canvas ref="canvas" class="game-canvas"></canvas>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MarbleRacerGameEngine } from 'src/games/marble_racer/MarbleRacerGameEngine'
import { GameWorldType } from 'src/games/marble_racer/types/game'

// Canvas reference
const canvas = ref<HTMLCanvasElement>()

// Game engine reference (will be properly typed later)
let gameEngine: MarbleRacerGameEngine | null = null

const animate = () => {
  // Update the game engine
  if (gameEngine) {
    gameEngine.loop()
  }
  // Request the next animation frame
  requestAnimationFrame(animate)
}

const gameStart = () => {
  console.log('Game started')
  if (gameEngine && canvas.value) {
    console.log('Game engine initialized')
    gameEngine.init(canvas.value, GameWorldType.GRASS)
    animate()
  }
}

onMounted(() => {
  // Initialize the game engine
  gameEngine = new MarbleRacerGameEngine()
  gameStart()

  // Listen for resize events
  window.addEventListener('resize', () => {
    gameEngine?.onWindowResize()
  });

  console.log('Game page mounted')
})

onBeforeUnmount(() => {})
</script>

<style scoped>
.game-page {
  position: relative;
  width: 100%;
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

.instructions-dialog,
.game-over-dialog {
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
}

.start-button,
.restart-button {
  font-size: 1.2rem;
  letter-spacing: 1px;
  font-weight: bold;
  border-radius: 4px;
  transition: transform 0.2s;
}

.start-button:hover,
.restart-button:hover {
  transform: scale(1.05);
}

.score-value {
  font-size: 1.5rem;
  font-weight: bold;
  padding: 8px 16px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}
</style>
