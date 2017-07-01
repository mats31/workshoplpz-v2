import States from 'core/States';
import Mask from './Mask';
import Text from './Text';
import ProjectPlane from './ProjectPlane';
import modulo from 'utils/modulo';

class ProjectContainer extends THREE.Object3D {

  constructor(options) {

    super();

    this.initialPosition = new THREE.Vector3();
    this.offsetCenter = new THREE.Vector2();
    this.offsetSide = new THREE.Vector2();

    this.perspectiveWidth = 0;
    this.scaleFactor = 1;

    this.setup(options);
  }

  setup(options) {

    this.isHover = false;
    this.isFocus = false;


    this.topPosition = options.topPosition;
    this.projectID = options.project.id;
    this.previewID = options.project.previewId;
    this.title = options.project.title;
    this.date = options.project.date;
    this.statut = options.project.statut;
    this.index = options.index;
    this.maskColor = options.project.color;

    const texture = States.resources.getTexture(this.previewID).media;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    this.texture = texture;

    this.setupMask();
    this.setupDescription();
  }

  setupMask() {

    this.mask = new Mask({
      color: this.maskColor,
    });

    // this.mask.scale.set( 0.5, 0.5, 0.5 );
    // this.mask.position.set(this.getMaskWidth() * 0.5, 20, 100);
    // this.mask.position.set(0, 20, 100) ;
    // this.mask.rotation.x = 0.5;
    // this.mask.rotation.y = 0.5;

    this.add(this.mask);
  }

  setupDescription() {

    this.texture2 = new THREE.Texture( States.resources.getImage('orange').media );
    this.texture2.wrapS = THREE.ClampToEdgeWrapping;
    this.texture2.wrapT = THREE.ClampToEdgeWrapping;
    // texture.minFilter = THREE.LinearMipMapNearestFilter;
    // this.texture2.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearMipMapNearestFilter;
    // this.texture2.magFilter = THREE.NearestFilter;
    this.texture2.needsUpdate = true;

    this.text = new Text({
      texture: this.texture2,
    });

    this.text.position.setY( this.index % 2 === 0 ? 13 : -13 );
    // this.text.position.setZ( this.index % 2 === 0 ? -40 : 30 );
    this.text.position.setZ( -10 );

    this.add(this.text);
  }

  // Getter -----------------------------------------------

  getMask() {

    return this.mask;
  }

  getMaskPosition() {

    const box3 = new THREE.Box3().setFromObject( this.mask );

    return {
      left: box3.max.x * -1,
      top: box3.max.y,
      right: box3.min.x * -1,
      bottom: box3.min.y,
    };
  }

  getMaskWidth() {

    return this.mask.getMaskWidth();
  }

  // getProjectPlane() {
  //
  //   return this.projectPlane;
  // }

  // State -----------------------------------------------

  deActiveRaycast() {

    this.deactiveFocus();
    this.isHover = false;
  }

  activeRaycast() {

    this.activeFocus();
    this.isHover = true;
  }

  setInitialPosition( pos ) {

    this.initialPosition.copy( pos );
    // this.mask.position.copy( pos );
  }

  activeFocus() {

    this.isFocus = true;

    document.body.style.cursor = 'pointer';

    // TweenLite.killTweensOf(this.box);
    // TweenLite.to(
    //   this.box,
    //   0.55,
    //   {
    //     opacity: 1,
    //     ease: 'Power2.easeIn',
    //   },
    // );

    this.mask.activateMask();
  }

  deactiveFocus() {

    this.isFocus = false;

    document.body.style.cursor = 'initial';

    // TweenLite.killTweensOf(this.box);
    // TweenLite.to(
    //   this.box,
    //   0.5,
    //   {
    //     opacity: 0.5,
    //     ease: 'Power2.easeIn',
    //   },
    // );

    this.mask.deactivateMask();
  }

  hideText() {

    this.text.hide();
  }

  goToProjectMode() {

    this.mask.activateProject();

    TweenLite.to(
      this,
      3.5,
      {
        scaleFactor: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this.offsetSide,
      1.5,
      {
        x: 1,
        ease: 'Power4.easeInOut',
        delay: 4,
      },
    );
  }

  // Events --------------------------------------------------------------------

  onDOMMouseover() {

    this.activeFocus();
  }

  onDOMMouseleave() {

    this.deactiveFocus();
  }

  onClick() {

    if (this.isFocus) {

      Signals.onProjectClick.dispatch( this.projectID, this.index );

      this.goToProjectMode();
    }
  }

  resize( fov, aspect, scaleFactor ) {

    const depth = Math.abs( this.position.z );
    const hFOV = 2 * Math.atan( Math.tan( fov / 2 ) * aspect );
    this.perspectiveHeight = Math.abs( ( 2 * Math.tan( ( fov / 2 ) ) * depth ) * 3.5 );
    this.perspectiveWidth = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * depth ) * 3.5 );
    this.mask.resize( this.perspectiveWidth, this.perspectiveHeight );

    if (!States.application.activateProject) {

      this.scaleFactor = scaleFactor;
    }
  }

  // Update --------------------------------------------------------------------

  update( time, translationEase, camera, length, i ) {

    // this.updateDOM(i);
    this.updatePosition( translationEase, camera, length, i );
    // this.checkFocus(point);
    this.mask.update( time );
    this.text.update( time );
    // this.projectPlane.update( time, translationEase );
  }

  updateDOM() {

    this.box.style.left = `${this.getMaskPosition().left}px`;
    // this.box.style.top = `${( this.getMaskPosition().top - window.innerHeight * 0.5 ) * -1}px`;

    // if (i===1) console.log(this.getMaskPosition().left);
  }

  updatePosition( translationEase, camera, length, i ) {

    const hFOV = 2 * Math.atan( Math.tan( camera.fov / 2 ) * camera.aspect );
    const width = 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this.initialPosition.z );
    const moduloLength = length + ( this.getMaskWidth() * 0.5 );
    const extraMargin = 15;
    const offset = Math.abs(width * 2) + ( this.getMaskWidth() * 0.5 ) + extraMargin;

    this.initialPosition.setX( this.initialPosition.x + translationEase );
    const x = ( modulo( this.initialPosition.x, moduloLength ) - offset )  * ( 1 - this.offsetCenter.x ) - ( this.perspectiveWidth * 0.99 * this.offsetSide.x );
    const y = this.initialPosition.y + ( ( this.topPosition - this.initialPosition.y ) * this.offsetCenter.y );
    const z = this.initialPosition.z;

    // if (i === 0 ) { console.info(this.perspectiveWidth); }
    // if (i === 0 ) { console.info(this.mask.scale); }
    // if (i === 0 ) { console.info(this.position.z); }
    // if (i === 0 ) { console.info(this.mask.position.z); }
    // if (i === 0 ) { console.info(x); }

    // this.mask.position.setX( x );
    // this.text.position.setX( x );
    // this.text.position.setY( 40 );
    // this.text.position.setZ( -150 );
    this.position.set( x, y, z );
    // this.mask.lookAt( camera.position );
    // this.text.lookAt( camera.position );

    this.scale.set( this.scaleFactor, this.scaleFactor, this.scaleFactor );
  }

  checkFocus( mousePoint ) {

    const point = {
      x: ( window.innerWidth * 0.5 ) * mousePoint.x,
      y: ( window.innerWidth * 0.5 ) * mousePoint.y * -1,
    };

    const box = this.getMaskPosition();

    if ( point.x >= box.left && point.x <= box.right && point.y >= box.bottom && point.y <= box.top ) {

      if (!this.isHover) {

        this.activeFocus();
        this.isHover = true;
      }

    } else if (this.isHover) {

      this.deactiveFocus();
      this.isHover = false;

    }
  }
}

export default ProjectContainer;
