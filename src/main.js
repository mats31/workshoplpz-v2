/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
// import Application from 'views/desktop/Application/Application';
// import MobileApplication from 'views/mobile/Application/Application';
// import Router from 'core/Router';
// import './stylesheets/main.scss';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  start() {
    // this._application = new Application();
    // this._onLoadApplication();

    if (States.MOBILE) {
      import('views/mobile/MobileApplication/MobileApplication').then( (Application) => {
        import('./stylesheets/mobile_main.scss').then( (() => {
          this._application = new Application();
          this._onLoadApplication();
        }));
      });
    } else {
      import('views/desktop/Application/Application').then( ( Application ) => {
        import('./stylesheets/main.scss').then( (() => {
          this._application = new Application();
          this._onLoadApplication();
        }));
      });
    }
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
