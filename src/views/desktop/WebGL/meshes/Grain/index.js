import States from 'core/States';
import { toggle } from 'core/decorators';

import vertexShader from './shaders/grain.vs';
import fragmentShader from './shaders/grain.fs';

@toggle('objVisible', 'show', 'hide', true)
class Grain extends THREE.Object3D {

  constructor() {
    super();

    const map = States.resources.getTexture('grain').media;
    // map.LinearFilter = THREE.LinearFilter;
    // map.repeat.set( 0.001, 0.001 );
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
        u_alpha: { type: 'f', value: 1 },
        uTime: { type: 'f', value: 0 },
        uRes: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  scaleGrain( width, height ) {
    this._material.uniforms.uRes.value.set(window.innerWidth, window.innerHeight);
    this.scale.set( width, height, 1 );
  }

  show({ delay = 0 } = {}) {
    TweenLite.to(
      this._material.uniforms.u_alpha,
      4,
      {
        value: 1,
        delay,
        ease: 'Power2.easeOut',
      },
    );
  }

  hide({ delay = 0 } = {}) {
    TweenLite.to(
      this._material.uniforms.u_alpha,
      4,
      {
        value: 0,
        delay,
        ease: 'Power2.easeOut',
      },
    );
  }

  update(time) {
    this._material.uniforms.uTime.value = time;
  }
}

export default Grain;
