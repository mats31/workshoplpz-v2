import States from 'core/States';
import projects from 'config/projects';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible, toggle } from 'core/decorators';
import template from './project.tpl.html';
import './project.scss';


@visible()
@toggle('mediaScalable', '_activateMediaScalable', '_deactivateMediaScalable', false)
export default class ProjectView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      close: this.el.querySelector('.js-project__close'),
      firstContainer: this.el.querySelector('.js-project__firstContainer'),
      titleContainer: this.el.querySelector('.js-project__titleContainer'),
      title: this.el.querySelector('.js-project__title'),
      preview: this.el.querySelector('.js-project__preview'),
      layer: this.el.querySelector('.js-project__titleLayer'),
      sections: this.el.querySelector('.js-project__sections'),
      subtitle: this.el.querySelector('.js-project__subtitle'),
      description: this.el.querySelector('.js-project__description'),
      categories: this.el.querySelectorAll('.js-project__category'),
      contents: this.el.querySelectorAll('.js-project__content'),
      date: this.el.querySelector('.js-project__date'),
      pitchDescription: this.el.querySelector('.js-project__pitchDescription'),
      teamDescription: this.el.querySelector('.js-project_teamDescription'),
      roleDescription: this.el.querySelector('.js-project__roleDescription'),
      secondContainer: this.el.querySelector('.js-project__secondContainer'),
      medias: this.el.querySelector('.js-project__medias'),
      scaleElements: this.el.querySelectorAll('.js-project__scale'),
    };

    this._project = null;
    this._needsUpdate = false;
    this._revealedSections = false;
    this._skippedPreview = false;
    this._isSkippingPreview = false;

    this._delta = 0;
    this._currentScrollY = 0;
    this._previousScrollY = 0;
    this._firstScale = 0;
    this._secondScale = 0;
    this._mediaScalableFactor = 0;
    this._currentTransformOriginY = 0;
    this._targetTransformOriginY = 0;
    this._previewY = 0;
  }

  _setupEvents() {
    Signals.onScroll.add(this._onScroll);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    TweenLite.set(
      this,
      {
        delay,
        _firstScale: 1.5,
      },
    );

    TweenLite.to(
      this.el,
      0.5,
      {
        delay,
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.set(
      this._ui.layer,
      {
        delay: delay + 1,
        backgroundColor: this._project.color,
      },
    );

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      window.scrollTo(0, 0);
      this._setupEvents();
    }, 50);
  }

  hide({ delay = 0 } = {}) {
    this.el.style.display = 'none';
  }

  fillProjectPage() {
    const lastRouteResolved = States.router.getLastRouteResolved();

    for (let i = 0; i < projects.projectList.length; i++) {
      this._project = projects.projectList[i];

      if (this._project.id === lastRouteResolved.params.id) {

        // Title
        this._ui.title.innerHTML = this._project.title;

        // Preview
        const preview = States.resources.getImage(`${this._project.id}-preview`).media;
        this._ui.preview.appendChild(preview);

        // Subtitle
        this._ui.subtitle.innerHTML = this._project.title;

        // Description
        this._ui.description.innerHTML = this._project.description;

        // Client name
        this._ui.date.innerHTML = this._project.date;

        // Pitch
        this._ui.pitchDescription.innerHTML = this._project.pitch;

        // Team
        this._ui.teamDescription.innerHTML = this._project.team;

        // Role
        this._ui.roleDescription.innerHTML = this._project.role;

        for (let j = 0; j < this._project.pictures.length; j++) {
          const media = document.createElement('div');
          const image = States.resources.getImage(this._project.pictures[j]).media;

          media.classList.add('js-project__media');
          media.classList.add('project__media');
          // media.classList.add('js-project__scale');
          // media.classList.add('project__scale');

          media.appendChild(image);
          this._ui.medias.appendChild(media);
        }

        this._ui.scaleElements = this.el.querySelectorAll('.js-project__scale');

        this._needsUpdate = true;

        break;
      }
    }
  }

  @autobind
  _revealSections() {
    TweenLite.fromTo(
      this._ui.firstContainer,
      1,
      {
        y: 200,
      },
      {
        y: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.subtitle,
      1,
      {
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.description,
      1,
      {
        delay: 0.1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    for (let i = 0; i < this._ui.categories.length; i++) {
      TweenLite.to(
        this._ui.categories[i],
        1,
        {
          delay: 0.3,
          opacity: 1,
          ease: 'Power4.easeOut',
        },
      );
    }

    for (let i = 0; i < this._ui.contents.length; i++) {
      TweenLite.to(
        this._ui.contents[i],
        1,
        {
          delay: 0.4,
          opacity: 1,
          ease: 'Power2.easeOut',
        },
      );
    }

    this._revealedSections = true;
  }

  _activateMediaScalable() {
    this._mediaScalableFactor = 1;
  }

  _deactivateMediaScalable() {
    this._mediaScalableFactor = 0;
  }

  _skipPreview() {
    this._isSkippingPreview = true;

    TweenLite.to(
      this._ui.titleContainer,
      1,
      {
        y: '-99%',
        ease: 'Power4.easeOut',
        onComplete: () => {
          document.body.style.overflow = 'visible';
          this._ui.preview.classList.remove('js-project__scale');
          this._ui.preview.classList.remove('project__scale');
          this._ui.layer.classList.remove('js-project__scale');
          this._ui.layer.classList.remove('project__scale');
          this._ui.scaleElements = this.el.querySelectorAll('.js-project__scale');
          this._skippedPreview = true;
        },
      },
    );

    TweenLite.delayedCall(0.4, this._revealSections);
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onScroll(event) {

    if (!this._skippedPreview) {
      event.preventDefault();
    }

    this._currentScrollY = document.documentElement.scrollTop || document.body.scrollTop;
    // const offsetTopSections = this._ui.sections.offsetTop;
    const offsetTopMedias = this._ui.secondContainer.offsetTop;

    this._delta = this._currentScrollY - this._previousScrollY;

    this._previousScrollY = this._currentScrollY;

    TweenLite.killTweensOf(this._onDelayedEndScroll);
    TweenLite.delayedCall(0.05, this._onDelayedEndScroll);

    // if (!this._revealedSections && this._currentScrollY > offsetTopSections) {
    //   this._revealSections();
    // }

    if (this._currentScrollY < offsetTopMedias) {
      this._deactivateMediaScalable();
    } else {
      this._activateMediaScalable();
    }
  }

  @autobind
  _onDelayedEndScroll() {
    this._delta = 0;
  }

  @autobind
  _onScrollWheel(event) {

    this._delta = event.deltaY;

    if (event.deltaY > 0 && !this._isSkippingPreview) {
      this._skipPreview();
    }
  }


  // Update --------------------------------------------------------------------

  update() {
    if (this._needsUpdate) {
      this._updateScaleElements();
    }
  }

  _updateScaleElements() {

    const delta = Math.min( 20, Math.max( -20, this._delta ) );

    const firstScale = Math.abs( delta * 0.01 );
    const secondScale = Math.abs( delta * 0.01 ) * this._mediaScalableFactor;

    if (Math.abs(firstScale - this._firstScale) < 0.0000000001) {
      this._firstScale = firstScale;
    } else {
      this._firstScale += ( firstScale - this._firstScale ) * 0.1;
    }

    if (Math.abs(secondScale - this._secondScale) < 0.0000000001) {
      this._secondScale = secondScale;
    } else {
      this._secondScale += ( secondScale - this._secondScale ) * 0.05;
    }

    if (delta < 0) {
      this._targetTransformOriginY = 100;
    } else if (delta > 0) {
      this._targetTransformOriginY = 0;
    }

    if (Math.abs(this._targetTransformOriginY - this._currentTransformOriginY) < 0.0000000001) {
      this._currentTransformOriginY = this._targetTransformOriginY;
    } else {
      this._currentTransformOriginY += ( this._targetTransformOriginY - this._currentTransformOriginY ) * 0.05;
    }


    for (let i = 0; i < this._ui.scaleElements.length; i++) {
      const scaleElement = this._ui.scaleElements[i];
      let finalScale;
      if (scaleElement.getAttribute('data-scale') === '1') {
        finalScale = this._firstScale;
      } else {
        finalScale = this._secondScale;
      }

      finalScale = 1 + finalScale;

      scaleElement.style.webkitTransform = `scaleY(${finalScale})`;
      scaleElement.style.MozTransform = `scaleY(${finalScale})`;
      scaleElement.style.msTransform = `scaleY(${finalScale})`;
      scaleElement.style.OTransform = `scaleY(${finalScale})`;
      scaleElement.style.transform = `scaleY(${finalScale})`;
      scaleElement.style.transformOrigin = `0% ${this._currentTransformOriginY}%`;
    }
  }

}
