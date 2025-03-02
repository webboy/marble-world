import * as THREE from 'three'
import type * as CANNON from 'cannon-es'

export class GameObject {
  id: string
  mesh: THREE.Mesh | THREE.Group
  body: CANNON.Body

  constructor(id: string, mesh: THREE.Mesh | THREE.Group, body: CANNON.Body) {
    this.id = id
    this.mesh = mesh
    this.body = body

    //If mash is a group, set shadows for all children
    if (mesh instanceof THREE.Group) {
      mesh.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })
    } else {
      mesh.castShadow = true
      mesh.receiveShadow = true
    }
  }

  update() {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
  }
}
