const FOCAL_LENGTH = 1;   // FOV

let WIDTH = 0;
let HEIGHT = 0;
let HALF_WIDTH = 0;
let HALF_HEIGHT = 0;

const cnv = document.querySelector("canvas");
const c = cnv.getContext("2d");

function maxCnv() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  HALF_WIDTH = WIDTH / 2;
  HALF_HEIGHT = HEIGHT / 2;

  cnv.setAttribute("width", WIDTH);
  cnv.setAttribute("height", HEIGHT);
}

maxCnv();
window.addEventListener("resize", maxCnv);

const myVertices = [
  [.5, .5, 1],
  [-.5, -.5, 1]
];

// DistanceScaleFactor = focalLength / distanceToLense
function getScaleFactor(z) {
  return FOCAL_LENGTH / z;
}

// [x, y, z] => [x, y]
function projectPoint(point) {
  const scaleFactor = getScaleFactor(point[2]);
  const scaledX = point[0] * scaleFactor;
  const scaledY = point[1] * scaleFactor;

  return [scaledX, scaledY];
}

function projectVertices(vertices) {
  return vertices.map(projectPoint);
}

function getPointAbsolute(point) {
  // absolute = center + center * scale
  const absoluteX = HALF_WIDTH + HALF_WIDTH * -point[0]; // - to flip coordinate system
  const absoluteY = HALF_HEIGHT + HALF_HEIGHT * -point[1];

  return [absoluteX, absoluteY];
}

function drawMesh(vertices) {
  const projected = projectVertices(vertices);
  let absolute = projected.map(getPointAbsolute);

  const start = absolute.shift();
  c.moveTo(start[0], start[1]);

  absolute.map(point => {
    c.lineTo(point[0], point[1]);
  });

  // c.lineTo(start[0], start[1]); // Closed shape

  c.stroke();
}

drawMesh(myVertices);