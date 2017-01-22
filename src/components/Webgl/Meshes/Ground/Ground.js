import States from 'core/States';

import vertexShader from './shaders/ground.vs';
import fragmentShader from './shaders/ground.fs';
import vertexDepthShader from './shaders/groundDepth.vs';

class Ground extends THREE.Object3D {

  constructor() {

    super();

    // const map = States.resources.getTexture('uv').media;
    // map.needsUpdate = true;
    // map.LinearFilter = THREE.LinearFilter;

    this.geometry = new THREE.PlaneGeometry( 300, 300, 100, 100 );


    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this.uniforms = {
      ...baseUniforms,
      u_time: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( 0x000000 ) },
      specular: { value: new THREE.Color( 0x111111 ) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      wireframe: false,
      lights: true,
      // side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    // this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.customDepthMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexDepthShader,
      fragmentShader: THREE.ShaderLib.depth.fragmentShader,
      uniforms: this.material.uniforms,
    });
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

export default Ground;
