import States from 'core/States';
import * as pages from 'core/pages';
import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import MobileHomeMenuView from './MobileHomeMenu';
import template from './mobile_home.tpl.html';
import './mobile_home.scss';


@visible()
export default class MobileHomeView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._homeMenu = this._setupHomeMenu();

    this._setupEvents();
  }

  _setupHomeMenu() {
    return new MobileHomeMenuView({
      parent: this.el,
    });
  }

  _setupEvents() {
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    this._homeMenu.show({ delay });
  }

  hide({ delay = 0 } = {}) {
    this._homeMenu.hide({ delay });

    TweenLite.delayedCall( delay + 1, () => {
      // this.el.style.display = 'none';
    });
  }

  updatePage(page) {
    switch (page) {
      case pages.HOME:
        this._homeMenu.setState('projects');
        break;
      case pages.EVERYDAYS:
        this._homeMenu.setState('everydays');
        break;
      case pages.ABOUT:
        this._homeMenu.setState('about');
        break;
      default:
        // this._home.hide();
    }
  }

  // Events --------------------------------------------------------------------
  @autobind
  onAssetsLoaded() {

    const image = States.resources.getImage('twitter').media;
    this.el.appendChild(image);
  }

}
