import States from 'core/States';
import * as pages from 'core/pages';
import raf from 'raf';
import { autobind } from 'core-decorators';
import LoaderView from 'views/common/Loader/Loader';
import MobileHomeView from 'views/mobile/MobileHome';
import MobileAboutView from 'views/mobile/MobileAbout';
import MobileWebGLView from 'views/mobile/MobileWebGL';
import MobileProjectView from 'views/mobile/MobileProject';
import MobileEverydayView from 'views/mobile/MobileEveryday';
import UIView from 'views/desktop/UI';

export default class MobileAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {

    this.el = document.getElementById('application');

    this._views = [];
    this._loader = this._setupLoaderView();
    this._home = this._setupHomeView();
    this._about = this._setupAboutView();
    this._webgl = this._setupWebGLView();
    this._project = this._setupProjectView();
    this._everyday = this._setupEverydayView();
    this._ui = this._setupUIView();

    this._previousState = null;

    this._views.push(this._loader, this._home);

    this._start();
    this._setupEvents();
  }

  _setupLoaderView() {
    const view = new LoaderView({
      parent: this.el,
    });

    return view;
  }

  _setupHomeView() {
    const view = new MobileHomeView({
      parent: this.el,
    });

    return view;
  }

  _setupAboutView() {
    const view = new MobileAboutView({
      parent: this.el,
    });

    return view;
  }

  _setupWebGLView() {
    const view = new MobileWebGLView({
      parent: this.el,
    });

    return view;
  }

  _setupProjectView() {
    const view = new MobileProjectView({
      parent: this.el,
    });

    return view;
  }

  _setupEverydayView() {
    const view = new MobileEverydayView({
      parent: this.el,
    });

    return view;
  }

  _setupUIView() {
    const view = new UIView({
      parent: this.el,
    });

    return view;
  }

  _setupEvents() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('mousewheel', this.onScrollWheel);
    window.addEventListener('DOMMouseScroll', this.onScrollWheel);

    this.onResize();
  }

  _start() {
    this._render();
  }

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', this._onDocumentTouchmove);
        States.application.activateProject = false;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.show({ delay: 1 });
        this._about.hide({ delay: 0 });

        if (this._previousState === pages.EVERYDAYS) {
          this._webgl.show({ delay: 0.7, direction: 'left' });
        } else if (this._previousState === pages.ABOUT) {
          this._webgl.show({ delay: 0, transitionIn: false });
        } else if (this._previousState === pages.PROJECT) {
          this._webgl.show({ delay: 0.1, fromProject: true });
        } else {
          this._webgl.show({ delay: 1 });
        }

        this._project.hide({ delay: 0 });

        this._everyday.hide({ delay: 0.5 });

        if (this._previousState === pages.ABOUT) {
          this._ui.show({ delay: 1.5 });
        } else {
          this._ui.show({ delay: 3 });
        }
        break;
      case pages.PROJECT:
        document.body.style.overflow = 'visible';
        document.removeEventListener('touchmove', this._onDocumentTouchmove);
        States.application.activateProject = true;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.hide({ delay: 0 });
        this._about.hide({ delay: 0 });

        this._project.fillProjectPage();
        this._project.show({ delay: 1.3 });

        this._everyday.hide({ delay: 0 });
        this._ui.hide();
        break;
      case pages.EVERYDAYS:
        document.body.style.overflow = 'hidden';
        document.addEventListener('touchmove', this._onDocumentTouchmove);
        States.application.activateProject = false;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.show({ delay: 1 });
        this._about.hide({ delay: 0 });
        this._webgl.show({ delay: 0, transitionIn: false });
        this._project.hide({ delay: 0.1 });
        this._ui.show({ delay: 0.5 });

        if (this._previousState === pages.PROJECT || this._previousState === pages.ABOUT) {
          this._everyday.show({ delay: 0.35, transitionFromDown: true });
        } else if (!this._previousState) {
          this._everyday.show({ delay: 0.5, transitionFromDown: true });
        } else {
          this._everyday.show({ delay: 0.6 });
        }
        break;
      case pages.ABOUT:
        document.body.style.overflow = 'visible';
        document.removeEventListener('touchmove', this._onDocumentTouchmove);
        States.application.activateProject = false;
        this._loader.hide();
        this._about.show({ delay: 0.65 });
        this._home.show({ delay: 1 });
        this._ui.hide({ delay: 0 });

        if (this._previousState !== pages.EVERYDAYS) {
          this._webgl.show({ delay: 0, transitionIn: false });
        }
        this._project.hide({ delay: 0.1 });
        this._everyday.hide({ delay: 0, transitionFromTop: true });
        break;
      default:
        this._home.hide();
    }

    this._home.updatePage(page);
    this._webgl.updatePage(page);
    this._ui.updatePage(page);

    this._previousState = page;
  }

  @autobind
  onResize() {
    Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
  }

  @autobind
  onScroll(event) {
    Signals.onScroll.dispatch(event);
  }

  @autobind
  onScrollWheel(event) {
    Signals.onScrollWheel.dispatch(event);
  }

  @autobind
  _onDocumentTouchmove(event) {
    event.preventDefault();
  }

  // Update --------------------------------------------------------------------

  @autobind
  _render() {
    raf(this._render);

    this._webgl.update();
    this._project.update();
    this._everyday.update();
  }
}
