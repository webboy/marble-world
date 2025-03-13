<template>
  <q-page class="q-pa-none">
    <!-- Canvas for game rendering -->
    <canvas ref="canvas"></canvas>

    <!-- Instructions dialog -->
    <q-dialog
      v-model="showInstructions"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="instructions-dialog">
        <q-card-section class="text-center q-pt-lg">
          <h4 class="text-weight-bold q-mt-none q-mb-md">Grass world!!!</h4>
        </q-card-section>

        <q-card-section class="q-px-lg">
          <p>Welcome to the grass world:</p>
          <ul>
            <li>Collect power-ups along the way</li>
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
            @click="gameStart"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { MarbleRacerGameEngine } from 'src/games/marble_racer/MarbleRacerGameEngine'
import { GameWorldType } from 'src/games/marble_racer/types/game'

// Canvas reference
const canvas = ref<HTMLCanvasElement>()

// Show instructions dialog
const showInstructions = ref(true)

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
  if (gameEngine) {
    console.log('Game engine initialized')
    gameEngine.start()
    // Listen for game-finished event
    document.addEventListener('game-finished', (event: Event) => {
      console.log('Game finished:', event);
    })
    // Hide the instructions dialog
    showInstructions.value = false
  }
}

onMounted(() => {
  // Initialize the game engine
  gameEngine = new MarbleRacerGameEngine()
  if (gameEngine && canvas.value) {
    gameEngine.init(canvas.value, GameWorldType.GRASS)
    animate()
  }

  // Listen for resize events
  window.addEventListener('resize', () => {
    gameEngine?.onWindowResize()
  });

  console.log('Game page mounted')
})

onBeforeUnmount(() => {})
</script>

<style scoped>
</style>
