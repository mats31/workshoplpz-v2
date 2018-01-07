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
      everydays: this.el.querySelector('.js-menu__everydays'),
      projects: this.el.querySelector('.js-menu__projects'),
    };

    this._setupEvents();
  }

  _setupEvents() {
    this._ui.everydays.addEventListener( 'click', this.onEverydayClick );
    this._ui.projects.addEventListener( 'click', this.onProjectClick );
    this._ui.about.addEventListener( 'click', this.onAboutClick );
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
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
    TweenLite.to(
      this.el,
      1,
      {
        delay,
        opacity: 0,
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
  onProjectClick() {
    States.router.navigateTo(pages.HOME);
  }

  @autobind
  onEverydayClick() {
    States.router.navigateTo(pages.EVERYDAYS);
  }

  @autobind
  onAboutClick() {
    States.router.navigateTo(pages.ABOUT);
  }

}
