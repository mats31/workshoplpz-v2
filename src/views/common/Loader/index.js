import States from 'core/States';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import lottie from 'lottie-web';
import template from './loader.tpl.html';
import './loader.scss';


@visible()
export default class LoaderView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      loaderContainer: this.el.querySelector('.js-loader__container'),
      loaderText: this.el.querySelector('.js-loader__text'),
      loaderValue: this.el.querySelector('.js-loader__value'),
    };

    // this.setupDOM();
    this.setupEvents();

    this.show();

    lottie.loadAnimation({
      container: this._ui.loaderContainer, // the dom element that will contain the animation
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: 'lottie/data.json', // the path to the animation json
    });
  }

  setupDOM() {
    this.counter = document.createElement('div');
    this.el.appendChild(this.counter);
  }

  setupEvents() {
    Signals.onAssetLoaded.add(this.onAssetLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    if (States.IS_FF || States.IS_SAFARI && !States.MOBILE && !States.TABLET) {
      this._ui.loaderText.style.display = 'block';
    }
  }

  hide({ delay = 0 } = {}) {

    TweenLite.to(
      this.el,
      2,
      {
        delay,
        opacity: 0,
        onComplete: () => { this.el.style.display = 'none'; },
      },
    );
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetLoaded(percent) {
    const intPercent = parseInt(percent, 10);
    const value = `${intPercent}%`;

    this._ui.loaderValue.innerHTML = value;
  }

  @autobind
  onAssetsLoaded(percent) {

    // const value = `${percent}%`;
    //
    // this.counter.innerHTML = value;
    this.hide();
  }

}
