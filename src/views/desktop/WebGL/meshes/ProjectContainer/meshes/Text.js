import { objectVisible } from 'core/decorators';
import vertexShader from '../shaders/text.vs';
import fragmentShader from '../shaders/text.fs';

@objectVisible()
class Text extends THREE.Object3D {

  constructor(options) {
    super(options);

    this._texture = options.texture;
    this._initialY = options.initialY;

    this._setupText();
  }

  _setupText() {
    this._geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_alpha: { type: 'f', value: 1 },
        t_diffuse: { type: 't', value: this._texture },
      },
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

    this.position.setY(this._initialY);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    TweenLite.killTweensOf(this.position);
    TweenLite.killTweensOf(this._material.uniforms.u_alpha);

    TweenLite.to(
      this._material.uniforms.u_alpha,
      1,
      {
        delay,
        value: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.to(
      this.position,
      2,
      {
        delay,
        y: this._initialY,
        ease: 'Power4.easeOut',
      },
    );
  }

  hide({ delay = 0, transitionFromTop = true } = {}) {
    TweenLite.killTweensOf(this.position);
    TweenLite.killTweensOf(this._material.uniforms.u_alpha);
    TweenLite.to(
      this._material.uniforms.u_alpha,
      1,
      {
        delay,
        value: 0,
        ease: 'Power2.easeOut',
      },
    );

    if (transitionFromTop) {
      TweenLite.to(
        this.position,
        1,
        {
          delay,
          y: '-=20',
          ease: 'Power4.easeInOut',
        },
      );
    }
  }

  // Getters -------------------------------------------------------------------

  getText() {

    return this._mesh;
  }

  // Update --------------------------------------------------------------------

  update( time ) {}

  // Events --------------------------------------------------------------------

  resize() {
    const xScale = Math.min( 30, window.innerWidth * 0.02 );
    const yScale = xScale / ( this._texture.image.width / this._texture.image.height );

    this.scale.set( xScale, yScale, 1 );
  }
}

export default Text;
