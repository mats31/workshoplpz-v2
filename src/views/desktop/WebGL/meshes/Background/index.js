import States from 'core/States';

import vertexShader from './shaders/background.vs';
import fragmentShader from './shaders/background.fs';

class Background extends THREE.Object3D {

  constructor() {

    super();

    const map = States.resources.getTexture('background').media;
    map.LinearFilter = THREE.LinearFilter;
    map.repeat.set( 0.001, 0.001 );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.needsUpdate = true;

    this.geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        u_map: { type: 't', value: map },
      },
      wireframe: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    // this.addGUI()
  }

  // State --------------------------------------------

  scaleBackground( width, height ) {
    this.scale.set( width, height, 1 );
  }

  // Update --------------------------------------------

  update(time) {}
}

export default Background;
