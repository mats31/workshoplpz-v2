import States from 'core/States';
import vertexShader from './shaders/ground.vs';
import fragmentShader from './shaders/ground.fs';
import vertexDepthShader from './shaders/groundDepth.vs';

class Ground extends THREE.Object3D {

  constructor() {
    super();

    this.translation = 0;
    this.translationTarget = 0;

    this.geometry = new THREE.PlaneGeometry( 550, 550, 200, 200 );
    // this.geometry = new THREE.PlaneGeometry( 200, 200, 10, 10 );

    const baseShader = THREE.ShaderLib.phong;
    const baseUniforms = THREE.UniformsUtils.clone(baseShader.uniforms);
    this.uniforms = {
      ...baseUniforms,
      u_time: { type: 'f', value: 0 },
      u_translation: { type: 'f', value: 0 },
      emissive: { value: new THREE.Color( 0x080808 ) },
      specular: { value: new THREE.Color( 0x000000 ) },
    };

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      wireframe: false,
      lights: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.receiveShadow = true;
    this.mesh.customDepthMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexDepthShader,
      fragmentShader: THREE.ShaderLib.depth.fragmentShader,
      uniforms: this.material.uniforms,
    });
    this.add(this.mesh);
  }

  // Update -----------------------------------------------

  update(time, translationEase) {

    this.translationTarget += translationEase * 0.01;
    this.translation += ( this.translationTarget - this.translation ) * 0.04;

    this.material.uniforms.u_time.value = time;
    this.material.uniforms.u_translation.value = this.translation;
  }
}

export default Ground;
