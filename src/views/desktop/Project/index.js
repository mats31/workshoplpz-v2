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
@toggle('layerScalable', '_activateLayerScalable', '_deactivateLayerScalable', true)
export default class ProjectView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      close: this.el.querySelector('.js-project__closeContainer'),
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
    this._showAnimationDone = false;

    this._delta = 0;
    this._currentScrollY = 0;
    this._previousScrollY = 0;
    this._firstScale = 0;
    this._secondScale = 0;
    this._thirdScale = 0;
    this._mediaScalableFactor = 0;
    this._layerScalableFactor = 1;
    this._currentTransformOriginY = 0;
    this._targetTransformOriginY = 0;
    this._previewY = 0;
    this._scrollState = 1;

    this._bodyOffsetHeight = document.body.offsetHeight;
    this._distanceToBottom = document.body.offsetHeight;
  }

  _setupEvents() {
    this._ui.close.addEventListener('mouseenter', this._onCloseMouseenter);
    this._ui.close.addEventListener('mouseout', this._onCloseMouseout);
    this._ui.close.addEventListener('click', this._onCloseClick);
    Signals.onResize.add(this._onResize);
    Signals.onScroll.add(this._onScroll);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  _removeEvents() {
    Signals.onResize.remove(this._onResize);
    Signals.onScroll.remove(this._onScroll);
    Signals.onScrollWheel.remove(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    this._activateLayerScalable();

    TweenLite.set(
      this,
      {
        delay,
        _firstScale: 0.3,
      },
    );

    TweenLite.to(
      this.el,
      0.4,
      {
        delay: delay + 0.05,
        opacity: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._showAnimationDone = true;
        },
      },
    );

    TweenLite.set(
      this._ui.layer,
      {
        delay,
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
    TweenLite.to(
      this.el,
      1,
      {
        delay,
        opacity: 0,
        y: -window.innerHeight,
        ease: 'Power4.easeout',
        onComplete: () => {
          this._reset();
        },
      },
    );
  }

  _reset() {
    this._removeEvents();

    TweenLite.set( this.el, { clearProps: 'transform' });
    TweenLite.set( this.el, { display: 'none', opacity: 0 } );
    TweenLite.set( this._ui.titleContainer, { y: '0%', force3D: true } );
    TweenLite.set( this._ui.scaleElements, { scaleX: 1, scaleY: 1, scaleZ: 1, force3D: true } );
    TweenLite.set( this._ui.subtitle, { opacity: 0 });
    TweenLite.set( this._ui.description, { opacity: 0 });
    TweenLite.set( this._ui.categories, { opacity: 0 });
    TweenLite.set( this._ui.contents, { opacity: 0 });

    this._project = null;
    this._needsUpdate = false;
    this._revealedSections = false;
    this._skippedPreview = false;
    this._isSkippingPreview = false;
    this._showAnimationDone = false;

    this._delta = 0;
    this._currentScrollY = 0;
    this._previousScrollY = 0;
    this._firstScale = 0;
    this._secondScale = 0;
    this._thirdScale = 0;
    this._mediaScalableFactor = 0;
    this._layerScalableFactor = 1;
    this._currentTransformOriginY = 0;
    this._targetTransformOriginY = 0;
    this._previewY = 0;
    this._scrollState = 1;

    this._bodyOffsetHeight = document.body.offsetHeight;
    this._distanceToBottom = document.body.offsetHeight;

    this._ui.preview.classList.add('js-project__scale');
    this._ui.preview.classList.add('project__scale');
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
        while (this._ui.preview.firstChild) {
          this._ui.preview.removeChild(this._ui.preview.firstChild);
        }
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

        while (this._ui.medias.firstChild) {
          this._ui.medias.removeChild(this._ui.medias.firstChild);
        }

        for (let j = 0; j < this._project.medias.length; j++) {

          const media = document.createElement('div');
          media.classList.add('js-project__media');
          media.classList.add('project__media');

          if (this._project.medias[j].type === 'image') {
            const image = States.resources.getImage(this._project.medias[j].id).media;

            media.appendChild(image);
            this._ui.medias.appendChild(media);
          } else {
            const video = document.createElement('video');
            video.controls = false;
            video.muted = true;
            video.onload = () => { console.log(1); video.play(); };
            video.src = `videos/${this._project.medias[j].id}.mp4`;

            media.appendChild(video);
            this._ui.medias.appendChild(media);
          }
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

    TweenLite.fromTo(
      this._ui.subtitle,
      1,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.description,
      1,
      {
        opacity: 0,
      },
      {
        delay: 0.1,
        opacity: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this._revealedSections = true;
        },
      },
    );

    for (let i = 0; i < this._ui.categories.length; i++) {
      TweenLite.fromTo(
        this._ui.categories[i],
        1,
        {
          opacity: 0,
        },
        {
          delay: 0.3,
          opacity: 1,
          ease: 'Power4.easeOut',
        },
      );
    }

    for (let i = 0; i < this._ui.contents.length; i++) {
      TweenLite.fromTo(
        this._ui.contents[i],
        1,
        {
          opacity: 0,
        },
        {
          delay: 0.4,
          opacity: 1,
          ease: 'Power2.easeOut',
        },
      );
    }
  }

  _activateMediaScalable() {
    this._mediaScalableFactor = 1;
  }

  _deactivateMediaScalable() {
    this._mediaScalableFactor = 0;
  }

  _activateLayerScalable() {
    this._layerScalableFactor = 1;
  }

  _deactivateLayerScalable() {
    // this._layerScalableFactor = 0;
    TweenLite.killTweensOf(this._layerScalableFactor);
    TweenLite.to(
      this,
      0.5,
      {
        _layerScalableFactor: 0,
      },
    );
  }

  _skipPreview() {
    this._isSkippingPreview = true;

    this._deactivateLayerScalable();

    TweenLite.to(
      this._ui.titleContainer,
      1,
      {
        y: window.innerHeight * -0.99,
        force3D: true,
        ease: 'Power4.easeOut',
        onComplete: () => {
          document.body.style.overflow = 'visible';
          this._ui.preview.classList.remove('js-project__scale');
          this._ui.preview.classList.remove('project__scale');
          // this._ui.layer.classList.remove('js-project__scale');
          // this._ui.layer.classList.remove('project__scale');
          this._ui.scaleElements = this.el.querySelectorAll('.js-project__scale');
          this.resize();
          this._skippedPreview = true;
        },
      },
    );

    TweenLite.delayedCall(0.4, this._revealSections);
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onCloseMouseenter() {
    TweenLite.killTweensOf(this._ui.close);
    TweenLite.to(
      this._ui.close,
      0.3,
      {
        opacity: 1,
      },
    );
    Signals.onProjectCloseMouseenter.dispatch();
  }

  @autobind
  _onCloseMouseout() {
    TweenLite.killTweensOf(this._ui.close);
    TweenLite.to(
      this._ui.close,
      0.3,
      {
        opacity: 0.5,
      },
    );
    Signals.onProjectCloseMouseout.dispatch();
  }

  @autobind
  _onCloseClick() {
    States.router.navigateTo( pages.HOME );
  }

  @autobind
  _onResize() {
    this.resize();
  }

  resize() {
    this._bodyOffsetHeight = document.body.offsetHeight;

    if (this._skipPreview) {
      TweenLite.set( this._ui.titleContainer, { y: window.innerHeight * -0.99, force3D: true } );
    }
  }

  @autobind
  _onScroll(event) {

    if (this._showAnimationDone) {
      this._currentScrollY = document.documentElement.scrollTop || document.body.scrollTop;
      this._distanceToBottom = this._bodyOffsetHeight - window.innerHeight - this._currentScrollY;
      const offsetTopMedias = this._ui.secondContainer.offsetTop;
      const offsetBottomMedias = this._bodyOffsetHeight - window.innerHeight * 1.25;

      this._delta = this._currentScrollY - this._previousScrollY;

      this._previousScrollY = this._currentScrollY;

      TweenLite.killTweensOf(this._onDelayedEndScroll);
      TweenLite.delayedCall(0.05, this._onDelayedEndScroll);

      if (this._currentScrollY < offsetTopMedias || this._currentScrollY >= offsetBottomMedias) {
        this._deactivateMediaScalable();
      } else {
        this._activateMediaScalable();
      }

      if (this._distanceToBottom <= 0 && this._skippedPreview) {
        States.router.navigateTo( pages.HOME );
      }
    }
  }

  @autobind
  _onDelayedEndScroll() {
    this._delta = 0;
  }

  @autobind
  _onScrollWheel(event) {

    if (this._showAnimationDone) {
      this._delta = event.deltaY;

      if (event.deltaY > 0 && !this._isSkippingPreview) {
        this._skipPreview();
      }
    }
  }


  // Update --------------------------------------------------------------------

  update() {
    if (this._needsUpdate) {
      this._updateScaleElements();
      this._updateScrollState();
    }
  }

  _updateScaleElements() {

    const delta = Math.min( 20, Math.max( -20, this._delta ) );

    const firstScale = Math.abs( delta * 0.01 );
    const secondScale = Math.abs( delta * 0.01 ) * this._mediaScalableFactor;
    const thirdScale = Math.abs( delta * 0.01 ) * this._layerScalableFactor;

    if (Math.abs(firstScale - this._firstScale) < 0.0000000001) {
      this._firstScale = firstScale;
    } else {
      this._firstScale += ( firstScale - this._firstScale ) * 0.1;
    }

    if (Math.abs(secondScale - this._secondScale) < 0.0001) {
      this._secondScale = secondScale;
    } else {
      this._secondScale += ( secondScale - this._secondScale ) * 0.05;
    }

    if (Math.abs(thirdScale - this._thirdScale) < 0.0000000001) {
      this._thirdScale = thirdScale;
    } else {
      this._thirdScale += ( thirdScale - this._thirdScale ) * 0.05;
    }

    if (delta < 0) {
      this._targetTransformOriginY = 100;
    } else if (delta > 0) {
      this._targetTransformOriginY = 0;
    }

    if (Math.abs(this._targetTransformOriginY - this._currentTransformOriginY) < 0.0000000001) {
      this._currentTransformOriginY = this._targetTransformOriginY;
    } else {
      this._currentTransformOriginY += ( this._targetTransformOriginY - this._currentTransformOriginY ) * 0.01;
    }


    for (let i = 0; i < this._ui.scaleElements.length; i++) {
      const scaleElement = this._ui.scaleElements[i];
      let finalScale;
      if (scaleElement.getAttribute('data-scale') === '1') {
        finalScale = this._firstScale;
      } else if (scaleElement.getAttribute('data-scale') === '2') {
        finalScale = this._secondScale;
      } else {
        finalScale = this._thirdScale;
      }

      finalScale = 1 + finalScale;

      scaleElement.style.webkitTransform = `scale3d(1,${finalScale},1)`;
      scaleElement.style.MozTransform = `scale3d(1,${finalScale},1)`;
      scaleElement.style.msTransform = `scale3d(1,${finalScale},1)`;
      scaleElement.style.OTransform = `scale3d(1,${finalScale},1)`;
      scaleElement.style.transform = `scale3d(1,${finalScale},1)`;
      scaleElement.style.transformOrigin = `0% ${this._currentTransformOriginY}%`;
    }
  }

  _updateScrollState() {
    if (this._revealedSections) {
      const scrollStateTarget = 1 - this._currentScrollY / ( this._bodyOffsetHeight - window.innerHeight );

      if (Math.abs(scrollStateTarget - this._scrollState) < 0.001) {
        this._scrollState = scrollStateTarget;
      } else {
        this._scrollState += ( scrollStateTarget - this._scrollState ) * 0.3;
      }

      this._ui.layer.style.webkitTransform = `scale3d(${this._scrollState},1,1)`;
      this._ui.layer.style.MozTransform = `scale3d(${this._scrollState},1,1)`;
      this._ui.layer.style.msTransform = `scale3d(${this._scrollState},1,1)`;
      this._ui.layer.style.OTransform = `scale3d(${this._scrollState},1,1)`;
      this._ui.layer.style.transform = `scale3d(${this._scrollState},1,1)`;
      this._ui.layer.style.transformOrigin = '0 0';
    }
  }

}
