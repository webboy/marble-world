import * as THREE from 'three';

export class TextureMaterial extends THREE.MeshStandardMaterial{
  private static TEXTURE_PATH: string = 'src/game/assets/textures/'

  constructor(textureName: string, repeatX: number = 1, repeatY: number = 1) {

    const loader = new THREE.TextureLoader()
    const texture = loader.setPath(TextureMaterial.TEXTURE_PATH).load(textureName)

    // Configure texture properties
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(repeatX, repeatY)

    super({
      map: texture,
      metalness: 0.3,
      roughness: 0.4,
    });
  }
}
