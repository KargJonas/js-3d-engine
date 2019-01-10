const triangle = [
  //[   x,    y,    z]
  [+0.0, +0.5, +1.0],
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0]
];

const quad = [
  //[   x,    y,    z]
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
  [+0.5, +0.5, +1.0],
  [-0.5, +0.5, +1.0],
];

const triangleStrip = [
  //[   x,    y,    z]
  [-0.5, +0.5, +1.0],
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
  [-0.5, +0.5, +1.0],
  [+0.5, +0.5, +1.0],
  [+0.5, -0.5, +1.0],
];

const box = [
  //[   x,    y,    z]
  [-0.5, -0.5, +1.0],
  [+0.5, -0.5, +1.0],
  [+0.5, +0.5, +1.0],
  [-0.5, +0.5, +1.0],

  [-0.5, +0.5, +2.0],
  [+0.5, +0.5, +2.0],
  [+0.5, -0.5, +2.0],
  [-0.5, -0.5, +2.0],
];

// const translatedVertices = translateMesh(
//   myVertices,
//   [.5, .5, 0] // the translation
// );

// const rotatedVertices = rotateMesh(
//   myVertices,
//   [0, 0, 0], // pivot (the point to rotate around)
//   [0, 0, 0] // the rotation itself [x, y, z]
// );

let frameCount = 0;

function drawFrame() {
  window.requestAnimationFrame(drawFrame);
  frameCount++;
  clear();

  drawMesh(
    rotateMesh(
      box,
      [0, 0, 1.5], // pivot (the point to rotate around)
      [0, frameCount / 100, frameCount / 100] // the rotation itself [x, y, z]
    ),
    {
      closed: true,
      drawPoints: true
    }
  );
}

drawFrame();