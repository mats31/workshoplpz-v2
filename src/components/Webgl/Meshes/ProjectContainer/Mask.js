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

    this.maskRender = false;
    this.easeValue = 0;

    this.createMask();

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  createMask() {

    // this.maskGeometry = new THREE.IcosahedronGeometry( 2.5, 0 );
    // this.maskGeometry = new THREE.IcosahedronGeometry( 200, 0 );
    // this.maskGeometry = new THREE.BoxGeometry( 2.5, 2.5, 2.5 );
    this.maskGeometry = new THREE.BoxGeometry( 200, 200, 200 );

    this.maskTexture = new MaskTexture();

    this.maskTextuteCanvas = new THREE.Texture( this.maskTexture.getCanvas() );
    this.maskTextuteCanvas.needsUpdate = true;
    this.maskTextuteCanvas.minFilter = THREE.LinearFilter;
    // this.maskTextuteCanvas.wrapS = THREE.RepeatWrapping;
    // this.maskTextuteCanvas.wrapT = THREE.RepeatWrapping;

    const noise = States.resources.getTexture('project-preview-noise').media;
    noise.needsUpdate = true;
    noise.minFilter = THREE.LinearFilter;
    noise.wrapS = THREE.RepeatWrapping;
    noise.wrapT = THREE.RepeatWrapping;

    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this.maskUniforms = {
      ...baseUniforms,
      // u_time: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( 0x000000 ) },
      specular: { value: new THREE.Color( 0x111111 ) },
      u_ease: { type: 'f', value: this.easeValue },
      u_mapNoise: { type: 't', value: this.maskTextuteCanvas },
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
    this.maskMesh.castShadow = true;
    // this.maskMesh.receiveShadow = true;
    // this.maskMesh.rotation.x = 0.8;
    // setInterval(()=>{this.maskMesh.rotation.x += 0.01;}, 2);
    this.add(this.maskMesh);
    // this.addGUI()
  }

  getMaskMesh() {

    return this.maskMesh;
  }

  /* ****************** STATE ****************** */

  activateMask() {

    this.maskRender = true;

    TweenLite.killTweensOf(this.maskUniforms.u_ease);
    TweenLite.to(
      this.maskUniforms.u_ease,
      0.5,
      {
        value: 1,
        ease: 'Expo.easeOut',
      },
    );
  }

  deactivateMask() {

    this.maskRender = false;

    TweenLite.killTweensOf(this.maskUniforms.u_ease);
    TweenLite.to(
      this.maskUniforms.u_ease,
      0.5,
      {
        value: 0,
        ease: 'Expo.easeOut',
      },
    );
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

    if (this.maskRender) {
      this.maskTexture.update();
      this.maskTextuteCanvas.needsUpdate = true;

      // console.log('ouesh');
      // this.maskTexture.update();
      // this.maskTextuteCanvas.needsUpdate = true;
      // this.maskMaterial.uniforms.u_time.value = time;
    }

    // this.maskTexture.update();
    // this.maskTextuteCanvas.needsUpdate = true;
    // this.maskMaterial.uniforms.u_time.value = time;
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
