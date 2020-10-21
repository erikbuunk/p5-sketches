// Constants -----------------------------
const WIDTH = 800
const HEIGHT = 600


// Global Variables -----------------------------

let matProj;
let fTheta;
let mesh;

// Functions ----------------------------------

function createMesh() {
  
  let tris = [
    // SOUTH
    [0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0],
    [0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0],

    // EAST                                                     
    [1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0],
    [1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0],

    // NORTH                                                     
    [1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0],
    [1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0],

    // WEST                                                     
    [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0],
    [0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0],

    // TOP                                                       
    [0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0],
    [0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0],

    // BOTTOM                                                   
    [1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0],
    [1.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0]

  ];

  let mesh = new Mesh()

  for (let t of tris) {

    const p1 = createVector(t[0], t[1], t[2]);
    const p2 = createVector(t[3], t[4], t[5]);
    const p3 = createVector(t[6], t[7], t[8]);

    const tri = new Triangle(p1, p2, p3)

    mesh.addTriangle(tri);
  }

  return mesh;
}


function setupProjectionMatrix(fNear, fFar, fFov) {
  let matProj = new Mat4x4()
  
  const fAspectRatio = HEIGHT / WIDTH;
  const fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180.0 * Math.PI);

  matProj.m[0][0] = fAspectRatio * fFovRad;
  matProj.m[1][1] = fFovRad;
  matProj.m[2][2] = fFar / (fFar - fNear);
  matProj.m[3][2] = (-fFar * fNear) / (fFar - fNear);
  matProj.m[2][3] = 1.0;
  matProj.m[3][3] = 0.0;

  return matProj;
}

function MultiplyMatrixVector(i, m) {
  
  let o = createVector()
  o.x = i.x * m.m[0][0] + i.y * m.m[1][0] + i.z * m.m[2][0] + m.m[3][0];
  o.y = i.x * m.m[0][1] + i.y * m.m[1][1] + i.z * m.m[2][1] + m.m[3][1];
  o.z = i.x * m.m[0][2] + i.y * m.m[1][2] + i.z * m.m[2][2] + m.m[3][2];
  let w = i.x * m.m[0][3] + i.y * m.m[1][3] + i.z * m.m[2][3] + m.m[3][3];

  if (w != 0.0) {
    o.x /= w;
    o.y /= w;
    o.z /= w;
  }
  return o;
}


// P5 setup and draw ---------------------
function setup() {
  createCanvas(WIDTH, HEIGHT);
  fTheta = 0;
  mesh = createMesh();
  matProj = setupProjectionMatrix(fNear=0.1, fFar=100.0, fFov=90.0);
}

function draw() {
  background(0);  
  
  // Set up rotation matrices
  let matRotZ = new Mat4x4();
  let matRotX = new Mat4x4();
  fTheta += 0.01;

  // Rotation Z
  matRotZ.m[0][0] = Math.cos(fTheta);
  matRotZ.m[0][1] = Math.sin(fTheta);
  matRotZ.m[1][0] = -Math.sin(fTheta);
  matRotZ.m[1][1] = Math.cos(fTheta);
  matRotZ.m[2][2] = 1;
  matRotZ.m[3][3] = 1;

  // Rotation X
  matRotX.m[0][0] = 1;
  matRotX.m[1][1] = Math.cos(fTheta * 0.5);
  matRotX.m[1][2] = Math.sin(fTheta * 0.5);
  matRotX.m[2][1] = -Math.sin(fTheta * 0.5);
  matRotX.m[2][2] = Math.cos(fTheta * 0.5);
  matRotX.m[3][3] = 1;

  // Draw Triangles

  for (let tri of mesh.tris) {

    let triProjected = new Triangle();
    let triTranslated = new Triangle();
    let triRotatedZ = new Triangle();
    let triRotatedZX = new Triangle();

    // Rotate in Z-Axis
    triRotatedZ.p[0] = MultiplyMatrixVector(tri.p[0], matRotZ);
    triRotatedZ.p[1] = MultiplyMatrixVector(tri.p[1], matRotZ);
    triRotatedZ.p[2] = MultiplyMatrixVector(tri.p[2], matRotZ);

    // Rotate in X-Axis
    triRotatedZX.p[0] = MultiplyMatrixVector(triRotatedZ.p[0], matRotX);
    triRotatedZX.p[1] = MultiplyMatrixVector(triRotatedZ.p[1], matRotX);
    triRotatedZX.p[2] = MultiplyMatrixVector(triRotatedZ.p[2], matRotX);

    // Offset into the screen
    triTranslated = triRotatedZX;
    triTranslated.p[0].z = triRotatedZX.p[0].z + 3.0;
    triTranslated.p[1].z = triRotatedZX.p[1].z + 3.0;
    triTranslated.p[2].z = triRotatedZX.p[2].z + 3.0;

    // Project triangles from 3D --> 2D
    triProjected.p[0] = MultiplyMatrixVector(triTranslated.p[0], matProj);
    triProjected.p[1] = MultiplyMatrixVector(triTranslated.p[1], matProj);
    triProjected.p[2] = MultiplyMatrixVector(triTranslated.p[2], matProj);

    // Scale into view
    triProjected.p[0].x += 1.0;
    triProjected.p[0].y += 1.0;
    triProjected.p[1].x += 1.0;
    triProjected.p[1].y += 1.0;
    triProjected.p[2].x += 1.0;
    triProjected.p[2].y += 1.0;

    triProjected.p[0].x *= 0.5 * WIDTH;
    triProjected.p[0].y *= 0.5 * HEIGHT;
    triProjected.p[1].x *= 0.5 * WIDTH;
    triProjected.p[1].y *= 0.5 * HEIGHT;
    triProjected.p[2].x *= 0.5 * WIDTH;
    triProjected.p[2].y *= 0.5 * HEIGHT;
    
    // draw the triangle
    stroke('#fff');
    fill('#ccc');
    triangle(
      triProjected.p[0].x, triProjected.p[0].y,
      triProjected.p[1].x, triProjected.p[1].y,
      triProjected.p[2].x, triProjected.p[2].y);
  }

}