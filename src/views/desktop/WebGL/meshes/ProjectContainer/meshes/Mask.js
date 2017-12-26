import States from 'core/States';
import { lerp } from 'utils/math';

import vertexShader from '../shaders/mask.vs';
import fragmentShader from '../shaders/mask.fs';

class Mask extends THREE.Object3D {

  constructor(options) {

    super();

    this._defaultScale = new THREE.Vector3(1, 1, 1);
    this._squareScale = new THREE.Vector3();
    this._squareScaleEase = 0;
    this._perspectiveWidth = null;
    this._perspectiveHeight = null;
    this._projectState = false;
    this._isMasking = false;
    this._activeRotation = 1;
    this._easeValue = 0;
    this._morphValue = 0;
    this._initalMaskWidth = 0;
    this._initalMaskHeight = 0;
    this._color = options.color;

    this._createMask();
  }

  _createMask() {

    const startModel = States.resources.getModel('forme1-start').media;
    const finalModel = States.resources.getModel('forme1-final').media;

    this._maskGeometry = startModel.children[0].geometry;

    const length = this._maskGeometry.attributes.position.array.length;
    const randomColors = new Float32Array( parseInt( length / 3, 10 ) );

    for (let i = 0; i < length; i++ ) {

      const random = Math.random() * 0.6 + 0.5;

      randomColors[i] = random;
    }

    this._maskGeometry.addAttribute( 'a_finalPosition', new THREE.BufferAttribute( finalModel.children[0].geometry.attributes.position.array, 3 ) );
    this._maskGeometry.addAttribute( 'a_randomColor', new THREE.BufferAttribute( randomColors, 1 ) );

    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this._maskUniforms = {
      ...baseUniforms,
      u_color: { type: 'v3', value: new THREE.Color( this._color ) },
      u_direction: { type: 'v2', value: new THREE.Vector2( Math.random() > 0.5 ? 1 : -1, Math.random() > 0.5 ? 1 : -1 ) },
      u_resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
      u_time: { type: 'f', value: 0 },
      u_speed: { type: 'f', value: Math.random() * 0.35 + 0.1 },
      u_fullColor: { type: 'f', value: 0 },
      u_translationOffset: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( this._color ) },
      specular: { value: new THREE.Color( 0x111111 ) },
      u_ease: { type: 'f', value: this._easeValue },
      u_morph: { type: 'f', value: this._morphValue },
    };

    this._maskMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._maskUniforms,
      wireframe: false,
      lights: true,
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._maskGeometry, this._maskMaterial);
    this.add(this._mesh);

    this._initalMaskWidth = this.getMaskWidth();
    this._initalMaskHeight = this.getMaskHeight();
  }

  // State ---------------------------------------------------------------------

  activateMask() {

    if (!this._isMasking && !this._projectState) {

      this._isMasking = true;

      TweenLite.to(
        this._maskUniforms.u_ease,
        0.25,
        {
          value: 1,
          ease: 'Power2.easeInOut',
        },
      );
    }
  }

  deactivateMask() {

    if (this._isMasking && !this._projectState) {

      this._isMasking = false;

      TweenLite.to(
        this._maskUniforms.u_ease,
        0.7,
        {
          value: 0,
          ease: 'Power2.easeOut',
        },
      );
    }
  }

  activateProject() {

    const previousX = this.rotation.x;
    const previousY = this.rotation.y;
    this.rotation.x = 0;
    this.rotation.y = 0;

    // const scaleX = this._squareScale.x;
    // const scaleY = this._squareScale.y;

    this.rotation.x = previousX;
    this.rotation.y = previousY;

    this._projectState = true;

    TweenLite.to(
      this,
      1.5,
      {
        delay: 0.34,
        squareScaleEase: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this._maskMaterial.uniforms.u_morph,
      1.5,
      {
        delay: 0.34,
        value: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this._maskUniforms.u_fullColor,
      1.5,
      {
        delay: 0.34,
        value: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this,
      1.5,
      {
        activeRotation: 0,
        ease: 'Power4.easeInOut',
      },
    );
  }

  // Getters -------------------------------------------------------------------

  getMaskTexture() {

    return this._maskTextuteCanvas;
  }

  getMaskMesh() {

    return this._mesh;
  }

  getMaskWidth() {

    const box3 = new THREE.Box3().setFromObject( this );

    return Math.abs( box3.max.x - box3.min.x );
  }

  getMaskHeight() {

    const box3 = new THREE.Box3().setFromObject( this );

    return Math.abs( box3.max.y - box3.min.y );
  }

  getMaskPosition() {

    const box3 = new THREE.Box3().setFromObject( this );

    return box3;
  }

  // Update -------------------------------------------------------------------

  update( time ) {

    this._maskMaterial.uniforms.u_time.value = time;

    this._mesh.rotation.x = time * 0.01 * this._maskUniforms.u_speed.value * this._activeRotation;
    this._mesh.rotation.z = time * 0.01 * this._maskUniforms.u_speed.value * this._activeRotation;

    const scaleX = lerp( this._squareScaleEase, this._defaultScale.x, this._squareScale.x);
    const scaleY = lerp( this._squareScaleEase, this._defaultScale.y, this._squareScale.y);
    const scaleZ = lerp( this._squareScaleEase, this._defaultScale.z, this._squareScale.z);

    this.scale.set( scaleX, scaleY, scaleZ );
  }

  // Events --------------------------------------------------------------------

  resize( perspectiveWidth, perspectiveHeight ) {

    this._perspectiveWidth = perspectiveWidth;
    this._perspectiveHeight = perspectiveHeight;

    this._squareScale.set( perspectiveWidth / this._initalMaskWidth, perspectiveHeight / this._initalMaskHeight, 1 );
  }

}

export default Mask;
