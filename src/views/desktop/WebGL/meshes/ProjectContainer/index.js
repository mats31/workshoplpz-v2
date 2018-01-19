import States from 'core/States';
import { modulo } from 'utils/math';
import { active, objectVisible, toggle } from 'core/decorators';
import Mask from './meshes/Mask';
import Text from './meshes/Text';
import Preview from './meshes/Preview';

@active()
@objectVisible()
@toggle('pressed', 'press', 'unpress', false)
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
    this._spring = 0.005;
    this._friction = 0.85 + Math.random() * 0.05;
    this._currentTranslation = 0;
    this._targetTranslation = 0;
    this._velocityX = 0;
    this._targetPress = 0;
    this._currentPress = 0;

    this._isHover = false;
    this._isFocus = false;

    // this.visible = false;

    this._setupDescription();
    this._setupMask();
    this._setupPreview();
  }

  _setupMask() {

    this._mask = new Mask({
      color: this._maskColor,
    });

    this.add(this._mask);
  }

  _setupDescription() {

    this._textTexture = States.resources.getTexture('orange-text').media;
    // this._textTexture.wrapS = THREE.ClampToEdgeWrapping;
    // this._textTexture.wrapT = THREE.ClampToEdgeWrapping;
    this._textTexture.needsUpdate = true;

    this._text = new Text({
      texture: this._textTexture,
      initialY: this._index % 2 === 0 ? 12 : -12,
    });

    this.add(this._text);
  }

  _setupPreview() {
    this._previewTexture = States.resources.getTexture('orange-preview').media;

    this._preview = new Preview({
      texture: this._previewTexture,
    });

    this._preview.position.setZ(15);

    this.add(this._preview);
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

    // document.body.style.cursor = 'pointer';

    this._mask.focus();
    if (!this.active()) {
      this._preview.focus();
    }
  }

  deactiveFocus() {

    if (this._isFocus) {

      this._isFocus = false;

      // document.body.style.cursor = 'initial';

      this._mask.blur();
      this._preview.blur();
    }
  }

  showText({ delay = 0 } = {}) {
    this._text.show({ delay });
  }

  hideText({ delay = 0 } = {}) {
    this._text.hide({ delay });
  }

  goToProjectMode() {

    this.activate();
  }

  activate() {
    this._mask.activate();
    this._preview.blur();

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

  show({ delay = 0 } = {}) {
    this._mask.show({ delay });
  }

  hide({ delay = 0 } = {}) {
    this._mask.hide({ delay });
    this._text.hide({ transitionFromTop: false });
  }

  press() {
    this._targetPress = 3;
  }

  unpress() {
    this._targetPress = 0;
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

  update( time, delta, translationShow, maxTranslation, camera, length, i ) {

    // this._updateDOM(i);
    this._updatePosition( delta, translationShow, maxTranslation, camera, length, i );
    this._updateText();
    // this._checkFocus(point);
    this._mask.update( time );
    // this._projectPlane.update( time, delta );
  }

  _updateDOM() {

    this._box.style.left = `${this._getMaskPosition().left}px`;
    // this._box.style.top = `${( this._getMaskPosition().top - window.innerHeight * 0.5 ) * -1}px`;

    // if (i===1) console.log(this._getMaskPosition().left);
  }

  _updatePosition( delta, translationShow, maxTranslation, camera, length, i ) {

    // this._depthTranslation += ( maxTranslation * 5 - this._depthTranslation ) * 0.2;

    const maskWidth = this.getMaskWidth();
    const width = this._perspectiveSize.width;
    const moduloLength = length;
    const offset = width * 0.5 + maskWidth;

    this._targetTranslation += delta;
    const dx = this._targetTranslation - this._currentTranslation;
    const ax = dx * this._spring;

    this._velocityX += ax;
    this._velocityX *= this._friction;
    this._currentTranslation += this._velocityX;

    this._currentPress += ( this._targetPress - this._currentPress ) * 0.1;

    const xTranslation = this._initialPosition.x + this._currentTranslation + translationShow + offset;

    // const x = ( modulo( xTranslation, moduloLength ) - offset ) * ( 1 - this._offsetCenter.x ) - ( this._perspectiveWidth * 0.99 * this._offsetSide.x );
    const x = ( modulo( xTranslation, moduloLength ) - offset ) * ( 1 - this._offsetCenter.x );
    const y = this._initialPosition.y + ( ( this._topPosition - this._initialPosition.y ) * this._offsetCenter.y );
    const z = this._initialPosition.z - this._currentPress;

    this.position.set( x, y, z );

    // if (x <= this._perspectiveSize.width * 0.5 && x > this._perspectiveSize.width * -0.5) {
    //   this.visible = true;
    // } else {
    //   this.visible = false;
    // }

    this.scale.set( this._scaleFactor, this._scaleFactor, this._scaleFactor );
  }
  _updateText() {
    this._text.position.setX(this._velocityX * 2);
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
