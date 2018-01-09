import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import everydays from 'config/everydays';
import EverydayItem from './EverydayItem';
import template from './everyday.tpl.html';
import './everyday.scss';


@visible()
export default class EverydayView {

  constructor(options) {
    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._delta = 0;
    this._translationDelta = 0;

    this._mouse = { x: 0, y: 0 };

    this._everydayItems = [];

    this._setupItems();
    this._setupEvents();
  }

  _setupItems() {
    for (let i = 0; i < everydays.everydayList.length; i++) {
      const everydayItem = new EverydayItem({
        id: everydays.everydayList[i].id,
        parent: this.el,
        index: i,
        length: everydays.everydayList.length,
      });

      this._everydayItems.push(everydayItem);
    }
  }

  _setupEvents() {
    this.el.addEventListener('mousedown', this._onMousedown);
    this.el.addEventListener('mousemove', this._onMousemove);
    this.el.addEventListener('mouseup', this._onMouseup);
    document.addEventListener('mouseleave', this._onMouseup);

    Signals.onResize.add(this._onResize);
    Signals.onEverydayMousedown.add(this._onEverydayMousedown);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].show();
    }
  }

  hide({ delay = 0 } = {}) {
    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].hide();
    }
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onMousedown(event) {
    this._clicked = true;

    this._mouse.x = event.clientX;
    this._mouse.y = event.clientY;
  }

  @autobind
  _onMousemove(event) {
    if (this._clicked) {

      this._delta = ( event.clientX - this._mouse.x ) * 2;
      // this._translationDelta += this._delta;


      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;
    }
  }

  @autobind
  _onMouseup() {
    this._clicked = false;
    this._delta = 0;

    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].deactivate();
    }
  }

  @autobind
  _onEverydayMousedown() {
    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].activate();
    }
  }

  @autobind
  _onResize() {
    this.resize();
  }

  resize() {
    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].resize();
    }
  }

  // Update --------------------------------------------------------------------

  update() {
    if (this.visible()) {
      for (let i = 0; i < this._everydayItems.length; i++) {
        this._everydayItems[i].update(this._delta);
      }
    }
  }
}
