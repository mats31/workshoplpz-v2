import States from 'core/States';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { map } from 'utils/math';
import { getPerspectiveSize } from 'utils/3d';
import { autobind } from 'core-decorators';
import { toggle } from 'core/decorators';
import projects from 'config/projects';
import Background from './meshes/Background';
import Grain from './meshes/Grain';
import Ground from './meshes/Ground';
import ProjectContainer from './meshes/ProjectContainer';
import template from './webgl.tpl.html';
import './webgl.scss';

@toggle('projectVisible', 'showProject', 'hideProject', false)
@toggle('cameraOnTop', 'cameraToTop', 'cameraToBottom', true)
export default class WebGL {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this._el = options.parent.appendChild(
      createDOM(template()),
    );

    this._state = 'home';

    this._drag = false;
    this._isDragging = false;
    this._isShowing = false;
    this._needsUpdate = true;
    this._firstClick = false;
    this._grain = null;

    this._previousIndex = 0;
    this._currentIndex = -1;
    this._nextIndex = 0;
    this._xStep = 50;
    this._zDepth = -50;
    this._baseY = 20;
    this._topPosition = 150;
    this._scaleStep = 1024;
    this._translationEase = 0;
    this._translationDelta = 0;
    this._translationKeyboard = 0;
    this._translationWheel = 0;
    this._translationShow = 0;
    this._mainAngle = 0;

    this._projectContainers = [];

    this._clock = new THREE.Clock();

    // this._mouse = new THREE.Vector2( 9999, 9999 );
    // this._previousMouse = new THREE.Vector2( 9999, 9999 );

    this._mouse = new THREE.Vector2( 0, 0 );
    this._previousMouse = new THREE.Vector2( 0, 0 );

    // this._cameraTarget = new THREE.Vector3( 0, this._baseY, -150 );
    // this._cameraPosition = new THREE.Vector3( 0, this._baseY, 0 );
    // this._grainPosition = new THREE.Vector3( 0, this._baseY, -10 );

    this._cameraTarget = new THREE.Vector3( 0, this._topPosition, -150 );
    this._cameraPosition = new THREE.Vector3( 0, this._topPosition, 0 );
    this._grainPosition = new THREE.Vector3( 0, this._topPosition, -10 );

    this._setupWebGL(window.innerWidth, window.innerHeight);
    this._setupBackground();
    if (States.version !== 'low') {
      this._setupGround();
    }
    this._setupProjects();
    this._setupLight();
    this._setupGrain();

    this._setupEvents();
  }

  _setupWebGL(width, height) {

    this._scene = window.scene = new THREE.Scene();

    this._camera = window.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this._camera.position.copy(this._cameraPosition);
    this._camera.lookAt(this._cameraTarget);

    const perspectiveSize = getPerspectiveSize(this._camera, this._zDepth);
    this._xStep = perspectiveSize.width * 0.7;

    this._renderer = window.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._renderer.setSize(width, height);
    this._renderer.setClearColor(0x313234);
    // this._renderer.setClearColor(0x000000);
    // this._renderer.setPixelRatio();
    // console.log(this._renderer.getPixelRatio());

    this._raycaster = new THREE.Raycaster();

    this._renderer.domElement.style.position = 'absolute';
    this._el.appendChild(this._renderer.domElement);
  }

  _setupBackground() {
    const depth = -300;

    this._background = new Background();
    this._background.position.setY( this._baseY );
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
    this._ground.position.setZ( -150 );
    // this._ground.position.setY( -10 );
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

      const x = this._xStep * i + this._xStep;
      const y = i % 2 === 0 ? 15 : 22;
      const z = this._zDepth;
      const initialPosition = new THREE.Vector3(x, y, z);
      projectContainer.setInitialPosition(initialPosition);

      this._scene.add(projectContainer);
      this._projectContainers.push(projectContainer);
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

    if (!States.TABLET) {
      this._el.addEventListener('click', this._onWebGLClick);
      this._el.addEventListener('mousedown', this._onWebGLMousedown);
      this._el.addEventListener('mouseup', this._onWebGLMouseup);
      this._el.addEventListener('mousemove', this._onWeblGLMousemove);
      this._el.addEventListener('mouseleave', this._onWeblGLMouseleave);

      Signals.onKeydownLeft.add(this.onKeydownLeft);
      Signals.onKeydownRight.add(this.onKeydownRight);
      Signals.onKeyup.add(this.onKeyup);
    } else {
      this._el.addEventListener('touchstart', this._onWebGLTouchstart);
      this._el.addEventListener('touchend', this._onWebGLTouchend);
      this._el.addEventListener('touchmove', this._onWeblGLTouchmove);
    }

    Signals.onScrollWheel.add(this._onScrollWheel);
    Signals.onResize.add(this._onResize);
    Signals.onProjectClick.add(this.onProjectClick);
  }

  // State ---------------------------------------------------------------------

  _goToAboutState() {
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
        onComplete: () => {
          this.hide();
        },
      },
    );
  }

  show({ delay = 0, transitionIn = true, transitionToBottom = true, direction = 'right', fromProject = false } = {}) {
    this._needsUpdate = true;
    this._previousIndex = ( this._currentIndex - 1 ) % this._projectContainers.length;
    this._nextIndex = ( this._currentIndex + 1 ) % this._projectContainers.length;
    // console.log('previous:', this._previousIndex);
    // console.log('current:', this._currentIndex);
    // console.log('next:', this._nextIndex);

    this.showProject(delay);

    if (transitionToBottom) {
      this.cameraToBottom(delay, transitionIn, fromProject);
    }

    if (transitionIn) {
      this.isAnimating = true;

      let customDelay = delay < 1 && delay !== 0.1 ? delay : delay + 1.5;
      let translationShow;

      // if (direction === 'right') {
      //   this._currentIndex = this._nextIndex;
      //   value = this._projectContainers[this._nextIndex].position.x * -1;
      // } else {
      //   this._currentIndex = this._previousIndex;
      //   value = this._projectContainers[this._previousIndex].position.x * -1;
      // }

      // const translationShow = direction === 'right' ? `-=${value}` : `+=${value}`;
      // const translationShow = `+=${value}`;

      if (fromProject) {
        translationShow = `-=${this._projectContainers[this._nextIndex].position.x}`;
        customDelay = delay + 0.9;
      } else {
        translationShow = direction === 'right' ? `-=${this._xStep}` : `+=${this._xStep}`;
      }


      TweenLite.killTweensOf(this);
      TweenLite.to(
        this,
        2.1,
        {
          delay: customDelay,
          _translationShow: translationShow,
          ease: 'Power4.easeOut',
          onComplete: () => {
            this.isAnimating = false;
          },
        },
      );
    }
  }

  showProject(delay) {
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].deactiveFocus();
      this._projectContainers[i].showText({ delay });
      this._projectContainers[i].show({ delay });
    }
  }

  hideProject(delay) {
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].hide({ delay });
    }
  }

  cameraToBottom(delay, transitionIn, fromProject) {

    const duration = fromProject ? 1.55 : 2.55;

    this.isAnimating = true;
    TweenLite.killTweensOf([this._camera.position, this._grain.position]);
    TweenLite.to(
      this._camera.position,
      duration,
      {
        delay,
        y: this._baseY,
        ease: 'Power4.easeInOut',
      },
    );

    this._grain.show();
    TweenLite.to(
      this._grain.position,
      duration,
      {
        delay,
        y: this._baseY,
        ease: 'Power4.easeInOut',
        onComplete: () => {
          if (!transitionIn) {
            this.isAnimating = false;
          }
        },
      },
    );
  }

  cameraToTop() {

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
        onComplete: () => {
          this.hide();
        },
      },
    );
  }

  hide({ delay = 0 } = {}) {
    this._needsUpdate = false;
  }

  _zoomFov() {

    TweenLite.killTweensOf([this._camera, this._grain]);

    TweenLite.to(
      this._camera.position,
      1,
      {
        z: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._grain.position,
      1,
      {
        z: this._grainPosition.z,
        ease: 'Power4.easeOut',
      },
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
      },
    );

    TweenLite.to(
      this._grain.position,
      1,
      {
        z: this._grainPosition.z + 10,
        ease: 'Power4.easeOut',
      },
    );
  }

  updatePage(page) {
    switch (page) {
      case pages.HOME:
        this._firstClick = false;
        this._state = 'home';
        for (let i = 0; i < this._projectContainers.length; i++) {
          this._projectContainers[i].deactiveFocus();
          this._projectContainers[i].showText();
        }

        if (this._ground) {
          this._ground.goToProject();
        }
        break;
      case pages.PROJECT:
        this._state = 'project';
        const lastRouteResolved = States.router.getLastRouteResolved();
        for (let i = 0; i < this._projectContainers.length; i++) {
          if (lastRouteResolved.params.id === this._projectContainers[i].projectID) {
            // this._goToProject(lastRouteResolved.params.id, i);
            this._mouse.set( 0, 0 );
            this.cameraToTop();
            this._projectContainers[i].goToProjectMode();
            this._currentIndex = i;
          }

          this._projectContainers[i].hideText({ delay: 0 });
        }
        this._grain.hide();
        break;
      case pages.EVERYDAYS:
        // this._nextIndex = ( this._currentIndex + 1 ) % this._projectContainers.length;
        // const value = Math.abs(this._projectContainers[this._nextIndex].position.x);
        // this._currentIndex = this._nextIndex;

        const value = this._xStep;

        this.isAnimating = true;
        TweenLite.killTweensOf(this._translationShow);
        TweenLite.to(
          this,
          0.9,
          {
            _translationShow: `-=${value}`,
            ease: 'Power4.easeIn',
            onComplete: () => {
              this.isAnimating = false;
              this._translationShow = this._xStep * 2;
            },
          },
        );

        if (this._ground) {
          this._ground.goToEverydays();
        }

        this.hideProject(0.4);
        break;
      case pages.ABOUT:
        this._state = 'about';

        this.cameraToTop();
        break;
      default:
        this._grain.show();
    }
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onScrollWheel(event) {

    if (!States.application.activateProject && !this.isAnimating) {
      const deltaY = Math.min( 170, Math.max( -170, event.deltaY ) );

      // this._translationWheel = Math.max( -2.5, Math.min( 2.5, deltaY * 0.1 ) );
      this._translationWheel = deltaY;

      clearTimeout(this._scrollWheelTimeout);

      this._scrollWheelTimeout = setTimeout( () => {
        this._translationWheel = 0;
      }, 50);
    }
  }

  @autobind
  _onWeblGLMousemove(event) {
    this._firstClick = true;
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
        // this._translationDelta = Math.min( 5, Math.max( -5, ( this._mouse.x - this._previousMouse.x ) * 20 ) );
        this._translationDelta = this._mouse.x - this._previousMouse.x;
      }

      this._previousMouse.x = this._mouse.x;
    }

    clearTimeout(this._mousemoveTimeout);

    this._mousemoveTimeout = setTimeout( () => {
      this._translationDelta = 0;
    }, 50);
  }

  @autobind
  _onWeblGLTouchmove(event) {
    this._firstClick = true;
    if (!States.application.activateProject) {

      this._isDragging = true;

      const step = 0.65;

      this._mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
      this._mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;

      if (!this._clicked) {

        if ( Math.abs(this._mouse.x) > step ) {

          this._translationTarget = map( Math.abs( this._mouse.x ), 0.7, 1, 0, 2 ) * Math.sign( this._mouse.x * -1 );

        } else {

          this._translationTarget = 0;
        }

        this._drag = false;
      } else {

        Signals.onCursorSlide.dispatch();

        this._drag = true;
        // this._translationDelta = Math.min( 5, Math.max( -5, ( this._mouse.x - this._previousMouse.x ) * 20 ) );
        this._translationDelta = this._mouse.x - this._previousMouse.x;
      }

      this._previousMouse.x = this._mouse.x;
    }

    clearTimeout(this._mousemoveTimeout);

    this._mousemoveTimeout = setTimeout( () => {
      this._translationDelta = 0;
    }, 50);
  }

  @autobind
  _onWeblGLMouseleave() {
    this._clicked = false;
    this._translationDelta = 0;
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].unpress();
    }
    // this._translationEase = 0;
  }

  @autobind
  _onWebGLMouseup() {
    this._clicked = false;
    this._translationDelta = 0;
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].unpress();
    }
  }

  @autobind
  _onWebGLTouchend() {
    this._clicked = false;
    this._drag = false;
    this._translationDelta = 0;
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].unpress();
    }

    if (!this._drag) {

      for (let i = 0; i < this._projectContainers.length; i++) {

        this._projectContainers[i].onClick();
      }
    }

    this._isDragging = false;
  }

  @autobind
  _onWebGLMousedown() {
    this._firstClick = true;
    this._clicked = true;
    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].press();
    }
    // this._dezoomFov();
  }

  @autobind
  _onWebGLTouchstart(event) {
    this._firstClick = true;
    this._clicked = true;
    this._mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    this._mouse.y = -( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
    this._previousMouse.x = this._mouse.x;

    for (let i = 0; i < this._projectContainers.length; i++) {
      this._projectContainers[i].press();
    }
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
    if (!this._isDragging) {
      States.router.navigateTo( pages.PROJECT, { id } );
    }
  }

  @autobind
  onKeydownLeft() {
    this._translationKeyboard = -1;
  }

  @autobind
  onKeydownRight() {
    this._translationKeyboard = 1;
  }

  @autobind
  onKeyup() {
    this._translationKeyboard = 0;
  }

  @autobind
  _onResize() {
    this._width = Math.max( 500, window.innerWidth );
    this._height = Math.max( 500, window.innerHeight );

    this._camera.aspect = this._width / this._height;
    this._camera.updateProjectionMatrix();

    this._renderer.setSize( this._width, this._height );

    this._projectPerspectiveSize = getPerspectiveSize(this._camera, this._zDepth);
    this._xStep = Math.max( 35, this._projectPerspectiveSize.width * 0.6 );
    // this._xStep = this._projectPerspectiveSize.width * 1.5;

    // const scaleFactor = Math.min( 1, this._width / this._scaleStep );

    for (let i = 0; i < this._projectContainers.length; i += 1) {

      const x = this._xStep * i + this._xStep;
      const y = i % 2 === 0 ? 17 : 22;
      const z = this._zDepth;
      const initialPosition = new THREE.Vector3(x, y, z);
      this._projectContainers[i].setInitialPosition(initialPosition);
      this._projectContainers[i].resize( this._camera, this._projectPerspectiveSize );
    }

    if (this._grain) {

      const grainPerspectiveSize = getPerspectiveSize(this._camera, this._grain.position.z);
      this._grain.scaleGrain( grainPerspectiveSize.width * 1.3, grainPerspectiveSize.height * 1.3 );
    }

    if (this._background) {
      const backgroundPerspectiveSize = getPerspectiveSize(this._camera, this._background.position.z);
      this._background.scaleBackground( backgroundPerspectiveSize.width * 1.3, backgroundPerspectiveSize.height * 2 );
    }
  }

  // UPDATE -------------------------------------------------------------------

  update() {
    if (this._needsUpdate) {
      const time = this._clock.getElapsedTime();

      if (this._firstClick) {
        this._updateRaycast();
      }

      this._updateProjectContainers(time);
      this._updateCamera();

      this._grain.update(time);
      this._renderer.render(this._scene, this._camera);
    }
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

    if (!this.cameraOnTop()) {
      this._camera.rotation.x += ( this._mouse.y * 0.05 - this._camera.rotation.x) * 0.05;
      this._camera.rotation.y += ( this._mouse.x * -0.05 - this._camera.rotation.y ) * 0.05;
    } else {
      this._camera.rotation.x += ( -this._camera.rotation.x) * 0.05;
      this._camera.rotation.y += ( -this._camera.rotation.y ) * 0.05;
    }
  }

  _updateProjectContainers(time) {

    const length = this._projectContainers.length * this._xStep;
    // this._translationEase += ( this._translationTarget - this._translationEase ) * 0.05;
    // this._translationDelta += -this._translationDelta * 0.05;
    // this._translationWheel += -this._translationWheel * 0.05;
    // this._translationEase += this._translationDelta + this._translationWheel + this._translationShow;

    const translationDelta = this._translationDelta * 60 + this._translationKeyboard;
    const translationWheel = this._translationWheel * 0.02;
    const groundTranslation = Math.abs(translationDelta) - Math.abs( translationWheel ) > 0 ? translationDelta : translationWheel;
    const translationShow = this._translationShow;

    const delta = translationDelta + translationWheel;
    const maxTranslation = Math.max( Math.abs(translationDelta), Math.abs(translationWheel) );
    // const maxTranslation = Math.max( -5, Math.min( 5, Math.abs(translationDelta) ) );

    if (States.version !== 'low') {
      this._ground.update(time, groundTranslation );
    }

    for ( let i = 0; i < this._projectContainers.length; i++ ) {

      const project = this._projectContainers[i];
      project.update( time, delta, translationShow, maxTranslation, this._camera, length, i );
    }
  }

}
