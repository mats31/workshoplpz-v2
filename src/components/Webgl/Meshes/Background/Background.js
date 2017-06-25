import States from 'core/States';

import vertexShader from './shaders/background.vs';
import fragmentShader from './shaders/background.fs';

class Background extends THREE.Object3D {

  constructor() {

    super();

    const map = States.resources.getTexture('background').media;
    map.LinearFilter = THREE.LinearFilter;
    map.repeat.set( 0.001, 0.001 );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.needsUpdate = true;

    this.geometry = new THREE.PlaneBufferGeometry( 1, 1, 1, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        u_map: { type: 't', value: map },
      },
      wireframe: false,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.add(this.mesh);

    // this.addGUI()
  }

  scaleGrain( width, height ) {

    this.scale.set( width, height, 1 );
  }

  update(time) {

    // this.rotation.x += 0.1;
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

export default Background;
