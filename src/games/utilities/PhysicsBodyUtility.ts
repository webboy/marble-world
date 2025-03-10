import * as THREE from 'three'
import * as CANNON from 'cannon-es'

export class PhysicsBodyUtility{
  createTrimeshFromMesh(mesh: THREE.Mesh) {
    const geometry = mesh.geometry
    const positionAttribute = geometry.getAttribute('position')
    const index = geometry.index

    if (!index) {
      console.error('Trimesh requires an indexed geometry!')
      return null
    }

    const vertices = []
    const indices = []

    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3()
      vertex.fromBufferAttribute(positionAttribute, i)
      vertices.push(vertex.x, vertex.y, vertex.z)
    }

    for (let i = 0; i < index.count; i++) {
      indices.push(index.getX(i))
    }

    return new CANNON.Trimesh(vertices, indices)
  }

  createPhysicsFromGroup(group: THREE.Group, mass: number = 1) {
    const compoundBody = new CANNON.Body({ mass });

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const shape = this.createTrimeshFromMesh(child);
        if (!shape) return;

        // Get the local position of the mesh relative to the group
        const offset = new CANNON.Vec3(
          child.position.x,
          child.position.y,
          child.position.z
        );

        // Apply rotation if needed (convert from Three.js to Cannon.js format)
        const quaternion = new CANNON.Quaternion(
          child.quaternion.x,
          child.quaternion.y,
          child.quaternion.z,
          child.quaternion.w
        );

        // Add Trimesh shape to the compound body
        compoundBody.addShape(shape, offset, quaternion);
      }
    });

    return compoundBody;
  }
}
