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
    this._parent = options.parent;

    this.perspectiveSize = this.getPerspectiveSize( this.camera );

    this.width = options.width;
    this.height = options.height;
    this.fullHeight = options.fullHeight;
    this.initialWidth = 10;
    this.initialHeight = 10;

    const customWidth = this.perspectiveSize.width;
    const customHeight = ( customWidth * this.ratio );
    const fullHeight = this.perspectiveSize.height;

    this.geometry = new THREE.PlaneBufferGeometry( this.initialWidth, this.initialHeight, 70, 70);
    // this.geometry = new THREE.PlaneBufferGeometry( 70, 70, 30, 30);

    const previewWind = States.resources.getTexture('preview-wind').media;
    previewWind.needsUpdate = true;
    previewWind.wrapS = THREE.RepeatWrapping;
    previewWind.wrapT = THREE.RepeatWrapping;

    const previewMask = States.resources.getTexture('preview-mask').media;
    previewMask.needsUpdate = true;
    this.material = new THREE.ShaderMaterial({
      wireframe: false,
      uniforms: {
        u_time: { type: 'f', value: 0 },
        u_resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
        u_translation: { type: 'v3', value: new THREE.Vector3(0, 0, 0) },
        u_map: { type: 't', value: this.texture },
        u_map_wind: { type: 't', value: previewWind },
        u_map_mask: { type: 't', value: previewMask },
      },
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    const xScale = customWidth / this.initialWidth;
    const yScale = customHeight / this.initialHeight;
    const zScale = 1;
    this.scale.set( xScale, yScale, zScale );


    const x = 0;
    const y = fullHeight / 2 - ( fullHeight / this.length ) * this.index - ( fullHeight * 0.5 / this.length );
    const z = 0;
    this.position.set( x, y, z );

    this.setupEvents();
    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  setupEvents() {
    Signals.onScroll.add(this.onScroll.bind(this));
  }

  // State ---------------------------------------------------------------------

  getPerspectiveSize( camera ) {

    const vFOV = camera.fov * Math.PI / 180;
    const height = 2 * Math.tan( vFOV / 2 ) * ( camera.position.z - this.position.z );
    const aspect = camera.aspect;
    const width = height * aspect;

    return { width, height };
  }

  // Events --------------------------------------------------------------------

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.material.uniforms.map.value = texture;
  }

  onScroll() {

    const wH = window.innerHeight;
    const top = this._parent.getBoundingClientRect().top - wH * 0.7;

    // console.log(top);

    if (top < 0) {
      TweenLite.to(
        this.material.uniforms.u_translation.value,
        3,
        {
          y: 1,
          ease: 'Expo.easeOut',
        },
      );

      this.material.uniforms.u_translation.value.z = 1;
      // TweenLite.to(
      //   this.material.uniforms.u_translation.value,
      //   0.2,
      //   {
      //     z: 1,
      //     ease: 'Expo.easeIn',
      //   },
      // );
    }
  }

  // Update --------------------------------------------------------------------

  update(time) {

    this.material.uniforms.u_time.value = time;
    // if (this.index === 0 ) console.log(this.material.uniforms.u_translation.value.z);
  }
}

export default Preview;
