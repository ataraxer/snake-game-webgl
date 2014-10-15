var start = function(THREE) {
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
  camera.position.z = 50;

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

  var field = generateField(20, 20);

  scene.add(field);


  var cubeA = generateCube();
  var cubeB = generateCube();
  var cubeC = generateCube();

  cubeB.position.x -= 2;
  cubeC.position.x += 2;

  cubeA.position.z += 1;
  cubeB.position.z += 1;
  cubeC.position.z += 1;

  scene.add( cubeA, cubeB, cubeC );


  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    displayCameraPosition(camera);
  }

  //var controls = new THREE.OrbitControls(camera);

  render();
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


var generateCube = function() {
  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial( { color: 0x00cc00 } );

  var cube = new THREE.Mesh(geometry, material);

  return cube;
};


start(THREE);
