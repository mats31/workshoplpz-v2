import States from 'core/States';
import MaskTexture from './MaskTexture';
import getAspectRatio from 'utils/getAspectRatio';

import vertexProjectShader from './shaders/projectMesh.vs';
import fragmentProjectShader from './shaders/projectMesh.fs';

class ProjectPlane extends THREE.Object3D {

  constructor(options) {

    super();

    this.maskRender = false;
    this.scaleValue = 0;
    this.planeWidth = 512;
    this.planeHeight = 512;

    this.setup(options);

    // Signals.onAssetsLoaded.add(this.onAssetsLoaded.bind(this));
  }

  setup(options) {

    // this.maskMetaBall = options.mask.getMaskTexture();
    this.maskTexture = new MaskTexture({
      size: 512,
      points: 10,
    });

    this.maskTextuteCanvas = new THREE.Texture( this.maskTexture.getCanvas() );
    this.maskTextuteCanvas.needsUpdate = true;
    this.maskTextuteCanvas.minFilter = THREE.LinearFilter;

    this.maskGeometry = options.mask.getMaskMesh().geometry.clone();
    this.texture = options.texture;

    this.setupProjectPlane();
    this.setupEvent();
  }

  setupProjectPlane() {

    this.setupRenderTarget();

    const noise = States.resources.getTexture('project-preview-noise').media;
    noise.needsUpdate = true;
    noise.minFilter = THREE.LinearFilter;
    noise.wrapS = THREE.RepeatWrapping;
    noise.wrapT = THREE.RepeatWrapping;

    const voronoi = States.resources.getTexture('project-preview-voronoi').media;
    noise.needsUpdate = true;

    this.planeGeometry = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight, 10, 10 );
    // this.planeGeometry = new THREE.PlaneGeometry( this.planeWidth, this.planeHeight, 10, 10 );
    this.planeUniforms = {
      u_time: { type: 'f', value: 0 },
      u_discover: { type: 'f', value: 0 },
      u_map: { type: 't', value: this.texture },
      u_mapNoise: { type: 't', value: noise },
      u_maskMap: { type: 't', value: this.renderTarget.texture },
      u_metaBallMap: { type: 't', value: this.maskTextuteCanvas },
      u_voronoiMap: { type: 't', value: voronoi },
      // u_position: { type: 'v3', value: new THREE.Vector3(0, 20, 15) },
    };

    this.planeMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexProjectShader,
      fragmentShader: fragmentProjectShader,
      uniforms: this.planeUniforms,
      wireframe: false,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
    });

    // this.renderTarget.texture.needsUpdate = true;
    // this.planeMaterial = new THREE.MeshBasicMaterial({
    //   // color: new THREE.Color('red'),
    //   map: this.renderTarget.texture,
    //   side: THREE.DoubleSide,
    // });

    this.planeMesh = new THREE.Mesh(this.planeGeometry, this.planeMaterial);

    this.add(this.planeMesh);
  }

  setupRenderTarget() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    // const width = this.planeWidth;
    // const height = this.planeHeight;
    const options = {
      minFilter: THREE.LinearFilter,
      // wrapS: THREE.RepeatWrapping,
      // wrapT: THREE.RepeatWrapping,
      // magFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter,
      // stencilBuffer: true,
      // depthBuffer: true,
      // format: THREE.RGBFormat,
    };

    this.renderScene = new THREE.Scene();
    this.renderCamera = new THREE.OrthographicCamera(
      window.innerWidth / -2,
      window.innerWidth / 2,
      window.innerHeight / 2,
      window.innerHeight / -2,
      -10000,
      10000,
    );
    const cameraTarget = new THREE.Vector3(0, 20, 100);
    const cameraPos = new THREE.Vector3(0, 20, -1);
    // this.renderCamera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
    // this.renderCamera.position.copy(cameraPos);
    // this.renderCamera.lookAt(cameraTarget);
    // const cameraTarget = new THREE.Vector3(0, 20,   100);
    // const cameraPos = new THREE.Vector3(0, 20, -1);
    // this.renderCamera = window.orthographicCamera.clone();
    // this.renderCamera.rotation.x = Math.PI / 2;
    // this.renderCamera.rotation.y = Math.PI / 2;
    // this.renderCamera.rotation.z = Math.PI / 2;
    // console.log(this.renderCamera.rotation.z);
    this.renderCamera.position.copy(cameraPos);
    this.renderCamera.lookAt(cameraTarget);

    // this.planeTest = new THREE.Mesh(new THREE.PlaneGeometry(400, 400, 50, 50), new THREE.MeshBasicMaterial({ color: new THREE.Color('yellow'), side: THREE.DoubleSide, wireframe: false }));
    // // planeTest.position.set(0, 20, 10);
    // this.planeTest.position.set(window.camera.position.x, window.camera.position.y, 50);
    // this.planeTest2 = this.planeTest.clone();
    // this.planeTest2.position.set(window.camera.position.x, window.camera.position.y, -50);
    // this.renderCamera.lookAt(this.planeTest.position);
    // console.log(this.planeTest.position);
    // console.log(this.planeTest2.position);

    // this.maskMesh.position.set( 0, 20, 15 );
    // console.log(this.maskMesh);
    // this.maskGeometry = new THREE.BoxGeometry( 200, 200, 200 );

    // const backgroundPlane = new THREE.Mesh(
    //   new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight, 1, 1),
    //   new THREE.MeshBasicMaterial({ color: new THREE.Color('black') })
    // );
    // this.renderScene.add(backgroundPlane);

    const maskMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('red'),
      transparent: true,
    });
    this.maskMesh = new THREE.Mesh( this.maskGeometry, maskMaterial );
    this.maskMesh.scale.set( 0.99, 0.99, 0.99 );
    this.maskMesh.position.set( 0, 20, 15 );
    this.maskMesh.rotation.x = 0.5;
    this.maskMesh.rotation.y = -0.5;
    this.renderScene.add(this.maskMesh);
    // this.renderScene.add(this.planeTest);
    // this.renderScene.add(this.planeTest2);

    this.renderTarget = new THREE.WebGLRenderTarget( width, height, options);
    // this.renderTarget.texture.wrapS = THREE.RepeatWrapping;
    // this.renderTarget.texture.repeat.x = - 1;

    // this.renderer = new THREE.WebGLRenderer();
    // this.renderer.setSize(width, height);
    // this.renderer.setClearColor(0x1a1a1a);
    // this.renderer.autoClear = false;

    // this.renderCamera.rotation
    // this.renderTarget.texture.needsUpdate = true;
    window.renderer.render( this.renderScene, this.renderCamera, this.renderTarget, true );
    // window.renderer.render( window.scene, this.renderCamera, this.renderTarget, true );

    // console.log(window.orthographicCamera);
    // console.log(this.renderCamera);
  }

  setupEvent() {

    Signals.onResize.add( this.onResize.bind(this) );
  }

  // State ---------------------------------------------------------------------

  activateProject() {

    TweenLite.to(
      this.maskMesh.material,
      3.5,
      {
        opacity: 0,
        ease: 'Power4.easeInOut',
      },
    );
  }

  displayPlane() {

    TweenLite.delayedCall( 4.5, () => {
      this.planeMaterial.uniforms.u_discover.value = 1;
    });

    // TweenLite.to(
    //   this.planeMaterial.uniforms.u_discover,
    //   3.5,
    //   {
    //     value: 2,
    //     ease: 'Power4.easeInOut',
    //   },
    // );
    //
    // TweenLite.to(
    //   this,
    //   3.5,
    //   {
    //     scaleValue: 6,
    //     ease: 'Power4.easeIn',
    //   },
    // );
    //
    // this.maskRender = true;
  }

  // Events --------------------------------------------------------------------

  onAssetsLoaded() {

    const texture = States.resources.getTexture('uv').media;
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    this.maskMaterial.uniforms.u_map.value = texture;
  }

  onResize(wW, wH) {

    const ratio = wW / wH;

    let width = this.texture.image.width * ratio;
    let height = this.texture.image.height * ratio;

    if (height < width) {

      width = width * wH / height;
      height = wH;
    } else if (width < height) {

      height = height * wW / width;
      width = wW;
    }

    const x = width / this.planeWidth;
    const y = height / this.planeHeight;

    // this.planeMesh.scale.set( x, y, 1 );
    // this.renderTarget.setSize( width, height );

    // window.renderer.render( this.renderScene, this.renderCamera, this.renderTarget, true );
  }

  // Render --------------------------------------------------------------------

  update( time, rotationEase ) {

    if (this.maskRender) {
      this.maskTexture.update(this.scaleValue);
      this.maskTextuteCanvas.needsUpdate = true;
    }

    // this.planeTest.rotation.x += 0.1;
    // this.planeTest.rotation.y += 0.1;
    this.planeUniforms.u_time.value = time;
    // this.renderCamera.rotation.y -= 0.01 * rotationEase;
    // console.log(this.renderCamera.rotation.z);
    // this.renderCamera.rotation.z += 0.01;
    // this.renderCamera.rotation.x += 0.01;
    // this.renderCamera.rotation.y += 0.01;
    // this.renderCamera.rotation.z += 0.01;
    // console.log(this.renderCamera.rotation.z);
    // this.renderTarget.texture.flipY = false;
    // this.maskMesh.rotation.x += 0.01;
    // this.maskMesh.rotation.y -= 0.01;
    window.renderer.render( this.renderScene, this.renderCamera, this.renderTarget, true );
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
