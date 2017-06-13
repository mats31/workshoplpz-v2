import States from 'core/States';
import MaskTexture from './MaskTexture';

import vertexMaskShader from './shaders/maskMesh.vs';
import fragmentMaskShader from './shaders/maskMesh.fs';

class Mask extends THREE.Object3D {

  constructor(options) {

    super();

    this.projectState = false;
    this.isMasking = false;
    this.maskRender = false;
    this.easeValue = 0;
    this.morphValue = 0;
    this.scaleValue = 0;
    this.color = options.color;

    this.setup();
  }

  setup() {

    this.createMask();
    this.setupEvent();
  }

  createMask() {

    const startModel = States.resources.getModel('forme1-start').media;
    const finalModel = States.resources.getModel('forme1-final').media;
    // console.log(startModel);

    // this.maskGeometry = new THREE.IcosahedronGeometry( 2.5, 0 );
    // this.maskGeometry = new THREE.IcosahedronGeometry( 200, 0 );
    // this.maskGeometry = new THREE.BoxGeometry( 2.5, 2.5, 2.5 );
    // this.maskGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.maskGeometry = startModel.children[0].geometry;

    const length = this.maskGeometry.attributes.position.array.length;
    const randomColors = new Float32Array( parseInt( length / 3, 10 ) );

    for (var i = 0; i < length; i++ ) {

      const random = Math.random() * 4 + 1;

      randomColors[ i ] = random;
    }

    this.maskGeometry.addAttribute( 'a_finalPosition', new THREE.BufferAttribute( finalModel.children[0].geometry.attributes.position.array, 3 ) );
    this.maskGeometry.addAttribute( 'a_randomColor', new THREE.BufferAttribute( randomColors, 1 ) );

    this.maskTexture = new MaskTexture({
      size: 216,
      points: 25,
    });

    this.maskTextuteCanvas = new THREE.Texture( this.maskTexture.getCanvas() );
    this.maskTextuteCanvas.needsUpdate = true;
    this.maskTextuteCanvas.minFilter = THREE.LinearFilter;
    // this.maskTextuteCanvas.wrapS = THREE.RepeatWrapping;
    // this.maskTextuteCanvas.wrapT = THREE.RepeatWrapping;

    const noise = States.resources.getTexture('project-preview-noise').media;
    noise.needsUpdate = true;
    noise.minFilter = THREE.LinearFilter;

    const circle = States.resources.getTexture('project-preview-circle').media;
    circle.needsUpdate = true;
    circle.minFilter = THREE.LinearFilter;

    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this.maskUniforms = {
      ...baseUniforms,
      u_color: { type: 'v3', value: new THREE.Color( this.color ) },
      u_time: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( this.color ) },
      specular: { value: new THREE.Color( 0x111111 ) },
      u_ease: { type: 'f', value: this.easeValue },
      u_morph: { type: 'f', value: this.morphValue },
      u_mapDisplacement: { type: 't', value: noise },
      u_mapNoise: { type: 't', value: this.maskTextuteCanvas },
      u_mapCircle: { type: 't', value: circle },
      u_alpha: { type: 'f', value: 1 },
    };

    this.maskMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexMaskShader,
      fragmentShader: fragmentMaskShader,
      uniforms: this.maskUniforms,
      wireframe: false,
      lights: true,
      transparent: true,
      // side: THREE.DoubleSide,
    });

    this.maskMesh = new THREE.Mesh(this.maskGeometry, this.maskMaterial);
    this.maskMesh.scale.set( 2, 2, 2 );
    // this.maskMesh.castShadow = true;
    // this.maskMesh.receiveShadow = true;
    // this.maskMesh.rotation.x = 0.8;
    // setInterval(()=>{this.maskMesh.rotation.x += 0.01;}, 2);
    this.add(this.maskMesh);
    // this.addGUI()

    console.log(this.maskMesh);
  }

  setupEvent() {

    Signals.onResize.add( this.onResize.bind(this) );
  }

  // State ---------------------------------------------------------------------

  activateMask() {

    if (!this.isMasking && !this.projectState) {

      this.isMasking = true;
      this.maskRender = true;

      TweenLite.to(
        this.maskUniforms.u_ease,
        1.15,
        {
          value: 1,
          ease: 'Power2.easeInOut',
        },
      );

      TweenLite.to(
        this,
        1.15,
        {
          scaleValue: 0.65,
          ease: 'Power2.easeInOut',
        },
      );
    }
  }

  deactivateMask() {

    console.log('deactive');

    if (this.isMasking && !this.projectState) {

      this.isMasking = false;

      TweenLite.to(
        this,
        0.7,
        {
          scaleValue: 0,
          ease: 'Power2.easeOut',
        },
      );

      TweenLite.to(
        this.maskUniforms.u_ease,
        0.7,
        {
          value: 0,
          ease: 'Power2.easeOut',
          onComplete: () => {

            this.maskRender = false;
          },
        },
      );
    }
  }

  activateProject() {

    const previousX = this.rotation.x;
    const previousY = this.rotation.y;
    this.rotation.x = 0;
    this.rotation.y = 0;

    const scaleX = this.wW / this.getMaskWidth();
    const scaleY = this.wH / this.getMaskHeight();

    this.rotation.x = previousX;
    this.rotation.y = previousY;

    this.projectState = true;

    TweenLite.to(
      this,
      1,
      {
        scaleValue: 0,
        // ease: 'Power4.easeOut',
        onComplete: () => {
          this.maskRender = false;
          Signals.onProjectAnimationDone.dispatch();
        },
      },
    );

    TweenLite.to(
      this.scale,
      3.5,
      {
        delay: 1,
        x: scaleX,
        y: scaleY,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this.rotation,
      3.5,
      {
        delay: 1,
        x: 0,
        y: 0,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.to(
      this.maskMaterial.uniforms.u_morph,
      3.5,
      {
        delay: 1,
        value: 1,
        ease: 'Power4.easeInOut',
      },
    );

    TweenLite.delayedCall(4.5, () => {

      this.maskRender = true;

      TweenLite.to(
        this.maskUniforms.u_ease,
        0.3,
        {
          value: 1,
          ease: 'Power2.easeIn',
        },
      );

      TweenLite.to(
        this,
        5,
        {
          scaleValue: 1.5,
          ease: 'Power4.easeOut',
        },
      );

      TweenLite.to(
        this.maskUniforms.u_alpha,
        1.5,
        {
          delay: 1,
          value: 0,
          onComplete: () => {
            this.maskRender = false;

          }
        },
      );

    });
  }

  // Getters -------------------------------------------------------------------

  getMaskTexture() {

    return this.maskTextuteCanvas;
  }

  getMaskMesh() {

    return this.maskMesh;
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

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.maskMaterial.uniforms.u_map.value = texture;
  }

  /* ****************** RENDER ****************** */

  update( time ) {

    if (this.maskRender) {

      this.maskTexture.update(this.scaleValue);
      this.maskTextuteCanvas.needsUpdate = true;

      // console.log('ouesh');
      // this.maskTexture.update();
      // this.maskTextuteCanvas.needsUpdate = true;
      // this.maskMaterial.uniforms.u_time.value = time;
    }

    // this.maskTexture.update();
    // this.maskTextuteCanvas.needsUpdate = true;
    this.maskMaterial.uniforms.u_time.value = time;
    // this.maskMesh.rotation.y += 0.01;


    // this.maskMesh.rotation.x += 0.1;
  }

  // Events --------------------------------------------------------------------

  onResize( wW, wH ) {

    this.wW = wW;
    this.wH = wH;
  }

  // addGUI() {
  //   this.GUI = helpers.GUI
  //   const positionFolder = this.GUI.addFolder({ label: 'Cube Position' })
  //   const scaleFolder = this.GUI.addFolder({ label: 'Cube Scale' })
  //
  //   positionFolder.add(this.position, 'x', { label: 'position x', min: -20, max: 20, step: 1 })
  //   positionFolder.add(this.position, 'y', { label: 'position y', min: -20, max: 20, step: 1 })
  //   positionFolder.add(this.position, 'z', { label: 'position z', min: -20, max: 20, step: 1 })
  //
  //   scaleFolder.add(this.scale, 'x', { label: 'scale x', min: 0, max: 10, step: 0.1 })
  //   scaleFolder.add(this.scale, 'y', { label: 'scale y', min: 0, max: 10, step: 0.1 })
  //   scaleFolder.add(this.scale, 'z', { label: 'scale z', min: 0, max: 10, step: 0.1 })
  // }
}

export default Mask;
