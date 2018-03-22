import States from 'core/States';
import { active, focused, objectVisible } from 'core/decorators';
import { lerp } from 'utils/math';
import { getPerspectiveSize } from 'utils/3d';

import vertexShader from '../shaders/mask.vs';
import fragmentShader from '../shaders/mask.fs';
import accessoryVertex from '../shaders/accessory.vs';
import accessoryFragment from '../shaders/accessory.fs';

@active()
@objectVisible()
@focused()
class Mask extends THREE.Object3D {

  constructor(options) {

    super();

    this._defaultScale = new THREE.Vector3(0.9, 0.9, 0.9);
    // this._defaultScale = new THREE.Vector3(0.75, 0.75, 0.75);
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
    this.projectID = options.projectID;

    this._createMask();
    this._createAccessory();

    this.visible = true;
  }

  _createMask() {

    const startModel = States.resources.getModel('forme1-start').media;
    const finalModel = States.resources.getModel('forme1-final').media;

    this._maskGeometry = startModel.children[0].geometry;

    const length = this._maskGeometry.attributes.position.array.length;
    const floatLength = parseInt( length / 3, 10 );
    const randomColors = new Float32Array( floatLength );

    let j = 0;
    for (let i = 0; i < floatLength; i += 3 ) {

      let random;

      // if (i > floatLength * 0.4) {
      //   random = 0;
      //   j = 0;
      // } else {
      //   random = 1;
      //   j++;
      // }
      if (i % 2 === 0) {
        random = 1;
        j = 0;
      } else {
        random = 1;
        j++;
      }
      // const random = Math.random() * 0.6 + 0.5;

      randomColors[i] = random;
      randomColors[i + 1] = random;
      randomColors[i + 2] = random;
      // randomColors[i + 3] = random;
      // randomColors[i + 4] = random;
      // randomColors[i + 5] = random;
      // randomColors[i + 6] = random;
      // randomColors[i + 7] = random;
      // randomColors[i + 8] = random;
    }

    this._maskGeometry.addAttribute( 'a_finalPosition', new THREE.BufferAttribute( finalModel.children[0].geometry.attributes.position.array, 3 ) );
    this._maskGeometry.addAttribute( 'a_randomColor', new THREE.BufferAttribute( randomColors, 1 ) );

    const texture = States.resources.getTexture(`${this.projectID}-preview`).media;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;

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
      u_alpha: { type: 'f', value: 1 },
      t_diffuse: { type: 't', value: texture },
    };

    this._maskMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this._maskUniforms,
      wireframe: false,
      lights: true,
      transparent: true,
      side: THREE.DoubleSide,
    });

    this._mesh = new THREE.Mesh(this._maskGeometry, this._maskMaterial);
    this.add(this._mesh);

    this._initalMaskWidth = this.getMaskWidth();
    this._initalMaskHeight = this.getMaskHeight();
  }

  _createAccessory() {
    console.log(this.projectID);
    const accessoryObject = States.resources.getModel(this.projectID).media;

    const accessoryGeometry1 = accessoryObject.children[0].geometry.clone();
    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    const accessoryMaterial1 = new THREE.ShaderMaterial({
      uniforms: {
        ...baseUniforms,
        emissive: { value: new THREE.Color( this._color ) },
        specular: { value: new THREE.Color( 0x111111 ) },
        u_time: { value: 0, type: 'f' },
        uPos: { value: 0, type: 'f' },
        uAlpha: { value: 1, type: 'f' },
      },
      lights: true,
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: accessoryVertex,
      fragmentShader: accessoryFragment,
    });

    const accessoryGeometry2 = accessoryObject.children[0].geometry.clone();
    const accessoryMaterial2 = new THREE.ShaderMaterial({
      uniforms: {
        ...baseUniforms,
        emissive: { value: new THREE.Color( this._color ) },
        specular: { value: new THREE.Color( 0x111111 ) },
        u_time: { value: 0, type: 'f' },
        uPos: { value: Math.PI, type: 'f' },
        uAlpha: { value: 1, type: 'f' },
      },
      lights: true,
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: accessoryVertex,
      fragmentShader: accessoryFragment,
    });

    this._accessory1 = new THREE.Mesh( accessoryGeometry1, accessoryMaterial1 );
    this._accessory2 = new THREE.Mesh( accessoryGeometry2, accessoryMaterial2 );

    this._accessory1.scale.set(0.075, 0.075, 0.075);
    this._accessory1.position.set(0, 0, 0);
    this._accessory1.rotation.y = Math.PI * 0.7;
    // this._accessoryObject1 = new THREE.Object3D();
    // this._accessoryObject1.add(this._accessory1);

    this._accessory2.scale.set(0.075, 0.075, 0.075);
    this._accessory2.position.set(0, 0, 0);
    this._accessory2.rotation.y = Math.PI * 0.7;

    this._accessory1.position.x = Math.cos( this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14;
    this._accessory1.position.z = Math.sin( this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14;
    this._accessory1.rotation.x = this._accessory1.material.uniforms.uPos.value + Math.PI * 0.8;
    this._accessory1.rotation.y = this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2;
    this._accessory1.rotation.z = this._accessory1.material.uniforms.uPos.value + Math.PI * 1;

    this._accessory2.position.x = Math.cos( this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14;
    this._accessory2.position.z = Math.sin( this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14;
    this._accessory2.rotation.x = this._accessory2.material.uniforms.uPos.value + Math.PI * 0.8;
    this._accessory2.rotation.y = this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2;
    this._accessory2.rotation.z = this._accessory2.material.uniforms.uPos.value + Math.PI * 1;

    this.add(this._accessory1);
    this.add(this._accessory2);
  }

  // State ---------------------------------------------------------------------

  focus() {

    // if (!this._isMasking && !this._projectState) {

    this._isMasking = true;

    TweenLite.to(
      this._maskUniforms.u_ease,
      0.25,
      {
        value: 1,
        ease: 'Power2.easeInOut',
      },
    );
    // }
  }

  blur() {

    // if (this._isMasking && !this._projectState) {

    this._isMasking = false;

    TweenLite.to(
      this._maskUniforms.u_ease,
      0.7,
      {
        value: 0,
        ease: 'Power2.easeOut',
      },
    );
    // }
  }

  activate() {

    this._projectState = true;

    TweenLite.to(
      this,
      1.5,
      {
        _activeRotation: 0,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this,
      1.5,
      {
        delay: 0.34,
        _squareScaleEase: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this._maskUniforms.u_morph,
      1.5,
      {
        delay: 0.34,
        value: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this._maskUniforms.u_fullColor,
      1,
      {
        delay: 0.34,
        value: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.killTweensOf(this._accessory1.material.uniforms.uAlpha);
    TweenLite.to(
      this._accessory1.material.uniforms.uAlpha,
      0.5,
      {
        value: 0,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._accessory2.material.uniforms.uAlpha);
    TweenLite.to(
      this._accessory2.material.uniforms.uAlpha,
      0.5,
      {
        value: 0,
        ease: 'Power2.easeOut',
      },
    );
  }

  deactivate() {
    TweenLite.killTweensOf([this, this._maskUniforms.u_ease, this._maskUniforms.u_morph, this._maskUniforms.u_fullColor]);
    this._activeRotation = 1;
    this._squareScaleEase = 0;
    this._maskMaterial.uniforms.u_morph.value = 0;
    this._maskUniforms.u_fullColor.value = 0;
    this._maskUniforms.u_ease.value = 0;
    this._accessory1.material.uniforms.uAlpha.value = 1;
    this._accessory2.material.uniforms.uAlpha.value = 1;
  }

  show({ delay = 0 } = {}) {
    this.visible = true;
    TweenLite.killTweensOf(this._maskUniforms.u_alpha);
    TweenLite.to(
      this._maskUniforms.u_alpha,
      1,
      {
        delay,
        value: 1,
        ease: 'Power2.easeOut',
      },
    );
  }

  hide({ delay = 0 } = {}) {
    TweenLite.killTweensOf(this._maskUniforms.u_alpha);
    TweenLite.to(
      this._maskUniforms.u_alpha,
      0.7,
      {
        delay,
        value: 0,
        ease: 'Power2.easeOut',
        onComplete: () => {
          if (this.parent) {
            this.visible = false;
          }
        },
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

    // if (this._accessoryNeedsUpdate) {
    //   this._accessory1.position.x += ( Math.cos( this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14 - this._accessory1.position.x ) * 0.1;
    //   this._accessory1.position.z += ( Math.sin( this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14 - this._accessory1.position.z ) * 0.1;
    //   this._accessory1.rotation.x = this._accessory1.material.uniforms.uPos.value + Math.PI * 0.8;
    //   this._accessory1.rotation.y = this._accessory1.material.uniforms.uPos.value + Math.PI * 0.2;
    //   this._accessory1.rotation.z = this._accessory1.material.uniforms.uPos.value + Math.PI * 1;
    //
    //   this._accessory2.position.x += ( Math.cos( this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14 - this._accessory2.position.x ) * 0.1;
    //   this._accessory2.position.z += ( Math.sin( this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2 ) * 14 - this._accessory2.position.z ) * 0.1;
    //   this._accessory2.rotation.x = this._accessory2.material.uniforms.uPos.value + Math.PI * 0.8;
    //   this._accessory2.rotation.y = this._accessory2.material.uniforms.uPos.value + Math.PI * 0.2;
    //   this._accessory2.rotation.z = this._accessory2.material.uniforms.uPos.value + Math.PI * 1;
    // }

    this._maskMaterial.uniforms.u_time.value = time;

    // this._mesh.rotation.x = time * 0.1 * this._maskUniforms.u_speed.value * this._activeRotation;
    // this._mesh.rotation.z = time * 0.1 * this._maskUniforms.u_speed.value * this._activeRotation;

    this._mesh.rotation.x = Math.sin( time * 0.025 * this._maskUniforms.u_speed.value ) * Math.PI * this._activeRotation;
    this._mesh.rotation.z = Math.sin( time * 0.025 * this._maskUniforms.u_speed.value ) * Math.PI * this._activeRotation;

    // this._mesh.rotation.x += 0.1;
    // this._mesh.rotation.y += 0.1;
    // this._mesh.rotation.z += 0.1;

    const scaleX = lerp( this._squareScaleEase, this._defaultScale.x, this._squareScale.x);
    const scaleY = lerp( this._squareScaleEase, this._defaultScale.y, this._squareScale.y);
    const scaleZ = lerp( this._squareScaleEase, this._defaultScale.z, this._squareScale.z);

    this.scale.set( scaleX, scaleY, scaleZ );
  }

  // Events --------------------------------------------------------------------

  resize( camera, containerDepth ) {

    const perspectiveSize = getPerspectiveSize( camera, containerDepth );

    this._squareScale.set( perspectiveSize.width / this._initalMaskWidth, perspectiveSize.height / this._initalMaskHeight, 1 );
  }

}

export default Mask;
