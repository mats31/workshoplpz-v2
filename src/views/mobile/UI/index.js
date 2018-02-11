import createDOM from 'utils/dom/createDOM';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './ui.tpl.html';
import './ui.scss';


@visible()
export default class UIView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      topLine: this.el.querySelector('.js-ui__topLine'),
      bottomLine: this.el.querySelector('.js-ui__bottomLine'),
    };

    this._page = null;
    this._firstHide = false;

    this._setupEvents();
  }

  _setupEvents() {
    Signals.onCursorSlide.add(this._onCursorSlide);
    Signals.onCursorUnslide.add(this._onCursorUnslide);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {

    if (!this._firstHide) {
      TweenLite.killTweensOf(this.el);
      TweenLite.to(
        this.el,
        1,
        {
          delay,
          scaleX: 1,
          ease: 'Power4.easeOut',
        },
      );
    }
  }

  hide({ delay = 0 } = {}) {
    this._firstHide = true;

    TweenLite.killTweensOf(this.el);
    TweenLite.to(
      this.el,
      1,
      {
        delay,
        scaleX: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this.el.style.display = 'none';
        },
      },
    );
  }

  // State ---------------------------------------------------------------------

  updatePage(page) {
    this._page = page;
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onCursorSlide() {
    this.hide();
  }

  @autobind
  _onCursorUnslide() {
    if (this._page === pages.HOME || this._page === pages.EVERYDAYS) {
      this.show();
    }
  }

}
