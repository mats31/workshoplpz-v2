import States from 'core/States';
import OrbitControls from 'helpers/OrbitControls'
import raf from 'raf';

import Clock from 'helpers/Clock';

import Ground from './Meshes/Ground/Ground';

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
  },

  mounted() {

    this.renderer.domElement.style.position = 'absolute';
    this.$refs.container.appendChild(this.renderer.domElement);
  },

  methods: {

    setup() {

      this.mouse = new THREE.Vector2();

      this.createWebgl(window.innerWidth, window.innerHeight);
      // this.setupEvent();
    },

    createWebgl(width, height) {

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
      this.camera.position.z = -50;
      // this.camera.lookAt(new THREE.Vector3());

      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x1a1a1a);
      this.renderer.antialias = true;

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    },

    setupEvent() {

      this.renderer.domElement.addEventListener('mousemove', this.onMousemove.bind(this));
    },

    setupLight() {

      const light = new THREE.PointLight( 0xff0000, 1, 1000 );
      light.position.set( 10, 10, 0 );
      this.scene.add( light );

      const sphereSize = 1;
      const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
      this.scene.add( pointLightHelper );
    },

    setupGround() {

      this.ground = new Ground();
      this.ground.rotation.x = Math.PI * -0.5;
      this.ground.position.y = -10;
      this.scene.add(this.ground);
    },

    /* Events */

    onAssetsLoaded() {

      this.clock = new Clock();

      this.setupLight();
      this.setupGround();
      this.animate();
    },

    onMousemove(event) {

      // this.mouse.x = ( ( event.clientX / window.innerWidth ) * 2 ) - 1;
      // this.mouse.y = ( -( event.clientY / window.innerHeight ) * 2 ) + 1;

      this.mouse.x = event.clientX - (window.innerWidth * 0.5);
      this.mouse.y = event.clientY - (window.innerHeight * 0.5);
    },

    /* Update */

    animate() {

      raf(this.animate);

      this.ground.update( this.clock.time );

      this.renderer.render(this.scene, this.camera);
    },
  },

  components: {},
});
