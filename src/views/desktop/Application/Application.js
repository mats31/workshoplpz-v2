import States from 'core/States';
import * as pages from 'core/pages';
import raf from 'raf';
import { autobind } from 'core-decorators';
import LoaderView from 'views/common/Loader/Loader';
import HomeView from 'views/desktop/Home';
import AboutView from 'views/desktop/About';
import WebGLView from 'views/desktop/WebGL';
import ProjectView from 'views/desktop/Project';
import EverydayView from 'views/desktop/Everyday';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    this.el = document.getElementById('application');

    this._views = [];
    this._loader = this._setupLoaderView();
    this._home = this._setupHomeView();
    this._about = this._setupAboutView();
    this._webgl = this._setupWebGLView();
    this._project = this._setupProjectView();
    this._everyday = this._setupEveryday();

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
    const view = new HomeView({
      parent: this.el,
    });

    return view;
  }

  _setupAboutView() {
    const view = new AboutView({
      parent: this.el,
    });

    return view;
  }

  _setupWebGLView() {
    const view = new WebGLView({
      parent: this.el,
    });

    return view;
  }

  _setupProjectView() {
    const view = new ProjectView({
      parent: this.el,
    });

    return view;
  }

  _setupEveryday() {
    const view = new EverydayView({
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
        States.application.activateProject = false;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.show({ delay: 1 });
        this._about.hide({ delay: 0 });
        this._webgl.show({ delay: 0 });
        this._project.hide({ delay: 0.1 });
        this._everyday.hide({ delay: 0 });
        break;
      case pages.PROJECT:
        document.body.style.overflow = 'visible';
        States.application.activateProject = true;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.hide({ delay: 0 });
        this._about.hide({ delay: 0 });
        this._project.fillProjectPage();
        this._project.show({ delay: 1.4 });
        this._everyday.hide({ delay: 0 });
        break;
      case pages.EVERYDAYS:
        document.body.style.overflow = 'hidden';
        States.application.activateProject = false;
        this._loader.hide();
        this._about.hide({ delay: 0 });
        this._home.show({ delay: 1 });
        this._about.hide({ delay: 0 });
        this._webgl.show({ delay: 0 });
        this._project.hide({ delay: 0.1 });
        this._everyday.show({ delay: 0 });
        break;
      case pages.ABOUT:
        document.body.style.overflow = 'hidden';
        States.application.activateProject = false;
        this._loader.hide();
        this._about.show({ delay: 0.65 });
        this._home.show({ delay: 1 });
        this._webgl.show({ delay: 0, transitionIn: false });
        this._project.hide({ delay: 0.1 });
        this._everyday.hide({ delay: 0 });
        break;
      default:
        this._home.hide();
    }

    this._home.updatePage(page);
    this._webgl.updatePage(page);
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

  // Update --------------------------------------------------------------------

  @autobind
  _render() {
    raf(this._render);

    this._webgl.update();
    this._project.update();
    this._everyday.update();
  }
}
