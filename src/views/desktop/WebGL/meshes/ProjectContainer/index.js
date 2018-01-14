import States from 'core/States';
import { modulo } from 'utils/math';
import { active, objectVisible } from 'core/decorators';
import { getPerspectiveSize } from 'utils/3d';
import Mask from './meshes/Mask';
import Text from './meshes/Text';

@active()
@objectVisible()
class ProjectContainer extends THREE.Object3D {

  constructor(options) {

    super();

    this._topPosition = options.topPosition;
    this.projectID = options.project.id;
    this._previewID = options.project.previewId;
    this._title = options.project.title;
    this._date = options.project.date;
    this._statut = options.project.statut;
    this._index = options.index;
    this._maskColor = options.project.color;

    this._initialPosition = new THREE.Vector3();
    this._offsetCenter = new THREE.Vector2();
    this._offsetSide = new THREE.Vector2();

    this._perspectiveSize = {
      width: 0,
      height: 0,
    };

    this._depthTranslation = 0;
    this._perspectiveWidth = 0;
    this._scaleFactor = 1;

    this._isHover = false;
    this._isFocus = false;

    this._texture = States.resources.getTexture(this._previewID).media;
    this._texture.minFilter = THREE.LinearFilter;
    this._texture.needsUpdate = true;

    // this.visible = false;

    this._setupMask();
    // this._setupDescription();
  }

  _setupMask() {

    this._mask = new Mask({
      color: this._maskColor,
    });

    this.add(this._mask);
  }

  _setupDescription() {

    this._texture2 = new THREE.Texture();
    // this._texture2 = new THREE.Texture( States.resources.getImage('orange').media );
    this._texture2.wrapS = THREE.ClampToEdgeWrapping;
    this._texture2.wrapT = THREE.ClampToEdgeWrapping;
    this._texture2.needsUpdate = true;

    this._text = new Text({
      texture: this._texture2,
    });

    this._text.position.setY( this._index % 2 === 0 ? 13 : -13 );
    this._text.position.setZ( -10 );

    this.add(this._text);
  }

  // Getters --------------------------------------------------------------------

  getMask() {

    return this._mask;
  }

  getMaskPosition() {

    const box3 = new THREE.Box3().setFromObject( this._mask );

    return {
      left: box3.max.x * -1,
      top: box3.max.y,
      right: box3.min.x * -1,
      bottom: box3.min.y,
    };
  }

  getMaskWidth() {

    return this._mask.getMaskWidth();
  }

  // State ---------------------------------------------------------------------

  deActiveRaycast() {

    this.deactiveFocus();
    this._isHover = false;
  }

  activeRaycast() {

    this._activeFocus();
    this._isHover = true;
  }

  setInitialPosition( pos ) {
    this._initialPosition.copy( pos );
  }

  _activeFocus() {

    this._isFocus = true;

    document.body.style.cursor = 'pointer';

    this._mask.focus();
  }

  deactiveFocus() {

    if (this._isFocus) {

      this._isFocus = false;

      document.body.style.cursor = 'initial';

      this._mask.blur();
    }
  }

  hideText() {

    // this._text.hide();
  }

  goToProjectMode() {

    this.activate();
  }

  activate() {
    this._mask.activate();

    TweenLite.to(
      this._offsetCenter,
      1.5,
      {
        x: 1,
        y: 1,
        ease: 'Power4.easeInOut',
        onComplete: () => {
          this.deactivate();
        },
      },
    );
  }

  deactivate() {
    this._mask.deactivate();

    this._offsetCenter.set(0, 0);
  }

  show() {}

  hide() {
    this._mask.hide();
  }

  // Events --------------------------------------------------------------------

  onDOMMouseover() {

    this._activeFocus();
  }

  onDOMMouseleave() {

    this.deactiveFocus();
  }

  onClick() {

    if (this._isFocus) {

      Signals.onProjectClick.dispatch( this.projectID, this._index );
    }
  }

  resize( camera, perspectiveSize ) {
    this._perspectiveSize = perspectiveSize;

    // const perspectiveSize = getPerspectiveSize( camera, this.position.z );
    //
    // const depth = Math.abs( this.position.z );
    // const hFOV = 2 * Math.atan( Math.tan( fov / 2 ) * aspect );
    // this._perspectiveHeight = Math.abs( ( 2 * Math.tan( ( fov / 2 ) ) * depth ) * 3.5 );
    // this._perspectiveWidth = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * depth ) * 3.5 );
    this._mask.resize( camera, this.position.z );

    // if (!States.application.activateProject) {
    //
    //   this._scaleFactor = _scaleFactor;
    // }
  }

  // Update --------------------------------------------------------------------

  update( time, translationEase, maxTranslation, camera, length, i ) {

    // this._updateDOM(i);
    this._updatePosition( translationEase, maxTranslation, camera, length, i );
    // this._checkFocus(point);
    this._mask.update( time );
    // this._text.update( time );
    // this._projectPlane.update( time, translationEase );
  }

  _updateDOM() {

    this._box.style.left = `${this._getMaskPosition().left}px`;
    // this._box.style.top = `${( this._getMaskPosition().top - window.innerHeight * 0.5 ) * -1}px`;

    // if (i===1) console.log(this._getMaskPosition().left);
  }

  _updatePosition( translationEase, maxTranslation, camera, length, i ) {

    // if (i === 0) {
    //   this.visible = true;
    // } else {
    //   this.visible = false;
    // }

    this._depthTranslation += ( maxTranslation * 5 - this._depthTranslation ) * 0.2;

    const maskWidth = this.getMaskWidth();
    const width = this._perspectiveSize.width;
    const moduloLength = length;
    const offset = width * 0.5 + maskWidth;

    const xTranslation = this._initialPosition.x + translationEase;
    const x = ( modulo( xTranslation, moduloLength ) - offset ) * ( 1 - this._offsetCenter.x ) - ( this._perspectiveWidth * 0.99 * this._offsetSide.x );
    const y = this._initialPosition.y + ( ( this._topPosition - this._initialPosition.y ) * this._offsetCenter.y );
    const z = this._initialPosition.z - this._depthTranslation;

    this.position.set( x, y, z );

    this.scale.set( this._scaleFactor, this._scaleFactor, this._scaleFactor );
  }

  checkFocus( mousePoint ) {

    const point = {
      x: ( window.innerWidth * 0.5 ) * mousePoint.x,
      y: ( window.innerWidth * 0.5 ) * mousePoint.y * -1,
    };

    const box = this._getMaskPosition();

    if ( point.x >= box.left && point.x <= box.right && point.y >= box.bottom && point.y <= box.top ) {

      if (!this._isHover) {

        this._activeFocus();
        this._isHover = true;
      }

    } else if (this._isHover) {

      this.deactiveFocus();
      this._isHover = false;

    }
  }
}

export default ProjectContainer;
