import States from 'core/States';

import vertexTextShader from './shaders/text.vs';
import fragmentTextShader from './shaders/text.fs';

class Mask extends THREE.Object3D {

  constructor(options) {

    super(options);

    this.texture = options.texture;

    this.setup();
  }

  setup() {

    this.setupText();
    // this.setupEvent();
  }

  setupText() {

    // this.geometry = new THREE.PlaneBufferGeometry( 20, 20, 1, 1);
    this.geometry = new THREE.PlaneBufferGeometry( 20, 20, 1, 1);
    // this.geometry = new THREE.PlaneBufferGeometry( 100, 25.55555556, 1, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader: vertexTextShader,
      fragmentShader: fragmentTextShader,
      uniforms: {
        u_map: { type: 't', value: this.texture },
      },
      side: THREE.DoubleSide,
      transparent: true,
      // wireframe: true,
      // lights: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    const xScale = this.texture.image.width / this.texture.image.height;
    this.mesh.scale.set( xScale, 1, 1 );
  }

  setupEvent() {

    Signals.onResize.add( this.onResize.bind(this) );
  }

  // State ---------------------------------------------------------------------

  // Getters -------------------------------------------------------------------

  getText() {

    return this.mesh;
  }

  // Update --------------------------------------------------------------------

  update( time ) {
    // this.rotation.y += 0.01;
  }

  // Events --------------------------------------------------------------------

  onResize( wW, wH ) {

    this.wW = wW;
    this.wH = wH;
  }
}

export default Mask;
