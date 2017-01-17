import States from 'core/States';

import vertexShader from './shaders/ground.vs';
import fragmentShader from './shaders/ground.fs';

class Cube extends THREE.Object3D {

  constructor() {

    super();

    // const map = States.resources.getTexture('uv').media;
    // map.needsUpdate = true;
    // map.LinearFilter = THREE.LinearFilter;

    this.geometry = new THREE.PlaneGeometry( 100, 100, 30, 30 );

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      // uniforms: THREE.UniformsUtils.merge([
      //   THREE.UniformsLib.common,
      //   THREE.UniformsLib.aomap,
      //   THREE.UniformsLib.lightmap,
      //   THREE.UniformsLib.emissivemap,
      //   THREE.UniformsLib.fog,
      //   THREE.UniformsLib.lights,
      //   {
      //     emissive: { value: new THREE.Color( 0x000000 ) },
      //     u_time: { type: 'f', value: new THREE.Texture() },
      //   },
      // ]),
      uniforms: {
        u_time: { type: 'f', value: new THREE.Texture() },
      },
      wireframe: false,
      // side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.add(this.mesh);

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));

    // this.addGUI()
  }


  /* ****************** UPDATE ****************** */

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.material.uniforms.map.value = texture;
  }

  /* ****************** RENDER ****************** */

  update(time) {

    this.material.uniforms.u_time.value = time;
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

export default Cube;
