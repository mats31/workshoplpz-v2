import { autobind } from 'core-decorators';
import * as pages from 'core/pages';
import Navigo from 'navigo';

export default class Router {

  // Setup ---------------------------------------------------------------------

  constructor(options) {
    this.updatePageCallback = options.updatePageCallback;
    this.assetsLoaded = false;

    this.setupRouter();
    this.setupEvents();
  }

  setupRouter() {
    const root = `${window.location.protocol}//${window.location.host}`;
    const useHash = false;
    this.navigo = new Navigo(root, useHash);

    this.navigo.notFound(this.onRouteNotFound);
    this.navigo.on({
      '/': { as: pages.HOME, uses: this.onRouteHome },
      '/everydays': { as: pages.EVERYDAYS, uses: this.onRouteEverydays },
      '/project/:id': { as: pages.PROJECT, uses: this.onRouteProject },
      '/about': { as: pages.ABOUT, uses: this.onRouteAbout },
    });
  }

  setupEvents() {
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  // State ---------------------------------------------------------------------

  navigateTo(id, options = {}) {
    this.navigo.navigate(this.navigo.generate(id, options));
  }

  getLastRouteResolved() {
    const lastRouteResolved = this.navigo.lastRouteResolved();

    if (!lastRouteResolved.params) {
      lastRouteResolved.params = null;
    }

    return lastRouteResolved;
  }

  // Events --------------------------------------------------------------------

  @autobind
  onAssetsLoaded() {
    this.assetsLoaded = true;
  }

  @autobind
  onRouteNotFound() {
    this.updatePageCallback(pages.HOME);
  }

  @autobind
  onRouteHome() {
    this.updatePageCallback(pages.HOME);
  }


  @autobind
  onRouteEverydays() {
    this.updatePageCallback(pages.EVERYDAYS);
  }

  @autobind
  onRouteProject() {
    this.updatePageCallback(pages.PROJECT);
  }

  @autobind
  onRouteAbout() {
    this.updatePageCallback(pages.ABOUT);
  }

}
