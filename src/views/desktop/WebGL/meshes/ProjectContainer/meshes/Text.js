import vertexShader from '../shaders/text.vs';
import fragmentShader from '../shaders/text.fs';

class Text extends THREE.Object3D {

  constructor(options) {
    super(options);

    this._texture = options.texture;

    this._setupText();
  }

  _setupText() {
    this._geometry = new THREE.PlaneBufferGeometry( 15, 15, 1, 1);

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_alpha: { type: 'f', value: 1 },
        u_map: { type: 't', value: this._texture },
      },
      // side: THREE.DoubleSide,
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

    const xScale = this._texture.image.width / this._texture.image.height;
    this._mesh.scale.set( xScale, 1, 1 );
  }

  setupEvent() {

    Signals.onResize.add( this._onResize.bind(this) );
  }

  // State ---------------------------------------------------------------------

  hide() {

    TweenLite.to(
      this._material.uniforms.u_alpha,
      0.55,
      {
        value: 0,
        ease: 'Power2.easeIn',
      },
    );
  }

  // Getters -------------------------------------------------------------------

  getText() {

    return this._mesh;
  }

  // Update --------------------------------------------------------------------

  update( time ) {}

  // Events --------------------------------------------------------------------

  onResize( wW, wH ) {

    this._wW = wW;
    this._wH = wH;
  }
}

export default Text;
