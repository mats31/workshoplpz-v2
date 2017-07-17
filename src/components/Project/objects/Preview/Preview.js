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
    this.camera = options.camera;
    this.ratio = options.ratio;

    this.perspectiveSize = this.getPerspectiveSize( this.camera );

    this.width = options.width;
    this.height = options.height;
    this.fullHeight = options.fullHeight;
    this.initialWidth = 10;
    this.initialHeight = 10;

    this.geometry = new THREE.PlaneBufferGeometry( this.initialWidth, this.initialHeight, 30, 30);
    // this.geometry = new THREE.PlaneBufferGeometry( 70, 70, 30, 30);

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

    // console.log(this.perspectiveSize.width);
    // console.log(this.perspectiveSize.height);

    const customWidth = this.perspectiveSize.width * 0.2115;
    const customHeight = ( customWidth * this.ratio );

    const xScale = customWidth / this.initialWidth;
    const yScale = customHeight / this.initialHeight;
    const zScale = 1;
    this.scale.set( xScale, yScale, zScale );

    // const x = 0;
    // const y = ( this.fullHeight * 0.5 - this.height * 0.5 ) - ( ( this.margin + this.height ) * this.index);
    // const z = 0;
    // this.position.set( x, y, z );
    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  // States --------------------------------------------------------------------

  getPerspectiveSize( camera ) {

    const depth = camera.position.z - this.position.z;
    const hFOV = 2 * Math.atan( Math.tan( camera.fov / 2 ) * camera.aspect );
    const height = Math.abs( ( 2 * Math.tan( ( camera.fov / 2 ) ) * depth ) ) * 3.5;
    const width = Math.abs( ( 2 * Math.tan( ( hFOV / 2 ) ) * depth ) ) * 3.5;

    return { width, height };
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
