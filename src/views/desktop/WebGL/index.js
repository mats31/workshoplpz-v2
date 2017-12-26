import States from 'core/States';
import * as pages from 'core/pages';
import raf from 'raf';
import createDOM from 'utils/dom/createDOM';
import { map } from 'utils/math';
import { autobind } from 'core-decorators';
import projects from 'config/projects';
import Background from './meshes/Background';
import Grain from './meshes/Grain';
import Ground from './meshes/Ground';
import ProjectContainer from './meshes/ProjectContainer';
import template from './webgl.tpl.html';
import './webgl.scss';


export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._drag = false;
    this._grain = null;

    this._xStep = 50;
    this._zDepth = -50;
    this._baseY = 20;
    this._topPosition = 150;
    this._scaleStep = 1024;
    this._translationTarget = 0;
    this._translationEase = 0;
    this._mainAngle = 0;

    this._projectContainers = [];

    this._clock = new THREE.Clock();

    this._mouse = new THREE.Vector2( 9999, 9999 );
    this._previousMouse = new THREE.Vector2( 9999, 9999 );

    this._cameraTarget = new THREE.Vector3( 0, this._baseY, -150 );
    this._cameraPosition = new THREE.Vector3( 0, this._baseY, 0 );
    this._grainPosition = new THREE.Vector3( 0, this._baseY, -10 );

    this._setupWebGL(window.innerWidth, window.innerHeight);
    this._setupBackground();
    this._setupGround();
    // this._setupProjects();
    // this._setupLight();
    // this._setupGrain();

    // this._setupEvents();

    // this._animate();
  }

  _setupWebGL(width, height) {

    this._scene = window.scene = new THREE.Scene();

    this._camera = window.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this._camera.position.copy(this._cameraPosition);
    this._camera.lookAt(this._cameraTarget);

    const hFOV = 2 * Math.atan( Math.tan( this._camera.fov / 2 ) * this._camera.aspect );
    const xStep = Math.abs( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this._zDepth ) ) * 3.5;
    this._xStep = xStep;

    this._renderer = window.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._renderer.setSize(width, height);
    this._renderer.setClearColor(0x282828);

    this._raycaster = new THREE.Raycaster();
  }

  _setupBackground() {
    const depth = -300;

    this._background = new Background();
    this._background.position.setY( this._camera.position.y );
    this._background.position.setZ( depth );
    const hFOV = 2 * Math.atan( Math.tan( this._camera.fov / 2 ) * this._camera.aspect );
    const height = Math.abs( ( 2 * Math.tan( ( this._camera.fov / 2 ) ) * Math.abs( depth ) ) * 3.5 );
    const width = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( depth ) ) * 3.5 );

    this._background.scaleBackground( width, height );
    this._scene.add(this._background);
  }

  _setupGround() {
    this._ground = new Ground();
    this._ground.position.setY( -10 );
    this._ground.rotation.x = Math.PI * -0.5;
    this._scene.add(this._ground);
  }

  _setupProjects() {
    const projectList = projects.projectList;
    const length = projectList.length;

    for (let i = 0; i < length; i += 1) {

      const projectContainer = new ProjectContainer({
        project: projectList[i],
        index: i,
        topPosition: this._topPosition,
      });

      const x = this._xStep * i;
      const y = i % 2 === 0 ? 15 : 22;
      const z = this._zDepth;
      const initialPosition = new THREE.Vector3(x, y, z);
      projectContainer.setInitialPosition(initialPosition);

      this._scene.add(projectContainer);
      this._projectContainers.push(projectContainer);

      if ( i === 0 ) { this._startProject = projectContainer; }
      if ( i === projectList.length - 1 ) { this._endProject = projectContainer; }
    }
  }

  _setupLight() {
    const spotLight = new THREE.SpotLight( 0xffffff, 1, 1000, Math.PI, 0, 1.1 );
    spotLight.position.set( -300, 50, -100 );
    this._scene.add( spotLight );
    this._scene.add( spotLight.target );

    const spotLight2 = new THREE.SpotLight( 0x282828, 0.3, 1000, Math.PI, 0, 1.1 );
    spotLight2.position.set( 300, 50, 0 );
    this._scene.add( spotLight2 );
    this._scene.add( spotLight2.target );
  }

  _setupGrain() {
    this._grain = new Grain();
    this._grain.position.copy( this._grainPosition );
    const hFOV = 2 * Math.atan( Math.tan( this._ecamera.fov / 2 ) * this._ecamera.aspect );
    const height = Math.abs( ( 2 * Math.tan( ( this._ecamera.fov / 2 ) ) * Math.abs( this._grain.position.z ) ) * 3.5 );
    const width = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this._grain.position.z ) ) * 3.5 );

    this._grain.scaleGrain( width, height );
    this._scene.add(this._grain);
  }

  _setupEvents() {
    Signals.onWeblGLMousemove.add(this._onWeblGLMousemove);
    Signals.onWeblGLMouseleave.add(this._onWeblGLMouseleave);
    Signals.onScrollWheel.add(this._onScrollWheel);

    this.el.addEventListener('click', this._onWebGLClick);
    this.el.addEventListener('mousedown', this._onWebGLMousedown);
    this.el.addEventListener('mouseup', this._onWebGLMouseup);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this.el.style.display = 'none';
  }

  updatePage(page) {
    switch (page) {
      case pages.PROJECT:
        const lastRouteResolved = States.router.getLastRouteResolved();

        for (let i = 0; i < this.projectContainers.length; i++) {
          if (lastRouteResolved.params.id === this.projectContainers[i].projectID) {
            this.goToProject(lastRouteResolved.params.id, i);
          }
        }
        break;
      default:
    }
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {

    const image = States.resources.getImage('twitter').media;
    this.el.appendChild(image);
  }

}
