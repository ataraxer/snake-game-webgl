var start = function(THREE) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  /* ==== Game Logic ==== */
  var DIFFICULTY = 6;

  var generateSnake = function () {
    return Snake(21, [
      Position(1, 10),
      Position(2, 10),
      Position(3, 10),
      Position(4, 10),
      Position(5, 10),
    ]);
  };

  var randomCoord = function () {
    return (Math.random() * 20) | 0;
  };

  var randomPosition = function () {
    return Position(randomCoord(), randomCoord());
  };

  var snake = generateSnake();
  var food = Position(10, 10);
  var score = 0;


  /* ==== Rendering logic ==== */
  var SECOND = 1000;
  var FRAME_RATE = 60;

  var engine = generateEngine({
    width: width,
    height: height,
  });

  var frame = 0;
  var pause = false;

  var frameLoop = function () {
    if (pause) return;
    frame += 1;
  };

  setInterval(frameLoop, SECOND / FRAME_RATE);


  var updateState = function () {
    snake.move();

    if (snake.hasCollided()) {
      snake = generateSnake();
      score = 0;
      // skip everything else
      return;
    }

    if (snake.head().eq(food)) {
      snake.eat(food);
      score += 1;
      do {
        food = randomPosition();
      } while (snake.contains(food));
    }
  };


  var render = function () {
    requestAnimationFrame(render);
    var stateUpdated = frame % (FRAME_RATE / DIFFICULTY) == 0
    if (stateUpdated) updateState();
    engine.render(stateUpdated, snake, food, score, frame, FRAME_RATE);
    snake.moved = false;
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


var generateEngine = function (options) {
  var width = options.width;
  var height = options.height;

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

  var foodCube;
  var renderedPieces;
  var previousPieces;
  var prevScore = 0;
  var scorePieces = [];
  var lastFrame = Date.now();
  var lastShow = lastFrame;

  return {
    render: function (stateUpdated, snake, food, score, frame, FRAME_RATE) {
      this.updateScene(stateUpdated, snake, food, score, frame, FRAME_RATE);
      renderer.render(scene, camera);
      var now = Date.now();
      if ((now - lastShow) > 250) {
        var fps = 1000 / (now - lastFrame) | 0;
        displayFPS(fps)
        lastShow = now;
      }
      lastFrame = now;
    },


    updateScene: function (stateUpdated, snake, food, score, frame, FRAME_RATE) {
      // render food
      var opacity = Math.cos(frame * Math.PI / FRAME_RATE) / 4 + 0.75;
      if (foodCube) scene.remove(foodCube);
      foodCube = renderPiece(scene, food, 0x5f87ff, opacity);

      if (score == 0) {
        scorePieces.map(function (item) {
          scene.remove(item);
        });
      }

      if (score > prevScore) {
        var position = Position(-1, score - 1);
        var scoreCube = renderPiece(scene, position, 0x5f87ff);
        scorePieces.push(scoreCube);
      }

      prevScore = score;

      if (!stateUpdated) return;

      // render snake
      if (!renderedPieces) {
        renderedPieces = previousPieces = renderSnake(snake, scene);
      }
      previousPieces = renderedPieces.keySeq().toSet();
      var currentPieces = Immutable.Set(snake.pieces);

      var removed = currentPieces.subtract(previousPieces);
      var added = previousPieces.subtract(currentPieces);

      added.forEach(function (item) {
        var cube = renderedPieces.get(item);
        scene.remove(cube);
        renderedPieces = renderedPieces.remove(item);
      });

      removed.forEach(function (item) {
        var cube = renderPiece(scene, item);
        scene.add(cube);
        renderedPieces = renderedPieces.set(item, cube);
      });
    },
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

  var rendered = Immutable.Map();

  for (pieceIndex in pieces) {
    var piece = pieces[pieceIndex];
    var cube = renderPiece(scene, piece);
    rendered = rendered.set(piece, cube);
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


var displayFPS = function (fps) {
  var text = "FPS: " + fps;
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
