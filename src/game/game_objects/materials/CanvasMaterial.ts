import * as THREE from 'three';

export class CanvasMaterial extends THREE.MeshStandardMaterial{
  constructor(canvas: HTMLCanvasElement, width: number, height: number) {

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    // Adjust the texture scaling to ensure square tiles
    // The scaling factor ensures the texture repeats proportionally to width and height
    const textureRepeatX = width / 10; // Scale proportional to board width
    const textureRepeatY = height / 10; // Scale proportional to board height
    texture.repeat.set(textureRepeatX, textureRepeatY);

    super({
      map: texture,
      metalness: 0.3,
      roughness: 0.4,
    });
  }
}
