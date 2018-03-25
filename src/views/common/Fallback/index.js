import States from 'core/States';
import createDOM from 'utils/dom/createDOM';
import { visible } from 'core/decorators';
import template from './fallback.tpl.html';
import './fallback.scss';

@visible()
export default class Fallback {
  constructor(options) {
    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    if (States.IS_IE) {
      this.show();
    }
  }

  // States ----------
  show() {
    this.el.style.display = 'block';
  }

  hide() {
    this.el.style.display = 'none';
  }
}
