import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible, toggle, opened, focused, selected } from 'core/decorators';
import { createCanvas, resizeCanvas } from 'utils/canvas';
import template from './cursor.tpl.html';
import './cursor.scss';


@visible()
@toggle('slided', 'slide', 'unslide')
@opened
@focused
@selected
export default class CursorView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._setupCanvas();
    this._setupEvents();
  }

  _setupCanvas() {}

  _setupEvents() {}

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';
  }

  hide({ delay = 0 } = {}) {
    this._homeMenu.hide({ delay });
  }

  // Events --------------------------------------------------------------------

}
