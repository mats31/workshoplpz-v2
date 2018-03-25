import States from 'core/States';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './home_menu.tpl.html';
import './home_menu.scss';


@visible()
export default class HomeMenuView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      about: this.el.querySelector('.js-menu__about'),
      celia: this.el.querySelector('.js-menu__celia'),
      everydays: this.el.querySelector('.js-menu__everydays'),
      projects: this.el.querySelector('.js-menu__projects'),
    };
  }

  _setupEvents() {
    this._ui.everydays.addEventListener( 'click', this._onEverydayClick );
    this._ui.projects.addEventListener( 'click', this._onProjectClick );
    this._ui.celia.addEventListener( 'click', this._onCeliaClick );
    this._ui.about.addEventListener( 'click', this._onAboutClick );
  }

  _removeEvents() {
    this._ui.everydays.removeEventListener( 'click', this._onEverydayClick );
    this._ui.projects.removeEventListener( 'click', this._onProjectClick );
    this._ui.celia.removeEventListener( 'click', this._onCeliaClick );
    this._ui.about.removeEventListener( 'click', this._onAboutClick );
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._setupEvents();

    this.el.style.display = 'block';
    TweenLite.killTweensOf(this.el);
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

    TweenLite.killTweensOf(this.el);
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
        this._ui.everydays.classList.remove( 'is-active' );
        this._ui.projects.classList.remove( 'is-active' );
        break;
      case 'everydays':
        this._ui.everydays.classList.add( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        this._ui.projects.classList.remove( 'is-active' );
        break;
      case 'projects':
        this._ui.projects.classList.add( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
        this._ui.about.classList.remove( 'is-active' );
        break;
      default:
        this._ui.about.classList.remove( 'is-active' );
        this._ui.everydays.classList.remove( 'is-active' );
        this._ui.projects.classList.remove( 'is-active' );
    }
  }

  // Events --------------------------------------------------------------------
  @autobind
  _onProjectClick() {
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  _onEverydayClick() {
    States.router.navigateTo(pages.EVERYDAYS);
  }

  @autobind
  _onCeliaClick() {
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  _onAboutClick() {
    States.router.navigateTo(pages.ABOUT);
  }

}
