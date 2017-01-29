import Mask from './Mask';
import ProjectPlane from './ProjectPlane';

export default class ProjectContainer {

  constructor() {

    this.setup();
  }

  setup() {

    this.createMask();
    this.createProjectPlane();
  }

  createMask() {

    this.mask = new Mask();
  }

  createProjectPlane() {

    const maskMesh = this.mask.getMaskMesh();

    this.projectPlane = new ProjectPlane(maskMesh);
  }

  getMask() {

    return this.mask;
  }

  getProjectPlane() {

    return this.projectPlane;
  }

  update( time ) {

    this.projectPlane.update( time );
  }
}
