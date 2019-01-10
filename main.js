const triangle = [
  //[ x,    y,    z]
  [+0.0, +0.5, +1.0],
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
];

const quad = [
  //[ x,    y,    z]
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
  [+0.5, +0.5, +1.0],
  [-0.5, +0.5, +1.0],
];

const triangleStrip = [
  //[ x,    y,    z]
  [-0.5, +0.5, +1.0],
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
  [-0.5, +0.5, +1.0],
  [+0.5, +0.5, +1.0],
  [+0.5, -0.5, +1.0],
];

const box = extractMesh([
  //[x,    y,    z]
  // Front face
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // Bottom face
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // Right face
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0,
]);

const tetrahedra = extractMesh([
  0, 0, -1,
  -1, 0, 0,
  0, -1, 0,
  1, 0, 0,
  0, 1, 0,
  0, 0, 1
]);

let frameCount = 0;
let shape = 0
const shapes = [
  triangle,
  quad,
  triangleStrip,
  box,
  tetrahedra
];

let vertices = translateMesh(shapes[shape], [0, 0, 2]);

function drawFrame() {
  window.requestAnimationFrame(drawFrame);
  frameCount++;

  if (frameCount % 300 === 0) {
    shape = shapes[(frameCount / 300) % shapes.length];
    vertices = translateMesh(shape, [0, 0, 2]);
  }

  clear();

  drawMesh(
    rotateMesh(
      vertices,
      [0, 0, 2], // pivot (the point to rotate around)
      [frameCount / 100, frameCount / 100, frameCount / 100] // the rotation itself [x, y, z]
    ),
    {
      closed: true,
      drawPoints: true
    }
  );
}

drawFrame();