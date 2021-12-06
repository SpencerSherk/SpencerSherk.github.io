import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { WEBGL } from './webgl'
// import './modal'

if (WEBGL.isWebGLAvailable()) {
  var camera, scene, renderer
  var plane
  var mouse,
    raycaster,
    isShiftDown = false

  var rollOverMesh, rollOverMaterial
  var cubeGeo, cubeMaterial

  var objects = []

  var stats;
  var controls;

  

  init()
  render()
  animate()

  function init() {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    )
    camera.position.set(500, 800, 1300)
    camera.lookAt(0, 0, 0)

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)

    // stats = new Stats()
    // stats.update();
    // document.body.appendChild(stats.dom)
    
    cubeGeo = new THREE.BoxBufferGeometry(50, 50, 50)
    cubeMaterial = new THREE.MeshLambertMaterial({
      color: 0xfeb74c,
      map: new THREE.TextureLoader().load('static/textures/square.png'),
    })

    // var gridHelper = new THREE.GridHelper(8000, 160)
    // scene.add(gridHelper)

    raycaster = new THREE.Raycaster()
    mouse = new THREE.Vector2()

    var geometry = new THREE.PlaneBufferGeometry(8000, 8000)
    geometry.rotateX(-Math.PI / 2)

    plane = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ visible: false })
    )
    scene.add(plane)

    objects.push(plane)

    var ambientLight = new THREE.AmbientLight(0x606060)
    scene.add(ambientLight)

    var directionalLight = new THREE.DirectionalLight(0xffffff)
    directionalLight.position.set(1, 0.75, 0.5).normalize()
    scene.add(directionalLight)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    // Orbit Controls configs
    controls   = new OrbitControls (camera, renderer.domElement)
    controls.enableDamping = true;
    controls.dampingFactor = 0.10;
    controls.enablePan     = false;
    // controls.minDistance   = 1;
    // controls.maxDistance   = 10;

    document.addEventListener('mousemove', onDocumentMouseMove, false)
    document.addEventListener('mousedown', onDocumentMouseDown, false)
    document.addEventListener('keydown', onDocumentKeyDown, false)
    document.addEventListener('keyup', onDocumentKeyUp, false)
    window.addEventListener('resize', onWindowResize, false)
  }

  function animate() {

    // stats.begin();
    // stats.update()
    // stats.end();
  
    // controls.update();
    
    requestAnimationFrame( animate );
  
  }
  
  requestAnimationFrame( animate );

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onDocumentMouseMove(event) {
    event.preventDefault()

    render()

  }

  function onDocumentMouseDown(event) {
    event.preventDefault()

    mouse.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    var intersects = raycaster.intersectObjects(objects)

    if (objects.length < 10) {
      console.log("adding curves to scene...")
      var intersect = intersects[0]

      if (isShiftDown) {
        if (intersect.object !== plane) {
          scene.remove(intersect.object)

          objects.splice(objects.indexOf(intersect.object), 1)
        }

      } else {

        // x 2
        var max = 475
        var min = -3975
        var step = 50

        for (let i=0;i<160;i++) {

          for (let j=0;j<160;j++) {

            const curve = new THREE.CubicBezierCurve3(
              new THREE.Vector3( -10, 0, 0 ),
              new THREE.Vector3( -5, 15, 0 ),
              new THREE.Vector3( 20, 15, 0 ),
            );
            
            const points = curve.getPoints( 50 )
            const lineGeometry = new THREE.BufferGeometry().setFromPoints( points )
            const lineMaterial = new THREE.LineBasicMaterial( { color : 0xff0000 } )
    
            // Create the final object to add to the scene
            const line = new THREE.Line( lineGeometry, lineMaterial )
    
            line.position.copy(new THREE.Vector3((min + step * i), 25 , (min + step * j)))
    
            scene.add(line)
    
            objects.push(line)

          }

        }

      }

      render()

    }

  }

  function onDocumentKeyDown(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = true
        break
    }
  }

  function onDocumentKeyUp(event) {
    switch (event.keyCode) {
      case 16:
        isShiftDown = false
        break
    }
  }

  function render() {
    renderer.render(scene, camera)
  }
} else {
  var warning = WEBGL.getWebGLErrorMessage()
  document.body.appendChild(warning)
}
