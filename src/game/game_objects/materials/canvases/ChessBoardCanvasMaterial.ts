import { CanvasMaterial } from 'src/game/game_objects/materials/CanvasMaterial'

export class ChessBoardCanvasMaterial extends CanvasMaterial{
  constructor(width: number = 512, height: number = 512) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    if (!context) {
      throw new Error('Unable to obtain 2D context for the canvas');
    }

    // Set background color
    context.fillStyle = '#f0f0f0';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tile grid
    const tileSize = canvas.width / 10; // 10x10 grid
    context.strokeStyle = '#e0e0e0';
    context.lineWidth = 2;

    // Vertical lines
    for (let x = 0; x <= 10; x++) {
      context.beginPath();
      context.moveTo(x * tileSize, 0);
      context.lineTo(x * tileSize, canvas.height);
      context.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= 10; y++) {
      context.beginPath();
      context.moveTo(0, y * tileSize);
      context.lineTo(canvas.width, y * tileSize);
      context.stroke();
    }

    // Slight texture variation
    context.globalAlpha = 0.05;
    context.fillStyle = 'black';
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if ((x + y) % 2 === 0) {
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
      }
    }
    context.globalAlpha = 1;

    super(canvas, width, height);
  }
}
