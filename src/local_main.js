/* eslint no-unused-vars: "off" */
import { autobind } from 'core-decorators';
import domready from 'domready';
import gsap from 'gsap';
// import AudioController from 'helpers/AudioController'; /* exported AudioController */
import AssetLoader from 'core/AssetLoader';
import States from 'core/States';
import Signals from 'core/Signals'; /* exported Signals */
import Router from 'core/Router';
import FallbackView from 'views/common/Fallback';
import LoaderView from 'views/common/Loader';

class Main {

  // Setup ---------------------------------------------------------------------

  constructor() {

    const styles = [
      'background: linear-gradient(#FC466B, #3F5EFB)',
      'border: 1px solid #00ff00',
      'color: white',
      'display: block',
      'line-height: 20px',
      'text-align: center',
      'font-weight: bold',
    ].join(';');

    console.log('%c Make love not war ! ❤️', styles);

    if (States.IS_IE) {
      this._fallback = this._setupFallback();
    } else {
      this._loader = this._setupLoader();
      Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    }
  }

  _setupLoader() {
    const view = new LoaderView({
      parent: document.body,
    });

    return view;
  }

  _setupFallback() {
    const view = new FallbackView({
      parent: document.body,
    });

    return view;
  }

  start() {

    if (!States.MOBILE) {
        import('views/desktop/Application/Application').then((App) => {
          import('stylesheets/main.scss').then(() => {
            this._application = new App();
            this._onLoadApplication();
          });
        });
    } else {
        import('views/mobile/MobileApplication/MobileApplication').then((App) => {
          import('stylesheets/mobile_main.scss').then(() => {
            this._application = new App();
            this._onLoadApplication();
          });
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
