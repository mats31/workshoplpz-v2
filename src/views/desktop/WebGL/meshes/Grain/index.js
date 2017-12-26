import States from 'core/States';

import vertexShader from './shaders/grain.vs';
import fragmentShader from './shaders/grain.fs';

class Grain extends THREE.Object3D {

  constructor() {
    super();

    const map = States.resources.getTexture('grain').media;
    map.LinearFilter = THREE.LinearFilter;
    map.repeat.set( 0.001, 0.001 );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.needsUpdate = true;

    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      // side: THREE.DoubleSide,
      uniforms: {
        u_map: { type: 't', value: map },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  scaleGrain( width, height ) {
    this.scale.set( width, height, 1 );
  }

  update(time) {}
}

export default Grain;
