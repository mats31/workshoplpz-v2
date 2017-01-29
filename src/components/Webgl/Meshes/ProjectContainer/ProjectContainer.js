import Mask from './Mask';
import ProjectPlane from './ProjectPlane';

export default class ProjectContainer {

  constructor(texture) {

    this.setup(texture);
  }

  setup(texture) {

    this.texture = texture;

    this.createMask();
    this.createProjectPlane();
  }

  createMask() {

    this.mask = new Mask();
  }

  createProjectPlane() {

    const maskMesh = this.mask.getMaskMesh();

    this.projectPlane = new ProjectPlane({
      geometry: maskMesh.geometry,
      texture: this.texture,
    });
  }

  getMask() {

    return this.mask;
  }

  getProjectPlane() {

    return this.projectPlane;
  }

  update( time, rotationEase ) {

    this.projectPlane.update( time, rotationEase );
  }
}
