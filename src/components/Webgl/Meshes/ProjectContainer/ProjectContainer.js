import States from 'core/States';
import Mask from './Mask';
import ProjectPlane from './ProjectPlane';

class ProjectContainer extends THREE.Object3D {

  constructor(options) {

    super();

    this.setup(options);
  }

  setup(options) {

    this.isMasking = false;

    this.projectID = options.project.previewId;
    this.title = options.project.title;
    this.date = options.project.date;
    this.statut = options.project.statut;

    const texture = States.resources.getTexture(this.projectID).media;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    this.texture = texture;

    this.createMask();
    this.createProjectPlane();
    this.createDescription();
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

  createDescription() {

    this.box = document.createElement('div');
    this.box.className = 'webgl__projects-project';

    const title = document.createElement('h2');
    title.className = 'webgl__projects-title';
    title.innerHTML = this.title;
    this.box.appendChild(title);

    const date = document.createElement('p');
    date.className = 'webgl__projects-date';
    date.innerHTML = this.date;
    this.box.appendChild(date);

    const statut = document.createElement('h3');
    statut.className = 'webgl__projects-statut';
    statut.innerHTML = this.statut;
    this.box.appendChild(statut);

    const projectDOM = document.querySelector('.webgl__projects');
    projectDOM.appendChild(this.box);
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

  activeFocus() {

    if (!this.isMasking) {

      this.isMasking = true;

      TweenLite.killTweensOf(this.box);
      TweenLite.to(
        this.box,
        0.25,
        {
          opacity: 1,
          ease: 'Power2.easeIn',
        },
      );

      this.mask.activateMask();
    }
  }

  deactiveFocus() {

    if (this.isMasking) {

      TweenLite.killTweensOf(this.box);
      TweenLite.to(
        this.box,
        0.25,
        {
          opacity: 0.5,
          ease: 'Power2.easeIn',
          onComplete: () => {
            this.isMasking = false;
          },
        },
      );
      this.mask.deactivateMask();
    }
  }

  update( time, rotationEase, point, i ) {

    this.updateDOM(i);
    this.checkFocus(point);
    this.mask.update( time );
    this.projectPlane.update( time, rotationEase );
  }

  updateDOM(i) {

    this.box.style.left = `${this.getMaskPosition().left + this.getMaskWidth() + window.innerWidth * 0.5}px`;
    this.box.style.top = `${( this.getMaskPosition().top - window.innerHeight * 0.5 ) * -1}px`;

    // if (i===1) console.log(this.getMaskPosition().left);
  }

  checkFocus( mousePoint ) {

    const point = {
      x: ( window.innerWidth * 0.5 ) * mousePoint.x,
      y: ( window.innerWidth * 0.5 ) * mousePoint.y * -1,
    };

    const box = this.getMaskPosition();

    if ( point.x >= box.left && point.x <= box.right && point.y >= box.bottom && point.y <= box.top ) {

      this.activeFocus();
    } else {

      this.deactiveFocus();
    }
  }
}

export default ProjectContainer;
