import States from 'core/States';
import OrbitControls from 'helpers/OrbitControls'
import raf from 'raf';

import Clock from 'helpers/Clock';

import Ground from './Meshes/Ground/Ground';
import ProjectContainer from './Meshes/ProjectContainer/ProjectContainer';

import projects from 'config/projects';

import './webgl.styl';


import template from './webgl.html';

export default Vue.extend({

  template,

  data() {

    return {};
  },

  created() {

    this.setup();
  },

  mounted() {

    this.renderer.domElement.style.position = 'absolute';
    this.$refs.container.appendChild(this.renderer.domElement);

    this.setupEvents();
  },

  methods: {

    setup() {

      this.test = 0;
      this.cameraTarget = new THREE.Vector3(0, 20, 100);
      this.cameraPos = new THREE.Vector3(0, 20, -1);

      this.stepPosition = window.innerWidth * 0.3;

      this.rotationEase = 0;
      this.mainAngle = 0;

      this.projectContainers = [];
      this.widthProjects = null;

      this.mouse = new THREE.Vector2();

      this.setupWebGL(window.innerWidth, window.innerHeight);
    },

    setupWebGL(width, height) {

      this.scene = window.scene = new THREE.Scene();

      this.camera = window.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
      this.camera.position.copy(this.cameraPos);
      this.camera.lookAt(this.cameraTarget);

      this.renderer = window.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x1a1a1a);
      this.renderer.autoClear = false;
      // this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // this.renderer.antialias = true;

      this.orthographicScene = new THREE.Scene();

      this.orthographicCamera = window.orthographicCamera = new THREE.OrthographicCamera(
        window.innerWidth / -2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / -2,
        -10000,
        10000,
      );
      this.orthographicCamera.position.copy(this.cameraPos);
      this.orthographicCamera.lookAt(this.cameraTarget);
      console.log(this.orthographicCamera);

      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.camera.lookAt(cameraTarget);
    },

    setupEvents() {

      Signals.onAssetsLoaded.add(this.onAssetsLoaded);
      Signals.onWeblGLMousemove.add(this.onWeblGLMousemove);
      Signals.onWeblGLMouseleave.add(this.onWeblGLMouseleave);
      Signals.onProjectClick.add(this.onProjectClick);

      this.$el.addEventListener('click', this.onWebGLClick.bind(this));
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

          const cloneLight = light.clone();
          cloneLight.position.set( 0, 20, 15 );

          const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.01 );
          directionalLight.position.set(-20, 100, -100);
          this.orthographicScene.add( directionalLight );

          this.scene.add( light );
          // this.orthographicScene.add( cloneLight );

          const sphereSize = 1;
          const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
          this.scene.add( pointLightHelper );
        }
      }
    },

    setupProject() {

      const projectList = projects.projectList;
      let previousX = window.innerWidth * 0.5;

      for (let i = 0; i < projectList.length; i += 1) {

        const projectContainer = new ProjectContainer({
          project: projectList[i],
        });

        const width = projectContainer.getMaskWidth();

        if ( i === 0) { previousX += width; }

        const x = previousX - this.stepPosition;
        const y = 20 + ( Math.random() * 260 - 130 );
        const z = 100;
        previousX = x - width;

        projectContainer.position.set( x, y, z );

        this.orthographicScene.add(projectContainer);
        this.projectContainers.push(projectContainer);

        if ( i === 0 ) { this.startProject = projectContainer; }
        if ( i === projectList.length - 1 ) { this.endProject = projectContainer; }
      }

      this.widthProjects = previousX;
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

      const step = 0.7;

      this.mouse.x = ( event.clientX - (window.innerWidth * 0.5) ) / ( window.innerWidth * 0.5 );
      this.mouse.y = ( event.clientY - (window.innerHeight * 0.5) ) / ( window.innerHeight * 0.5 );

      if ( Math.abs(this.mouse.x) > step ) {

        this.rotationEase += ( this.mouse.x - this.rotationEase ) * 0.05;
      } else {

        this.rotationEase = 0;
      }

      // this.checkMouseFocus();
    },

    // checkMouseFocus() {
    //
    //   for (let i = 0; i < this.projectContainers.length; i++) {
    //
    //     this.projectContainers[i].checkFocus(this.mouse);
    //   }
    // },

    onWeblGLMouseleave() {

      this.rotationEase = 0;
    },

    onWebGLClick() {

      for (let i = 0; i < this.projectContainers.length; i++) {

        this.projectContainers[i].onClick();
      }
    },

    onProjectClick(id) {

      TweenLite.to(
        this.orthographicCamera.position,
        5,
        {
          y: this.cameraPos.y + window.innerHeight * 2,
          ease: 'Power2.easeInOut',
        },
      );

      TweenLite.to(
        this.ground.position,
        5,
        {
          y: -90,
          ease: 'Power2.easeInOut',
        },
      );

      for (let i = 0; i < this.projectContainers.length; i++) {

        this.projectContainers[i].hideText();
      }
    },

    /* Update */

    animate() {

      raf(this.animate);

      this.updateCamera();

      this.ground.update( this.clock.time );
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);

      this.updateProjectContainers();

      this.renderer.clearDepth();
      this.renderer.render(this.orthographicScene, this.orthographicCamera);
      // this.renderer.clear();
      // this.projectContainer.update( this.clock.time, this.rotationEase );

    },

    updateCamera() {

      this.camera.rotation.y += 0.01 * this.rotationEase;
      // this.test += 0.1;
      // this.orthographicCamera.lookAt(new THREE.Vector3(
      //   this.cameraTarget.x,
      //   this.cameraTarget.y + this.test,
      //   this.cameraTarget.z
      // ));
    },

    updateProjectContainers() {

      let start = null;
      let last = null;

      for ( let i = 0; i < this.projectContainers.length; i++ ) {

        const project = this.projectContainers[i];

        let x = project.position.x + 10 * this.rotationEase;

        const width = project.getMaskWidth();

        if ( x >= window.innerWidth * 0.5 + width ) {

          x = this.projectContainers[ this.projectContainers.length - 1 ].position.x - this.projectContainers[ this.projectContainers.length - 1 ].getMaskWidth() - this.stepPosition;

          last = project;

          project.position.setX( x );
        } else if ( x <= this.widthProjects ) {

          x = this.projectContainers[ 0 ].position.x + this.projectContainers[ 0 ].getMaskWidth() + this.stepPosition;

          start = project;

          project.position.setX( x );
        } else {

          project.position.setX( x );
        }

        project.update( this.clock.time, this.rotationEase, this.mouse, i );
      }

      if (start) {

        this.projectContainers.splice( this.projectContainers.length - 1, 1 );
        this.projectContainers.splice( 0, 0, start );
      }

      if (last) {

        this.projectContainers.splice( 0, 1 );
        this.projectContainers.push( last );
      }
    },

  },

  components: {},
});
