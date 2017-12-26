import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import LoaderView from 'views/common/Loader/Loader';
import HomeView from 'views/desktop/Home';
import WebGLView from 'views/desktop/WebGL';

export default class DesktopAppView {

  // Setup ---------------------------------------------------------------------

  constructor() {
    this.el = document.getElementById('application');

    this.views = [];
    this._loader = this._setupLoader();
    this._home = this._setupHome();
    this._webgl = this._setupWebGL();

    this.views.push(this._loader, this._home);

    this._setupEvents();
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: this.el,
    });

    return view;
  }

  _setupHome() {
    const view = new HomeView({
      parent: this.el,
    });

    return view;
  }

  _setupWebGL() {
    const view = new WebGLView({
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

  // Events --------------------------------------------------------------------

  updatePage(page) {

    switch (page) {
      case pages.HOME:
        this._loader.hide();
        this._home.show();
        this._webgl.show();
        break;
      case pages.PROJECT:
        this._webgl.updatePage(page);
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
  onScroll() {
    Signals.onScroll.dispatch();
  }

  @autobind
  onScrollWheel() {
    Signals.onScrollWheel.dispatch();
  }

}
