import States from 'core/States';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible, opened } from 'core/decorators';
import template from './mobile_home_menu.tpl.html';
import './mobile_home_menu.scss';


@visible()
@opened()
export default class MobileHomeMenuView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      button: this.el.querySelector('.js-menu__button'),
      container: this.el.querySelector('.js-menu__container'),
      about: this.el.querySelector('.js-menu__about'),
      home: this.el.querySelector('.js-menu__home'),
      everydays: this.el.querySelector('.js-menu__everydays'),
    };
  }

  _setupEvents() {
    this._ui.button.addEventListener( 'touchend', this._onButtonClick );
    this._ui.everydays.addEventListener( 'touchend', this._onEverydayClick );
    this._ui.home.addEventListener( 'touchend', this._onHomeClick );
    this._ui.about.addEventListener( 'touchend', this._onAboutClick );
  }

  _removeEvents() {
    this._ui.button.removeEventListener( 'touchend', this._onButtonClick );
    this._ui.everydays.removeEventListener( 'touchend', this._onEverydayClick );
    this._ui.home.removeEventListener( 'touchend', this._onHomeClick );
    this._ui.about.removeEventListener( 'touchend', this._onAboutClick );
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._setupEvents();

    this.el.style.display = 'block';
    TweenLite.to(
      this.el,
      1,
      {
        delay,
        opacity: 1,
      },
    );
  }

  hide({ delay = 0 } = {}) {
    this._removeEvents();

    TweenLite.to(
      this.el,
      1,
      {
        delay,
        opacity: 0,
        onComplete: () => {
          this.el.style.display = 'none';
        },
      },
    );
  }

  open() {
    TweenLite.killTweensOf(this._ui.container);
    TweenLite.to(
      this._ui.container,
      1,
      {
        y: '0%',
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.home);
    TweenLite.to(
      this._ui.home,
      1,
      {
        delay: 0.3,
        x: 0,
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.everydays);
    TweenLite.to(
      this._ui.everydays,
      1,
      {
        delay: 0.5,
        x: 0,
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.about);
    TweenLite.to(
      this._ui.about,
      1,
      {
        delay: 0.7,
        x: 0,
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );
  }

  close() {
    TweenLite.killTweensOf(this._ui.container);
    TweenLite.to(
      this._ui.container,
      1,
      {
        y: '-100%',
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.about);
    TweenLite.to(
      this._ui.about,
      1,
      {
        delay: 0,
        x: -100,
        opacity: 0,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.everydays);
    TweenLite.to(
      this._ui.everydays,
      1,
      {
        delay: 0.2,
        x: -100,
        opacity: 0,
        ease: 'Power2.easeOut',
      },
    );

    TweenLite.killTweensOf(this._ui.home);
    TweenLite.to(
      this._ui.home,
      1,
      {
        delay: 0.4,
        x: -100,
        opacity: 0,
        ease: 'Power2.easeOut',
      },
    );
  }

  setState( state ) {

    switch ( state ) {
      case 'about':
        this._ui.about.classList.add( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
        break;
      case 'everydays':
        this._ui.everydays.classList.add( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        break;
      case 'projects':
        this._ui.everydays.classList.remove( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        break;
      default:
        this._ui.about.classList.remove( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
    }
  }

  // Events --------------------------------------------------------------------
  @autobind
  _onButtonClick() {
    if (this.opened()) {
      this.close();
    } else {
      this.open();
    }
  }

  @autobind
  _onEverydayClick() {
    this.close();
    States.router.navigateTo(pages.EVERYDAYS);
  }

  @autobind
  _onHomeClick() {
    this.close();
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  _onAboutClick() {
    this.close();
    States.router.navigateTo(pages.ABOUT);
  }

}
