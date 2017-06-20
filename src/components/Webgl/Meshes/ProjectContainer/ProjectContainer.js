import States from 'core/States';
import Mask from './Mask';
import Text from './Text';
import ProjectPlane from './ProjectPlane';
import modulo from 'utils/modulo';

class ProjectContainer extends THREE.Object3D {

  constructor(options) {

    super();

    this.setup(options);
  }

  setup(options) {

    this.isHover = false;
    this.isFocus = false;


    this.projectID = options.project.id;
    this.previewID = options.project.previewId;
    this.title = options.project.title;
    this.date = options.project.date;
    this.statut = options.project.statut;
    this.index = options.index;
    this.maskColor = options.project.color;

    this.initialPosition = new THREE.Vector3();

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

    this.mask.scale.set( 0.5, 0.5, 0.5 );
    // this.mask.position.set(this.getMaskWidth() * 0.5, 20, 100);
    // this.mask.position.set(0, 20, 100) ;
    // this.mask.rotation.x = 0.5;
    // this.mask.rotation.y = 0.5;

    // this.add(this.mask);
  }

  setupDescription() {

    this.texture2 = new THREE.Texture( States.resources.getImage('orange').media );
    this.texture2.wrapS = THREE.ClampToEdgeWrapping;
    this.texture2.wrapT = THREE.ClampToEdgeWrapping;
    // texture.minFilter = THREE.LinearMipMapNearestFilter;
    // this.texture2.minFilter = THREE.LinearFilter;
    // texture.magFilter = THREE.LinearMipMapNearestFilter;
    this.texture2.magFilter = THREE.NearestFilter;
    this.texture2.needsUpdate = true;

    document.body.appendChild(this.texture2.image);

    this.text = new Text({
      texture: this.texture2,
    });

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

  getProjectPlane() {

    return this.projectPlane;
  }

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
    this.mask.position.copy( pos );
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

    TweenLite.to(
      this.box,
      0.55,
      {
        opacity: 0,
        ease: 'Power2.easeIn',
      },
    );
  }

  // Events -----------------------------------------------

  onDOMMouseover() {

    this.activeFocus();
  }

  onDOMMouseleave() {

    this.deactiveFocus();
  }

  onClick() {

    if (this.isFocus) {

      Signals.onProjectClick.dispatch( this.projectID, this.position.y );

      const x = 0;
      const y = this.position.y + window.innerHeight * 2;

      this.mask.activateProject();
      this.projectPlane.activateProject();

      TweenLite.to(
        this.position,
        3.5,
        {
          x,
          y,
          ease: 'Power4.easeInOut',
        },
      );

      // TweenLite.delayedCall( 0.8, () => {

      this.projectPlane.displayPlane();
      // });
    }
  }

  update( time, translationEase, camera, i ) {

    // this.updateDOM(i);
    this.updatePosition( translationEase, camera, i );
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
    const width = 2 * Math.tan( ( hFOV / 2 ) ) * Math.abs( this.mask.position.z );
    const moduloLength = length + ( this.getMaskWidth() * 0.5 );
    const extraMargin = 15;
    const offset = Math.abs(width * 2) + ( this.getMaskWidth() * 0.5 ) + extraMargin;

    this.initialPosition.setX( this.initialPosition.x + translationEase );
    const x = modulo( this.initialPosition.x, moduloLength ) - offset;

    this.mask.position.setX( x );
    this.text.position.setX( x );
    this.text.position.setY( 40 );
    this.text.position.setZ( -150 );
    // this.position.setX( x );
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
