import { objectVisible, focused } from 'core/decorators';
import vertexShader from '../shaders/preview.vs';
import fragmentShader from '../shaders/preview.fs';

@objectVisible()
@focused()
class Preview extends THREE.Object3D {

  constructor(options) {
    super(options);

    this._texture = options.texture;

    this._setupPreview();
  }

  _setupPreview() {
    this._geometry = new THREE.PlaneBufferGeometry( 15, 15, 1, 1);
    // this._geometry = new THREE.PlaneBufferGeometry( 10, 10, 1, 1);

    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_alpha: { type: 'f', value: 1 },
        u_progress: { type: 'f', value: 0 },
        t_diffuse: { type: 't', value: this._texture },
      },
      transparent: true,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);

    this.visible = false;
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
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
  }

  hide({ delay = 0 } = {}) {
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
  }

  focus() {
    TweenLite.killTweensOf(this._material.uniforms.u_progress);
    this.visible = true;

    TweenLite.to(
      this._material.uniforms.u_progress,
      0.7,
      {
        value: 1,
        ease: 'Expo.easeOut',
      },
    );
  }

  blur() {
    TweenLite.killTweensOf(this._material.uniforms.u_progress);
    TweenLite.to(
      this._material.uniforms.u_progress,
      0.7,
      {
        value: 0,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this.visible = false;
        },
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

export default Preview;
