import States from 'core/States';
import MaskTexture from './MaskTexture';

import vertexMaskShader from './shaders/maskMesh.vs';
import fragmentMaskShader from './shaders/maskMesh.fs';

class Mask extends THREE.Object3D {

  constructor() {

    super();

    this.setup();
  }

  setup() {

    this.tester = false;
    this.isMasking = false;
    this.maskRender = false;
    this.easeValue = 0;

    this.createMask();

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  createMask() {

    const model = States.resources.getModel('forme1').media;
    // console.log(model);

    // this.maskGeometry = new THREE.IcosahedronGeometry( 2.5, 0 );
    // this.maskGeometry = new THREE.IcosahedronGeometry( 200, 0 );
    // this.maskGeometry = new THREE.BoxGeometry( 2.5, 2.5, 2.5 );
    // this.maskGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    this.maskGeometry = model.children[0].geometry;

    this.maskTexture = new MaskTexture();

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
      u_time: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( 0x000000 ) },
      specular: { value: new THREE.Color( 0x111111 ) },
      u_ease: { type: 'f', value: this.easeValue },
      // u_mapNoise: { type: 't', value: noise },
      u_mapNoise: { type: 't', value: this.maskTextuteCanvas },
      u_mapCircle: { type: 't', value: circle },
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
    // this.maskMesh.castShadow = true;
    // this.maskMesh.receiveShadow = true;
    // this.maskMesh.rotation.x = 0.8;
    // setInterval(()=>{this.maskMesh.rotation.x += 0.01;}, 2);
    this.add(this.maskMesh);
    // this.addGUI()
  }

  // Getters -------------------------------------------------------------------

  getMaskTexture() {

    return this.maskTextuteCanvas;
  }

  getMaskMesh() {

    return this.maskMesh;
  }

  /* ****************** STATE ****************** */

  activateMask() {

    if (!this.isMasking) {

      this.isMasking = true;
      this.maskRender = true;

      TweenLite.to(
        this.maskUniforms.u_ease,
        0.5,
        {
          value: 1,
          ease: 'Power2.easeIn',
        },
      );
    }
  }

  deactivateMask() {

    if (this.isMasking) {

      this.isMasking = false;

      TweenLite.to(
        this.maskUniforms.u_ease,
        0.5,
        {
          value: 0,
          ease: 'Power2.easeIn',
          onComplete: () => {

            this.maskRender = false;
          },
        },
      );
    }
  }

  // activateProject() {
  //
  //   console.log(this.position.x);
  //   const x = 0;
  //   // const x = window.innerWidth * -0.5 + this.getMaskWidth() * 0.5;
  //   // const y = window.innerHeight * 2;
  //   const y = this.position.y + window.innerHeight * 2;
  //
  //   TweenLite.to(
  //     this.position,
  //     5,
  //     {
  //       x,
  //       y,
  //       ease: 'Power2.easeOut',
  //     },
  //   );
  // }

  /* ****************** GETTERS ****************** */

  getMaskWidth() {

    const box3 = new THREE.Box3().setFromObject( this );

    return Math.abs( box3.max.x - box3.min.x );
  }

  getMaskPosition() {

    const box3 = new THREE.Box3().setFromObject( this );

    return box3;
  }

  /* ****************** UPDATE ****************** */

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.maskMaterial.uniforms.u_map.value = texture;
  }

  /* ****************** RENDER ****************** */

  update( time ) {

    if (this.maskRender || this.tester) {
      // console.log(1);
      this.maskTexture.update();
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
