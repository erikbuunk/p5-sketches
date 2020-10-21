// CLASSES ---------------------------------

// triangle class, for the mesh
class Triangle {
  constructor(p1, p2, p3) {
    this.p = []
    this.p.push(p1)
    this.p.push(p2)
    this.p.push(p3)
  }

};


// Mesh build by triangles
class Mesh {
  constructor() {
    this.tris = [];
  }

  addTriangle(t) {
    this.tris.push(t)
  }

};


// 4x4 matrix
class Mat4x4 {
  constructor() {
    this.m = []
    this.m[0] = [0, 0, 0, 0]
    this.m[1] = [0, 0, 0, 0]
    this.m[2] = [0, 0, 0, 0]
    this.m[3] = [0, 0, 0, 0]

  }
};