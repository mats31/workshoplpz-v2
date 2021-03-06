import States from 'core/States';
import Mask from './Mask';
import ProjectPlane from './ProjectPlane';

class ProjectContainer extends THREE.Object3D {

  constructor(options) {

    super();

    this.setup(options);
  }

  setup(options) {

    this.isHover = false;
    this.isFocus = false;


    this.projectID = options.project.id;
    this.previewID = options.project.previewId;
    this.title = options.project.title;
    this.date = options.project.date;
    this.statut = options.project.statut;
    this.index = options.index;
    this.maskColor = options.project.color;

    const texture = States.resources.getTexture(this.previewID).media;
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    this.texture = texture;

    this.setupMask();
    this.setupProjectPlane();
    this.setupDescription();
  }

  setupMask() {

    this.mask = new Mask({
      color: this.maskColor,
    });

    this.mask.rotation.x = 0.5;
    this.mask.rotation.y = 0.5;

    this.add(this.mask);
  }

  setupProjectPlane() {

    this.projectPlane = new ProjectPlane({
      mask: this.mask,
      texture: this.texture,
    });
    this.projectPlane.position.setZ( 1 );
    this.add(this.projectPlane);
  }

  setupDescription() {

    this.box = document.createElement('div');
    this.box.className = 'webgl__projects-project';

    const title = document.createElement('h2');
    title.className = 'webgl__projects-title';
    title.innerHTML = this.title;
    this.box.appendChild(title);
    this.box.style.top = this.index % 2 === 0 ? '20%' : '60%';

    // const date = document.createElement('p');
    // date.className = 'webgl__projects-date';
    // date.innerHTML = this.date;
    // this.box.appendChild(date);

    // const statut = document.createElement('h3');
    // statut.className = 'webgl__projects-statut';
    // statut.innerHTML = this.statut;
    // this.box.appendChild(statut);

    const projectDOM = document.querySelector('.webgl__projects');
    projectDOM.appendChild(this.box);

    this.box.addEventListener( 'mouseover', this.onDOMMouseover.bind(this) );
    this.box.addEventListener( 'mouseleave', this.onDOMMouseleave.bind(this) );
  }

  // Getter -----------------------------------------------

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

    return this.mask.getMaskWidth();
  }

  getProjectPlane() {

    return this.projectPlane;
  }

  // State -----------------------------------------------

  activeFocus() {

    this.isFocus = true;

    document.body.style.cursor = 'pointer';

    // TweenLite.killTweensOf(this.box);
    // TweenLite.to(
    //   this.box,
    //   0.55,
    //   {
    //     opacity: 1,
    //     ease: 'Power2.easeIn',
    //   },
    // );

    this.mask.activateMask();
  }

  deactiveFocus() {

    this.isFocus = false;

    document.body.style.cursor = 'initial';

    // TweenLite.killTweensOf(this.box);
    // TweenLite.to(
    //   this.box,
    //   0.5,
    //   {
    //     opacity: 0.5,
    //     ease: 'Power2.easeIn',
    //   },
    // );

    this.mask.deactivateMask();
  }

  hideText() {

    TweenLite.to(
      this.box,
      0.55,
      {
        opacity: 0,
        ease: 'Power2.easeIn',
      },
    );
  }

  // Events -----------------------------------------------

  onDOMMouseover() {

    this.activeFocus();
  }

  onDOMMouseleave() {

    this.deactiveFocus();
  }

  onClick() {

    if (this.isFocus) {

      Signals.onProjectClick.dispatch( this.projectID, this.position.y );

      const x = 0;
      const y = this.position.y + window.innerHeight * 2;

      this.mask.activateProject();
      this.projectPlane.activateProject();

      TweenLite.to(
        this.position,
        3.5,
        {
          x,
          y,
          ease: 'Power4.easeInOut',
        },
      );

      // TweenLite.delayedCall( 0.8, () => {

      this.projectPlane.displayPlane();
      // });
    }
  }

  update( time, rotationEase, point, i ) {

    this.updateDOM(i);
    this.checkFocus(point);
    this.mask.update( time );
    this.projectPlane.update( time, rotationEase );
  }

  updateDOM() {

    this.box.style.left = `${this.getMaskPosition().left}px`;
    // this.box.style.top = `${( this.getMaskPosition().top - window.innerHeight * 0.5 ) * -1}px`;

    // if (i===1) console.log(this.getMaskPosition().left);
  }

  checkFocus( mousePoint ) {

    const point = {
      x: ( window.innerWidth * 0.5 ) * mousePoint.x,
      y: ( window.innerWidth * 0.5 ) * mousePoint.y * -1,
    };

    const box = this.getMaskPosition();

    if ( point.x >= box.left && point.x <= box.right && point.y >= box.bottom && point.y <= box.top ) {

      if (!this.isHover) {

        this.activeFocus();
        this.isHover = true;
      }

    } else if (this.isHover) {

      this.deactiveFocus();
      this.isHover = false;

    }
  }
}

export default ProjectContainer;
