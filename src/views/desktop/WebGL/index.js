import States from 'core/States';
import * as pages from 'core/pages';
import raf from 'raf';
import createDOM from 'utils/dom/createDOM';
import { map } from 'utils/math';
import { getPerspectiveSize } from 'utils/3d';
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

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._drag = false;
    this._grain = null;

    this._xStep = 50;
    this._zDepth = -50;
    this._baseY = 20;
    this._topPosition = 150;
    this._scaleStep = 1024;
    this._translationEase = 0;
    this._translationDelta = 0;
    this._translationWheel = 0;
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
    this._setupProjects();
    this._setupLight();
    this._setupGrain();

    this._setupEvents();

    this._animate();
  }

  _setupWebGL(width, height) {

    this._scene = window.scene = new THREE.Scene();

    this._camera = window.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this._camera.position.copy(this._cameraPosition);
    this._camera.lookAt(this._cameraTarget);

    const perspectiveSize = getPerspectiveSize(this._camera, this._zDepth);
    this._xStep = perspectiveSize.width;

    this._renderer = window.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._renderer.setSize(width, height);
    this._renderer.setClearColor(0x282828);

    this._raycaster = new THREE.Raycaster();

    this._renderer.domElement.style.position = 'absolute';
    this._el.appendChild(this._renderer.domElement);
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
    const hFOV = 2 * Math.atan( Math.tan( this._camera.fov / 2 ) * this._camera.aspect );
    const height = Math.abs( ( 2 * Math.tan( ( this._camera.fov / 2 ) ) * Math.abs( this._grain.position.z ) ) * 3.5 );
    const width = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this._grain.position.z ) ) * 3.5 );

    this._grain.scaleGrain( width, height );
    this._scene.add(this._grain);
  }

  _setupEvents() {
    this._el.addEventListener('click', this._onWebGLClick);
    this._el.addEventListener('mousedown', this._onWebGLMousedown);
    this._el.addEventListener('mouseup', this._onWebGLMouseup);
    this._el.addEventListener('mousemove', this._onWeblGLMousemove);
    this._el.addEventListener('mouseleave', this._onWeblGLMouseleave);

    Signals.onScrollWheel.add(this._onScrollWheel);
    Signals.onResize.add(this._onResize);
    Signals.onProjectClick.add(this.onProjectClick);
  }

  // State ---------------------------------------------------------------------

  _goToProject( id, index ) {

    TweenLite.to(
      this._camera.position,
      1.5,
      {
        y: this._topPosition,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this._grain.position,
      1.5,
      {
        y: this._topPosition,
        ease: 'Power4.easeInOut',
      },
    );

    for (let i = 0; i < this._projectContainers.length; i++) {

      this._projectContainers[i].hideText();
    }
  }

  show({ delay = 0 } = {}) {
    this._el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this._el.style.display = 'none';
  }

  _zoomFov() {

    TweenLite.killTweensOf([this._camera, this._grain]);

    TweenLite.to(
      this._camera.position,
      1,
      {
        z: 0,
        ease: 'Power4.easeOut',
      }
    );

    TweenLite.to(
      this._grain.position,
      1,
      {
        z: this._grainPosition.z,
        ease: 'Power4.easeOut',
      }
    );
  }

  _dezoomFov() {

    TweenLite.killTweensOf([this._camera, this._grain]);

    TweenLite.to(
      this._camera.position,
      1,
      {
        z: 10,
        ease: 'Power4.easeOut',
      }
    );

    TweenLite.to(
      this._grain.position,
      1,
      {
        z: this._grainPosition.z + 10,
        ease: 'Power4.easeOut',
      }
    );
  }

  updatePage(page) {
    switch (page) {
      case pages.PROJECT:
        const lastRouteResolved = States.router.getLastRouteResolved();

        for (let i = 0; i < this._projectContainers.length; i++) {
          if (lastRouteResolved.params.id === this._projectContainers[i].projectID) {
            this._goToProject(lastRouteResolved.params.id, i);
          }
        }
        break;
      default:
    }
  }

  // Events --------------------------------------------------------------------

  onUpdateFov() {

    const hFOV = 2 * Math.atan( Math.tan( this._camera.fov / 2 ) * this._camera.aspect );
    const xStep = Math.abs( 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this._zDepth ) ) * 2.5;
    this._xStep = xStep;

    this._camera.updateProjectionMatrix();
  }

  @autobind
  _onScrollWheel(event) {

    let deltaY = event.deltaY;

    this._translationWheel = Math.max( -2.5, Math.min( 2.5, deltaY * 0.1 ) );
  }

  @autobind
  _onWeblGLMousemove(event) {
    if (!States.application.activateProject) {

      const step = 0.65;

      this._mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      this._mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;

      if (!this._clicked) {

        if ( Math.abs(this._mouse.x) > step ) {

          this._translationTarget = map( Math.abs( this._mouse.x ), 0.7, 1, 0, 2 ) * Math.sign( this._mouse.x * -1 );

        } else {

          this._translationTarget = 0;
        }

        this._drag = false;
      } else {

        this._drag = true;
        this._translationDelta = Math.min( 5, Math.max( -5, ( this._mouse.x - this._previousMouse.x ) * 20 ) );
      }

      this._previousMouse.x = this._mouse.x;
    }
  }

  @autobind
  _onWeblGLMouseleave() {
    this._translationEase = 0;
  }

  @autobind
  _onWebGLMouseup() {
    this._clicked = false;
    // this._zoomFov();
  }

  @autobind
  _onWebGLMousedown() {
    this._clicked = true;
    // this._dezoomFov();
  }

  @autobind
  _onWebGLClick() {
    if (!this._drag) {

      for (let i = 0; i < this._projectContainers.length; i++) {

        this._projectContainers[i].onClick();
      }
    }
  }

  @autobind
  onProjectClick( id, y ) {
    States.router.navigateTo( pages.PROJECT, { id } );
    States.application.activateProject = true;
  }

  @autobind
  _onResize() {
    this._width = window.innerWidth;
    this._height = window.innerHeight;

    this._renderer.setViewport(0, 0, this._width, this._height);
    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( this._width, this._height );

    const perspectiveSize = getPerspectiveSize(this._camera, this._zDepth);
    this._xStep = perspectiveSize.width;

    const scaleFactor = Math.min( 1, this._width / this._scaleStep );

    for (let i = 0; i < this._projectContainers.length; i += 1) {

      const x = this._xStep * i;
      const y = i % 2 === 0 ? 15 : 22;
      const z = this._zDepth;
      const initialPosition = new THREE.Vector3(x, y, z);
      this._projectContainers[i].setInitialPosition(initialPosition);
      this._projectContainers[i].resize( this._camera.fov, this._camera.aspect, scaleFactor );
    }

    if (this._grain) {

      const grainPerspectiveSize = getPerspectiveSize(this._camera, this._grain.position.z);
      this._grain.scaleGrain( grainPerspectiveSize.width, grainPerspectiveSize.height );
    }

    if (this._background) {
      const backgroundPerspectiveSize = getPerspectiveSize(this._camera, this._background.position.z);
      this._background.scaleBackground( backgroundPerspectiveSize.width * 1.1, backgroundPerspectiveSize.height * 1.1 );
    }
  }

  // UPDATE -------------------------------------------------------------------

  @autobind
  _animate() {
    raf(this._animate);

    const time = this._clock.getElapsedTime();

    this._updateRaycast();
    this._updateProjectContainers(time);
    this._ground.update(time, this._translationEase );
    this._grain.update(time);
    this._renderer.render(this._scene, this._camera);
  }

  _updateRaycast() {
    this._raycaster.setFromCamera( this._mouse, this._camera );

    for (let i = 0; i < this._projectContainers.length; i++) {

      const intersects = this._raycaster.intersectObjects( this._projectContainers[i].getMask().children );

      if (intersects.length > 0) {
        this._projectContainers[i].activeRaycast();
      } else {
        this._projectContainers[i].deActiveRaycast();
      }

    }
  }

  _updateCamera() {

    this._camera.fov += ( this._targetFov - this._camera.fov ) * 0.1;
    this._camera.updateProjectionMatrix();
  }

  _updateProjectContainers(time) {

    const length = this._projectContainers.length * this._xStep;
    const maxTranslation = Math.max( Math.abs(this._translationDelta), Math.abs(this._translationWheel) );
    // this._translationEase += ( this._translationTarget - this._translationEase ) * 0.05;
    this._translationDelta += -this._translationDelta * 0.05;
    this._translationWheel += -this._translationWheel * 0.05;
    this._translationEase += this._translationDelta + this._translationWheel;

    for ( let i = 0; i < this._projectContainers.length; i++ ) {

      const project = this._projectContainers[i];
      project.update( time, this._translationEase, maxTranslation, this._camera, length, i );
    }
  }

}
