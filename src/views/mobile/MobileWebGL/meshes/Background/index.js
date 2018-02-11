import States from 'core/States';

import vertexShader from './shaders/background.vs';
import fragmentShader from './shaders/background.fs';

class Background extends THREE.Object3D {

  constructor() {

    super();

    // this.visible = false;

    const map = States.resources.getTexture('background').media;
    map.LinearFilter = THREE.LinearFilter;
    map.repeat.set( 0.001, 0.001 );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.needsUpdate = true;

    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        u_map: { type: 't', value: map },
        u_gradient: { type: 'v2', value: new THREE.Vector2(0.4, 0.6) },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

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
