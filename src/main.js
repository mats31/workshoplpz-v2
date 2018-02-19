/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import Application from 'views/desktop/Application/Application';
import MobileApplication from 'views/mobile/MobileApplication/MobileApplication';
// import Router from 'core/Router';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  start() {
    // this._application = new Application();
    // this._onLoadApplication();

    const App = States.MOBILE ? MobileApplication : Application;
    this._application = new App();
    this._onLoadApplication();
  }

  _onLoadApplication() {
    States.router = new Router({
      updatePageCallback: this.updatePage,
    });

    States.router.navigo.resolve();
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {
    this.start();
  }

  @autobind
  updatePage(page) {
    if (this._application) {
      this._application.updatePage(page);
    }
  }
}

domready(() => {

  new Main();
});
