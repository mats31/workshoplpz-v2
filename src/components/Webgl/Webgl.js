import States from 'core/States';
import OrbitControls from 'helpers/OrbitControls'
import raf from 'raf';

import Clock from 'helpers/Clock';

import Ground from './Meshes/Ground/Ground';
import ProjectContainer from './Meshes/ProjectContainer/ProjectContainer';

import projects from 'config/projects';

import map from 'utils/map';

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

    // SETUP -------------------------------------------------------------------

    setup() {

      this.xStep = 50;
      this.zDepth = -80;
      this.cameraTarget = new THREE.Vector3(0, 20, this.zDepth);
      this.cameraPos = new THREE.Vector3(0, 20, 0);

      this.translationTarget = 0;
      this.translationEase = 0;
      this.mainAngle = 0;

      this.projectContainers = [];
      this.widthProjects = null;

      this.mouse = new THREE.Vector2( 9999, 9999 );

      this.setupWebGL(window.innerWidth, window.innerHeight);

      // const height = 2 * Math.tan( ( this.camera.fov / 2 ) ) * 50;
      // const hFOV = 2 * Math.atan( Math.tan( this.camera.fov / 2 ) * this.camera.aspect );
      // const width = 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this.zDepth );

      // console.info(height);
    },

    setupWebGL(width, height) {

      this.scene = window.scene = new THREE.Scene();

      this.camera = window.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
      this.camera.position.copy(this.cameraPos);
      this.camera.lookAt(this.cameraTarget);

      const hFOV = 2 * Math.atan( Math.tan( this.camera.fov / 2 ) * this.camera.aspect );
      const xStep = Math.abs( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this.zDepth ) ) * 2.5;

      this.xStep = xStep;

      this.renderer = window.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x1a1a1a);
      // this.renderer.autoClear = false;
      // this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      // this.renderer.antialias = true;

      this.raycaster = new THREE.Raycaster();

      // this.orthographicScene = new THREE.Scene();
      //
      // this.orthographicCamera = window.orthographicCamera = new THREE.OrthographicCamera(
      //   window.innerWidth / -2,
      //   window.innerWidth / 2,
      //   window.innerHeight / 2,
      //   window.innerHeight / -2,
      //   -10000,
      //   10000,
      // );
      // this.orthographicCamera.position.copy(this.cameraPos);
      // this.orthographicCamera.lookAt(this.cameraTarget);

      // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      // this.camera.lookAt(cameraTarget);
    },

    setupEvents() {

      Signals.onAssetsLoaded.add(this.onAssetsLoaded);
      Signals.onWeblGLMousemove.add(this.onWeblGLMousemove);
      Signals.onWeblGLMouseleave.add(this.onWeblGLMouseleave);
      Signals.onProjectClick.add(this.onProjectClick);

      this.$el.addEventListener('click', this.onWebGLClick.bind(this));
      window.addEventListener('resize', this.onResize.bind(this));
    },

    checkRoute() {

      if ( this.$route.name === 'project' ) {

        this.goToProject( this.$route.params.id, 0 );
      }
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

          // const cloneLight = light.clone();
          // cloneLight.position.set( 0, 20, 15 );

          // const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.01 );
          // directionalLight.position.set(-20, 100, -100);
          // this.orthographicScene.add( directionalLight );

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
      const length = projectList.length;
      let previousX = window.innerWidth * 0.5;

      for (let i = 0; i < length; i += 1) {

        const projectContainer = new ProjectContainer({
          project: projectList[i],
          index: i,
        });

        const width = projectContainer.getMaskWidth();

        if ( i === 0) { previousX += width; }

        // const angle = ( ( Math.PI * 2 ) / length ) * i;
        const x = this.xStep * i;
        const y = i % 2 === 0 ? 25 : 40;
        const z = this.zDepth;
        const initialPosition = new THREE.Vector3(x, y, z);
        previousX = x - width;
        projectContainer.setInitialPosition(initialPosition);

        // this.orthographicScene.add(projectContainer);
        this.scene.add(projectContainer);
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

    // STATE -------------------------------------------------------------------

    goToProject( id, y ) {

      this.$router.push({ name: 'project', params: { id } });
      States.application.activateProject = true;

      TweenLite.to(
        this.orthographicCamera.position,
        3.5,
        {
          y: y + window.innerHeight * 2,
          ease: 'Power4.easeInOut',
        },
      );

      TweenLite.to(
        this.ground.position,
        3.5,
        {
          y: -90,
          ease: 'Power4.easeInOut',
        },
      );

      for (let i = 0; i < this.projectContainers.length; i++) {

        this.projectContainers[i].hideText();
      }
    },

    resize() {

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.renderer.setViewport(0, 0, this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      const hFOV = 2 * Math.atan( Math.tan( this.camera.fov / 2 ) * this.camera.aspect );
      const xStep = Math.abs( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this.zDepth ) ) * 2.5;

      this.xStep = xStep;
    },

    // EVENTS ------------------------------------------------------------------

    onAssetsLoaded() {

      this.clock = new Clock();

      this.setupGround();
      this.setupProject();
      this.setupLight();
      this.animate();

      this.checkRoute();

    },

    onResize() {

      this.resize();
    },

    onWeblGLMousemove(event) {

      if (!States.application.activateProject) {

        // this.mouse.x = ( ( event.clientX / window.innerWidth ) * 2 ) - 1;
        // this.mouse.y = ( -( event.clientY / window.innerHeight ) * 2 ) + 1;

        const step = 0.65;

        this.mouse.x = ( event.clientX - (window.innerWidth * 0.5) ) / ( window.innerWidth * 0.5 );
        this.mouse.y = ( event.clientY - (window.innerHeight * 0.5) ) / ( window.innerHeight * 0.5 );

        console.log(this.mouse);

        if ( Math.abs(this.mouse.x) > step ) {

          this.translationTarget = map( Math.abs( this.mouse.x ), 0.7, 1, 0, 2 ) * Math.sign( this.mouse.x );

        } else {

          this.translationTarget = 0;
        }

        // this.checkMouseFocus();
      }
    },

    // checkMouseFocus() {
    //
    //   for (let i = 0; i < this.projectContainers.length; i++) {
    //
    //     this.projectContainers[i].checkFocus(this.mouse);
    //   }
    // },

    onWeblGLMouseleave() {

      this.translationEase = 0;
    },

    onWebGLClick() {

      for (let i = 0; i < this.projectContainers.length; i++) {

        this.projectContainers[i].onClick();
      }
    },

    onProjectClick( id, y ) {

      this.goToProject( id, y );
    },

    // UPDATE -------------------------------------------------------------------

    animate() {

      raf(this.animate);

      this.updateRaycast();

      this.updateProjectContainers();
      this.ground.update( this.clock.time );
      // this.renderer.clear();
      this.renderer.render(this.scene, this.camera);


      // this.renderer.clearDepth();
      // this.renderer.render(this.orthographicScene, this.orthographicCamera);
      // this.renderer.clear();
      // this.projectContainer.update( this.clock.time, this.translationEase );

    },

    updateRaycast() {

      this.raycaster.setFromCamera( this.mouse, this.camera );

      const intersects = this.raycaster.intersectObjects( this.scene.children );

      for ( let i = 0; i < intersects.length; i++ ) {

        console.log(1);
        // intersects[ i ].object.material.color.set( 0xff0000 );

      }

      // this.camera.position.setX( this.camera.position.x + 0.1 * this.translationEase );
      // this.camera.rotation.y -= 0.01 * this.translationEase;
      // this.test += 0.1;
      // this.orthographicCamera.lookAt(new THREE.Vector3(
      //   this.cameraTarget.x,
      //   this.cameraTarget.y + this.test,
      //   this.cameraTarget.z
      // ));
    },

    updateProjectContainers() {

      const length = this.projectContainers.length * this.xStep;
      this.translationEase += ( this.translationTarget - this.translationEase ) * 0.05;

      for ( let i = 0; i < this.projectContainers.length; i++ ) {

        const project = this.projectContainers[i];
        project.update( this.clock.time, this.translationEase, this.camera, length, i );

        if (i === 0) {
          // console.log(project.mask.position.x);
        }
      }
    },

  },

  components: {},
});
