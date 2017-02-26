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

  getMaskPosition() {

    const box3 = new THREE.Box3().setFromObject( this.mask );

    return {
      left: box3.max.x * -1,
      top: box3.max.y,
      right: box3.min.x * -1,
      bottom: box3.min.y,
    };
  }

  getMaskWidth() {

    const box3 = new THREE.Box3().setFromObject( this.mask );

    return Math.abs( box3.max.x - box3.min.x );
  }

  getProjectPlane() {

    return this.projectPlane;
  }

  checkFocus( mousePoint ) {

    const point = {
      x: ( window.innerWidth * 0.5 ) * mousePoint.x,
      y: ( window.innerWidth * 0.5 ) * mousePoint.y * -1,
    };

    const box = this.getMaskPosition();

    if ( point.x >= box.left && point.x <= box.right && point.y >= box.bottom && point.y <= box.top ) {

      this.mask.activateMask();
    } else {

      this.mask.deactivateMask();
    }
  }

  update( time, rotationEase, point ) {

    this.checkFocus(point);
    this.mask.update( time );
    this.projectPlane.update( time, rotationEase );
  }
}

export default ProjectContainer;
