import type * as THREE from 'three'
import type * as CANNON from 'cannon-es'

export class GameObject {
  id: string
  mesh: THREE.Mesh | THREE.Group
  body: CANNON.Body

  constructor(id: string, mesh: THREE.Mesh | THREE.Group, body: CANNON.Body) {
    this.id = id
    this.mesh = mesh
    this.body = body
  }

  update() {
    this.mesh.position.copy(this.body.position)
    this.mesh.quaternion.copy(this.body.quaternion)
  }
}
