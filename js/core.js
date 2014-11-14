var start = function(THREE) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var camera = generateCamera({
    perspective: false,
    width: width,
    height: height,
    distance: 75,
  });

  positionCamera(camera);

  //var controls = new THREE.OrbitControls(camera);

  var scene = generateScene(THREE, {
    width: width,
    height: height,
  });

  var renderer = generateRenderer(THREE, {
    width: width,
    height: height,
  });


  var snake = Snake(21, [
    Position(1, 10),
    Position(2, 10),
    Position(3, 10),
    Position(4, 10),
    Position(5, 10),
  ]);


  var SECOND = 1000;
  var FRAME_RATE = 60;
  var DIFFICULTY = 2;

  var rendered = renderSnake(snake, scene);
  var frame = 0;
  var food = Position(10, 10);
  var foodCube;

  var pause = false;

  var gameLoop = function () {
    if (pause) return;
    frame += 1;
  };

  setInterval(gameLoop, SECOND / FRAME_RATE);

  var randomCoord = function () {
    return (Math.random() * 20) | 0;
  };

  var randomPosition = function () {
    return Position(randomCoord(), randomCoord());
  };


  var updateState = function () {
    // render food
    opacity = Math.cos(frame * Math.PI / FRAME_RATE) / 4 + 0.75;
    if (foodCube) scene.remove(foodCube);
    foodCube = renderPiece(scene, food, 0x5f87ff, opacity);

    // render snake
    if (frame % (FRAME_RATE / DIFFICULTY) == 0) {
      var tailCube = rendered.shift();
      scene.remove(tailCube);
      var head = snake.move();
      if (head.eq(food)) {
        do {
          food = randomPosition();
        } while (snake.contains(food));
      }
      var headCube = renderPiece(scene, head);
      rendered.push(headCube);
    }
  };


  var render = function () {
    requestAnimationFrame(render);
    updateState();
    renderer.render(scene, camera);
    displayCameraPosition(camera);
  };

  render();


  window.onblur  = function() { pause = true; }
  window.onfocus = function() { pause = false; }

  document.onkeydown = function () {
    switch (window.event.keyCode) {
      case 40:  // down
      case 37:  // left
        snake.left();
        break;
      case 38:  // up
      case 39:  // right
        snake.right();
        break;
      case 32:  // space
        pause = !pause;
        break;
    }
  };
};


var renderPiece = function (scene, piece, color, opacity) {
  var shift = 10;
  var size = 0.8;
  var margin = 0.1;
  var step = size + (margin * 2);
  var cube = generateCube(size, color, opacity);

  cube.position.x = piece.x * step - shift;
  cube.position.y = piece.y * step - shift;
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


var positionCamera = function (camera) {
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

  return camera;
};


var generateRenderer = function (THREE, options) {
  var width = options.width;
  var height = options.height;

  var renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(width, height);
  document.body.appendChild( renderer.domElement );

  return renderer;
};


var generateScene = function (THREE, options) {
  var width = options.width;
  var height = options.height;

  var scene = new THREE.Scene();

  var field = generateField(21, 21);
  scene.add(field);

  var lightSource = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
  scene.add(lightSource);

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


var generateCube = function (side, color, opacity) {
  var geometry = new THREE.BoxGeometry(side, side, side);
  var material = new THREE.MeshPhongMaterial({
    color: color || 0x00cc00,
    transparent: !!opacity,
    opacity: opacity || 1,
    shading: THREE.SmoothShading
  });

  var cube = new THREE.Mesh(geometry, material);

  return cube;
};


start(THREE);
