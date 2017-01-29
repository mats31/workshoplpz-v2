import States from 'core/States';
import OrbitControls from 'helpers/OrbitControls'
import raf from 'raf';

import Clock from 'helpers/Clock';

import Ground from './Meshes/Ground/Ground';
import ProjectContainer from './Meshes/ProjectContainer/ProjectContainer';

import './webgl.styl';


import template from './webgl.html';

export default Vue.extend({

  template,

  data() {

    return {};
  },

  created() {

    this.setup();

    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    Signals.onWeblGLMousemove.add(this.onWeblGLMousemove);
    Signals.onWeblGLMouseleave.add(this.onWeblGLMouseleave);
  },

  mounted() {

    this.renderer.domElement.style.position = 'absolute';
    this.$refs.container.appendChild(this.renderer.domElement);
  },

  methods: {

    setup() {

      this.rotationEase = 0;
      this.mouse = new THREE.Vector2();

      this.createWebgl(window.innerWidth, window.innerHeight);
      // this.setupEvent();
    },

    createWebgl(width, height) {

      const cameraTarget = new THREE.Vector3(0, 20, 100);
      const cameraPos = new THREE.Vector3(0, 20, -1);

      this.scene = window.scene = new THREE.Scene();

      this.camera = window.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
      this.camera.position.copy(cameraPos);
      this.camera.lookAt(cameraTarget);

      this.renderer = window.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x1a1a1a);
      this.renderer.autoClear = false;
      // this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // this.renderer.antialias = true;

      this.orthographicScene = new THREE.Scene();

      this.orthographicCamera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        -10000,
        10000,
      );
      this.orthographicCamera.position.copy(cameraPos);
      this.orthographicCamera.lookAt(cameraTarget);

      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.camera.lookAt(cameraTarget);
    },

    setupLight() {

      const step = 50;

      for (let i = 0; i < 3; i += 1) {

        for (let j = 0; j < 5; j += 1) {

          const light = new THREE.PointLight( 0x303030, 0.11, 0 );
          light.position.set( ( step * i ) - step, 40, ( step * j ) - ( step * 2 ) );
          light.castShadow = true;
          light.shadow.camera.fov = 50;
          light.shadow.mapSize.width = 2048;
          light.shadow.mapSize.height = 2048;
          light.shadow.bias = 0;


          this.scene.add( light );

          const sphereSize = 1;
          const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
          this.scene.add( pointLightHelper );
        }
      }

      // const light = new THREE.PointLight( 0x303030, 10, 0 );
      // light.position.set( 0, 40, 0);
      // light.castShadow = true;
      // light.shadow.camera.fov = 50;
      // light.shadow.mapSize.width = 2048;
      // light.shadow.mapSize.height = 2048;
      // light.shadow.bias = 0;


      // this.scene.add( light );

      // const sphereSize = 1;
      // const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
      // this.scene.add( pointLightHelper );

      // const light = new THREE.PointLight( 0x303030, 1, 0 );
      // light.position.set( 0, 20, 0 );
      // this.scene.add( light );

      // const sphereSize = 1;
      // const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
      // this.scene.add( pointLightHelper );
    },

    setupProject() {

      this.projectContainer = new ProjectContainer();

      const mask = this.projectContainer.getMask();
      mask.position.set( 0, 20, 15 );

      const projectPlane = this.projectContainer.getProjectPlane();
      projectPlane.position.set( 0, 20, 15 );

      this.scene.add(mask);
      this.orthographicScene.add(projectPlane);
    },

    setupGround() {

      this.ground = new Ground();
      this.ground.rotation.x = Math.PI * -0.5;
      this.scene.add(this.ground);
    },

    /* Events */

    onAssetsLoaded() {

      this.clock = new Clock();

      this.setupGround();
      this.setupProject();
      this.setupLight();
      this.animate();
    },

    onWeblGLMousemove(event) {

      // this.mouse.x = ( ( event.clientX / window.innerWidth ) * 2 ) - 1;
      // this.mouse.y = ( -( event.clientY / window.innerHeight ) * 2 ) + 1;

      this.mouse.x = ( event.clientX - (window.innerWidth * 0.5) ) / ( window.innerWidth * 0.5 );
      this.mouse.y = ( event.clientY - (window.innerHeight * 0.5) ) / ( window.innerHeight * 0.5 );

      this.rotationEase += ( this.mouse.x - this.rotationEase ) * 0.05;
    },

    onWeblGLMouseleave() {

      this.rotationEase = 0;
    },

    /* Update */

    animate() {

      raf(this.animate);

      this.updateCamera();

      this.ground.update( this.clock.time );
      this.projectContainer.update( this.clock.time );

      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
      this.renderer.clearDepth();
      this.renderer.render(this.orthographicScene, this.orthographicCamera);
    },

    updateCamera() {

      this.camera.rotation.y += 0.01 * this.rotationEase;
      // this.orthographicCamera.rotation.y += 0.01 * this.rotationEase;
    },
  },

  components: {},
});
