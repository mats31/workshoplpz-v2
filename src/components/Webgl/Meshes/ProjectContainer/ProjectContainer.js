import Mask from './Mask';
import ProjectPlane from './ProjectPlane';

class ProjectContainer extends THREE.Object3D {

  constructor(texture) {

    super();

    this.setup(texture);
  }

  setup(texture) {

    this.texture = texture;

    this.createMask();
    this.createProjectPlane();
  }

  createMask() {

    this.mask = new Mask();

    this.mask.rotation.x = 0.5;
    this.mask.rotation.y = 0.5;

    this.add(this.mask);
  }

  createProjectPlane() {

    const maskMesh = this.mask.getMaskMesh();

    this.projectPlane = new ProjectPlane({
      geometry: maskMesh.geometry,
      texture: this.texture,
    });
    this.projectPlane.position.setZ( 1 );
    this.add(this.projectPlane);
  }

  getMask() {

    return this.mask;
  }

  getMaskWidth() {

    const box3 = new THREE.Box3().setFromObject( this.mask );

    return Math.abs( box3.max.x - box3.min.x );
  }

  getProjectPlane() {

    return this.projectPlane;
  }

  update( time, rotationEase ) {

    this.mask.update( time, rotationEase );
    this.projectPlane.update( time, rotationEase );
  }
}

export default ProjectContainer;
