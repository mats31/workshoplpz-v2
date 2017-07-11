import States from 'core/States';

import vertexShader from './shaders/preview.vs';
import fragmentShader from './shaders/preview.fs';

class Preview extends THREE.Object3D {

  constructor(options) {

    super();

    this.index = options.index;
    this.texture = options.texture;
    this.texture.minFilter = THREE.LinearFilter;
    this.margin = options.margin;
    this.length = options.length;

    // this.ratio = this.texture.image.naturalHeight / this.texture.image.naturalWidth;

    this.width = options.width;
    this.height = options.height;
    this.fullHeight = options.fullHeight;

    this.geometry = new THREE.PlaneBufferGeometry( this.width, this.height, 1, 1);

    this.material = new THREE.ShaderMaterial({
      wireframe: false,
      uniforms: {
        u_time: { type: 'f', value: 0 },
        u_map: { type: 't', value: this.texture },
      },
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    const x = 0;
    const y = ( this.fullHeight * 0.5 - this.height * 0.5 ) - ( ( this.margin + this.height ) * this.index);
    const z = 0;
    this.position.set( x, y, z );

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.material.uniforms.map.value = texture;
  }

  update(time) {

    this.material.uniforms.u_time.value = time;
  }
}

export default Preview;
