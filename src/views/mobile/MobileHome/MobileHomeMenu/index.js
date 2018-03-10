import States from 'core/States';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './mobile_home_menu.tpl.html';
import './mobile_home_menu.scss';


@visible()
export default class MobileHomeMenuView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      about: this.el.querySelector('.js-home__menuAbout'),
      separator: this.el.querySelector('.js-home__menuSeparator'),
      home: this.el.querySelector('.js-home__menuProject'),
      everydays: this.el.querySelector('.js-home__menuEveryday'),
    };
  }

  _setupEvents() {
    this._ui.everydays.addEventListener( 'touchend', this._onEverydayClick );
    this._ui.home.addEventListener( 'touchend', this._onHomeClick );
    this._ui.about.addEventListener( 'touchend', this._onAboutClick );
  }

  _removeEvents() {
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

  setState( state ) {

    switch ( state ) {
      case 'about':
        this._ui.about.classList.add( 'is-active' );
        this._ui.separator.classList.remove( 'is-active' );
        this._ui.home.classList.remove( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
        break;
      case 'everydays':
        this._ui.everydays.classList.add( 'is-active' );
        this._ui.separator.classList.add( 'is-active' );
        this._ui.home.classList.remove( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        break;
      case 'projects':
        this._ui.separator.classList.add( 'is-active' );
        this._ui.home.classList.add( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        break;
      default:
        this._ui.home.classList.add( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
    }
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onEverydayClick() {
    States.router.navigateTo(pages.EVERYDAYS);
  }

  @autobind
  _onHomeClick() {
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  _onAboutClick() {
    States.router.navigateTo(pages.ABOUT);
  }

}
