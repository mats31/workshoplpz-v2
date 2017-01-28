import States from 'core/States';

import vertexProjectShader from './shaders/projectMesh.vs';
import fragmentProjectShader from './shaders/projectMesh.fs';

class ProjectPlane extends THREE.Object3D {

  constructor(maskMesh) {

    super();

    this.setup(maskMesh);

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  setup(maskMesh) {

    this.maskMesh = maskMesh;

    this.createProjectPlane();
  }

  createProjectPlane() {

    this.createRenderTarget();

    const maskBox = new THREE.Box3().setFromObject(this.maskMesh);

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.planeGeometry = new THREE.PlaneGeometry( 10, 10, 10, 10 );
    this.planeUniforms = {
      // u_map: { type: 't', value: new THREE.Texture() },
      u_map: { type: 't', value: texture },
      u_maskMaxPos: { type: 'v3', value: maskBox.max },
      u_maskMinPos: { type: 'v3', value: maskBox.min },
      u_resolution: { type: 'v2', value: new THREE.Vector2( Math.abs( maskBox.min.x ) + Math.abs( maskBox.max.x ), Math.abs( maskBox.min.y ) + Math.abs( maskBox.max.y ) ) },
      u_maskMap: { type: 't', value: this.renderTarget.texture },
    };

    this.planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexProjectShader,
      fragmentShader: fragmentProjectShader,
      uniforms: this.planeUniforms,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    const planeBox = new THREE.Box3().setFromObject(this.planeMesh);
    console.log(planeBox);

    this.add(this.planeMesh);
  }

  createRenderTarget() {

    const width = 256;
    const height = 256;
    const options = {
      minFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
    };

    this.renderScene = new THREE.Scene();
    // this.renderCamera = new THREE.OrthographicCamera(
    //   window.innerWidth / -2,
    //   window.innerWidth / 2,
    //   window.innerHeight / 2,
    //   window.innerHeight / -2,
    //   -10000,
    //   10000,
    // );
    this.renderCamera = new THREE.OrthographicCamera(
      64 / -2,
      64 / 2,
      64 / 2,
      64 / -2,
      -10000,
      10000,
    );

    this.renderScene.add(this.maskMesh);

    this.renderTarget = new THREE.WebGLRenderTarget( width, height, options);

    window.renderer.render( this.renderScene, this.renderCamera, this.renderTarget, true );
  }


  /* ****************** UPDATE ****************** */

  onAssetsLoaded() {

    console.log('test');

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.maskMaterial.uniforms.u_map.value = texture;
  }

  /* ****************** RENDER ****************** */

  update(time) {

    this.maskMaterial.uniforms.u_time.value = time;
    this.planeMesh.rotation.x += 0.1;
    this.planeMesh.rotation.y += 0.1;
  }

  // addGUI() {
  //   this.GUI = helpers.GUI
  //   const positionFolder = this.GUI.addFolder({ label: 'Cube Position' })
  //   const scaleFolder = this.GUI.addFolder({ label: 'Cube Scale' })
  //
  //   positionFolder.add(this.position, 'x', { label: 'position x', min: -20, max: 20, step: 1 })
  //   positionFolder.add(this.position, 'y', { label: 'position y', min: -20, max: 20, step: 1 })
  //   positionFolder.add(this.position, 'z', { label: 'position z', min: -20, max: 20, step: 1 })
  //
  //   scaleFolder.add(this.scale, 'x', { label: 'scale x', min: 0, max: 10, step: 0.1 })
  //   scaleFolder.add(this.scale, 'y', { label: 'scale y', min: 0, max: 10, step: 0.1 })
  //   scaleFolder.add(this.scale, 'z', { label: 'scale z', min: 0, max: 10, step: 0.1 })
  // }
}

export default ProjectPlane;
