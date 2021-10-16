// (c) JONAS KARG 2019

/** TODO:
 *
 * Warped image when canvas "width : height !== 1 : 1"
 * (not really a bug)
 */

const FOCAL_LENGTH = 1;   // FOV / ZOOM
const CLIPPING_BOUNDS = 1.4;

let WIDTH = 0;
let HEIGHT = 0;
let HALF_WIDTH = 0;
let HALF_HEIGHT = 0;

const DEFAULT_DRAW_MESH_OPTIONS = {
  drawPoints: false,
  drawLines: true,
  lineWidth: 1,
  pointSize: 10,
  closed: false,
};

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
  if (!point) return point;

  // absolute = center + center * scale
  const absoluteX = HALF_WIDTH + HALF_WIDTH * -point[0]; // - to flip coordinate system
  const absoluteY = HALF_HEIGHT + HALF_HEIGHT * -point[1];

  return [absoluteX, absoluteY];
}

function drawMesh(vertices, _options) {
  const options = Object.assign(DEFAULT_DRAW_MESH_OPTIONS, _options);
  const projected = projectVertices(vertices)
    .map(vertex => {
      if (vertex[0] < -CLIPPING_BOUNDS
        || vertex[0] > CLIPPING_BOUNDS
        || vertex[1] < -CLIPPING_BOUNDS
        || vertex[1] > CLIPPING_BOUNDS) return null;

      return vertex;
    });

  let absolute = projected.map(getPointAbsolute);
  // const start = absolute.shift();

  c.beginPath();

  if (options.drawLines) {
    c.lineWidth = options.lineWidth;

    for (let i = 1; i < absolute.length; i++) {
      if (!absolute[i]) {
        if (absolute[i + 1]) {
          c.moveTo(absolute[i + 1][0], absolute[i + 1][1]);
        }

        continue;
      }

      c.lineTo(absolute[i][0], absolute[i][1]);
    }
  }

  if (options.drawPoints) {
    const POINT_SIZE = options.pointSize;
    const HALF_POINT_SIZE = POINT_SIZE / 2;

    absolute.map(point => {
      c.fillRect(
        point[0] - HALF_POINT_SIZE,
        point[1] - HALF_POINT_SIZE,
        POINT_SIZE,
        POINT_SIZE
      );
    });
  }

  if (options.closed && absolute[0] !== null) {
    console.log('test')
    c.lineTo(absolute[0][0], absolute[0][1]);
  }

  c.stroke();
}

function translateMesh(vertices, offset) {
  const offsetX = offset[0];
  const offsetY = offset[1];
  const offsetZ = offset[2];

  return vertices.map(vertex => [
    vertex[0] + offsetX,
    vertex[1] + offsetY,
    vertex[2] + offsetZ
  ]);
}

function rotate3D(point, pivot, rot) {
  const x = point[0] - pivot[0];
  const y = point[1] - pivot[1];
  const z = point[2] - pivot[2];

  const rotX = rot[0];
  const rotY = rot[1];
  const rotZ = rot[2];

  let newX = x;
  let newY = y;
  let newZ = z;

  if (rotX !== 0) {
    const s = Math.sin(rotX);
    const c = Math.cos(rotX);
    const tempY = newY;

    newY = newY * c - newZ * s;
    newZ = newZ * c + tempY * s;
  }

  if (rotY !== 0) {
    const s = Math.sin(rotY);
    const c = Math.cos(rotY);
    const tempX = newX;

    newX = newX * c - newZ * s;
    newZ = newZ * c + tempX * s;
  }

  if (rotZ !== 0) {
    const s = Math.sin(rotZ);
    const c = Math.cos(rotZ);
    const tempX = newX;

    newX = newX * c - newY * s;
    newY = newY * c + tempX * s;
  }

  return [
    newX + pivot[0],
    newY + pivot[1],
    newZ + pivot[2]
  ];
}

function rotateMesh(mesh, pivot, rot) {
  return mesh.map(vertex => rotate3D(vertex, pivot, rot));
}

function clear() {
  c.clearRect(0, 0, WIDTH, HEIGHT);
}

function extractMesh(arr) {
  const res = [];

  while (arr.length) {
    res.push(arr.splice(0, 3));
  }

  return res;
}