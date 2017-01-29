import States from 'core/States';

import vertexMaskShader from './shaders/maskMesh.vs';
import fragmentMaskShader from './shaders/maskMesh.fs';

class Mask extends THREE.Object3D {

  constructor() {

    super();

    this.setup();
  }

  setup() {

    this.createMask();

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  createMask() {

    this.maskGeometry = new THREE.IcosahedronGeometry( 2.5, 0 );

    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this.maskUniforms = {
      ...baseUniforms,
      u_time: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( 0x000000 ) },
      specular: { value: new THREE.Color( 0x111111 ) },
    };

    this.maskMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexMaskShader,
      fragmentShader: fragmentMaskShader,
      uniforms: this.maskUniforms,
      wireframe: false,
      lights: true,
      // side: THREE.DoubleSide,
    });

    this.maskMesh = new THREE.Mesh(this.maskGeometry, this.maskMaterial);
    this.maskMesh.castShadow = true;
    // this.maskMesh.receiveShadow = true;
    this.add(this.maskMesh);
    // this.addGUI()
    console.log(new THREE.Box3().setFromObject(this.maskMesh));
  }

  getMaskMesh() {

    return this.maskMesh;
  }


  /* ****************** UPDATE ****************** */

  onAssetsLoaded() {

    console.log('test');

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.maskMaterial.uniforms.u_map.value = texture;
  }

  /* ****************** RENDER ****************** */

  update(time) {

    this.maskMaterial.uniforms.u_time.value = time;
    this.planeMesh.rotation.x += 0.1;
    this.planeMesh.rotation.y += 0.1;
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
