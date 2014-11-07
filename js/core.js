var start = function(THREE) {
  var scene = generateScene(THREE);

  var snake = Snake([
    Position(1, 10),
    Position(2, 10),
    Position(3, 10),
    Position(4, 10),
    Position(5, 10),
  ]);

  var rendered = renderSnake(snake, scene);

  setInterval(function () {
    var tailCube = rendered.shift();
    scene.remove(tailCube);
    var head = snake.move();
    var headCube = renderPiece(scene, head)
    rendered.push(headCube);
  }, 500);
};


var renderPiece = function (scene, piece) {
  var shift = 10;
  var size = 0.8;
  var margin = 0.1;
  var step = size + (margin * 2);
  var cube = generateCube(size);

  cube.position.x = piece.x * step - shift + (size / 2) + margin;
  cube.position.y = piece.y * step - shift + (size / 2) + margin;
  cube.position.z = size / 2;

  scene.add(cube);

  return cube;
};


var renderSnake = function (snake, scene) {
  var pieces = snake.pieces;

  var rendered = [];

  for (pieceIndex in pieces) {
    var piece = pieces[pieceIndex];
    var cube = renderPiece(scene, piece);
    rendered.push(cube);
  }

  return rendered;
};


var generateScene = function (THREE) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();

  var camera = generateCamera({
    perspective: false,
    width: width,
    height: height,
    distance: 75
  });

  var shift = 35;

  camera.position.x = shift;
  camera.position.y = -shift;
  camera.position.z = 49.5;

  camera.rotateOnAxis(
    (new THREE.Vector3(0, 0, 1)).normalize(),
    45 * Math.PI / 180);

  camera.rotateOnAxis(
    (new THREE.Vector3(1, 0, 0)).normalize(),
    45 * Math.PI / 180);

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });

  renderer.setSize(width, height);
  document.body.appendChild( renderer.domElement );

  var field = generateField(21, 21);

  scene.add(field);

  var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    displayCameraPosition(camera);
  }

  var lightSource = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  scene.add(lightSource);

  //var controls = new THREE.OrbitControls(camera);

  render();

  return scene;
};


var generateCamera = function (options) {
  var camera;
  var distance = options.distance;
  var width = options.width;
  var height = options.height;

  if (options.perspective === true) {
    var aspect = width / height;
    camera = new THREE.PerspectiveCamera(distance, aspect, 0.1, 1000);
  } else {
    camera = new THREE.OrthographicCamera(
      width / -distance,
      width / distance,
      height / distance,
      height / -distance,
      1, 1000);
  }

  return camera;
};


var vectorToString = function (vector) {
  var coords = [vector.x, vector.y, vector.z];
  return 'Vector(' + coords.join(', ') + ')';
};


var displayCameraPosition = function (camera) {
  var up = 'up: ' + vectorToString(camera.up);
  var position = 'position: ' + vectorToString(camera.position);
  var rotation = 'rotation: ' + [
    camera.rotation._x,
    camera.rotation._y,
    camera.rotation._z,
  ].join(', ');
  var text = [up, position, rotation].join('<br/>');
  $('#infobox').html(text);
};


var generateField = function(x, y) {
  var geometry = new THREE.PlaneGeometry(x, y);

  var material = new THREE.MeshBasicMaterial({
    color: 0xfefefe,
    side: THREE.DoubleSide
  });

  var plane = new THREE.Mesh(geometry, material);

  return plane;
};


var generateCube = function (side) {
  var geometry = new THREE.BoxGeometry(side, side, side);
  var material = new THREE.MeshPhongMaterial({
    color: 0x00cc00,
    shading: THREE.SmoothShading
  });

  var cube = new THREE.Mesh(geometry, material);

  return cube;
};


start(THREE);
