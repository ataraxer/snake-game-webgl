var start = function(THREE) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();
  var distance = 200
  var camera = new THREE.OrthographicCamera(
    width / -distance,
    width / distance,
    height / distance,
    height / -distance,
    1, 1000);

  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setSize(width, height);
  document.body.appendChild( renderer.domElement );

  var field = generateField();

  scene.add(field);

  var geometry = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshBasicMaterial( { color: 0x00cc00 } );

  var cubeA = new THREE.Mesh( geometry, material );
  var cubeB = new THREE.Mesh( geometry, material );
  var cubeC = new THREE.Mesh( geometry, material );

  cubeB.position.x -= 2;
  cubeC.position.x += 2;

  cubeA.position.z += 1;
  cubeB.position.z += 1;
  cubeC.position.z += 1;

  scene.add( cubeA, cubeB, cubeC );

  camera.position.z = 10;

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  var controls = new THREE.OrbitControls(camera);

  render();
};


var generateField = function () {
  var geometry = new THREE.PlaneGeometry(100, 100);

  var material = new THREE.MeshBasicMaterial({
    color: 0xfefefe,
    side: THREE.DoubleSide
  });

  var plane = new THREE.Mesh(geometry, material);

  return plane;
}


start(THREE);
