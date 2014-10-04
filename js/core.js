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


  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshBasicMaterial( { color: 0x00cc00 } );

  var cubeA = new THREE.Mesh( geometry, material );
  var cubeB = new THREE.Mesh( geometry, material );
  var cubeC = new THREE.Mesh( geometry, material );

  cubeB.position.x += 2;
  cubeC.position.x += 4;

  scene.add( cubeA, cubeB, cubeC );

  camera.position.x = 2;
  camera.position.z = 5;

  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
};


start(THREE);
