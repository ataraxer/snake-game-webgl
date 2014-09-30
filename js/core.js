var start = function(THREE) {
  var width = window.innerWidth;
  var height = window.innerHeight;

  var scene = new THREE.Scene();
  var aspect = width / height;
  var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  document.body.appendChild( renderer.domElement );


  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshBasicMaterial( { color: 0x00cc00 } );
  var cube = new THREE.Mesh( geometry, material );
  scene.add( cube ); camera.position.z = 5;


  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }

  render();
};


start(THREE);
