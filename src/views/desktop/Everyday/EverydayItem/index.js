import States from 'core/States';
import { autobind } from 'core-decorators';
import { visible, focused, active } from 'core/decorators';
import createDOM from 'utils/dom/createDOM';
import { modulo } from 'utils/math';
import template from './everydayItem.tpl.html';


@visible()
@focused()
@active()
export default class EverydayItem {

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this.id = options.id;
    this.index = options.index;
    this._length = options.length;
    this._parent = options.parent;

    this._margin = Math.max( 500, window.innerWidth * 0.33 );
    this._spring = 0.01;
    this._friction = 0.85 + Math.random() * 0.03;
    this._velocityX = 0;

    this._currentPos = { x: 0, y: 0, z: 0 };
    this._targetPos = { x: 0, y: 0, z: 0 };
    this._translationDelta = 0;

    this._currentScale = 1;
    this._targetScale = 1;
    this._fullScreenRatio = 1;

    this._currentBasePosition = {
      x: this.index * this._margin,
      y: this.index % 2 === 0 ? 0 : 110,
    };

    this._basePosition = {
      x: this.index * this._margin,
      y: this.index % 2 === 0 ? 0 : 110,
    };

    this._moduloLength = this._length * this._margin;

    this._img = States.resources.getImage(`everyday-${this.id}`).media;
    this._img.classList.add('js-everyday__img');
    this._img.classList.add('everyday__img');
    this._img.ondragstart = () => false;
    this._fullWidth = this._img.width;
    this._fullHeight = this._img.height;
    this._fullBasePosition = {
      x: this.index * this._fullWidth,
      y: 0
    };
    this._fullModuloLength = this._length * this._fullWidth;

    this.el.appendChild(this._img);

    this._setupEvents();
  }

  _setupEvents() {
    this.el.addEventListener('mousedown', this._onMousedown);
    this.el.addEventListener('mouseenter', this._onMouseenter);
    this.el.addEventListener('mouseleave', this._onMouseleave);
    this.el.addEventListener('mouseout', this._onMouseleave);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    TweenLite.to(
      this.el,
      1,
      {
        delay,
        opacity: 1,
        ease: 'Power2.easeOut',
      },
    );
  }

  hide({ delay = 0 } = {}) {}

  focus() {
    this._targetScale = 1.1;
  }

  blur() {
    this._targetScale = 1;
  }

  activate() {
    this._targetScale = this._fullScreenRatio;
  }

  deactivate() {
    this._targetScale = 1;
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onMousedown() {
    Signals.onEverydayMousedown.dispatch();
  }

  @autobind
  _onMouseenter() {
    if (!this.active()) {
      this.focus();
    }
  }

  @autobind
  _onMouseleave() {
    if (!this.active()) {
      this.blur();
    }
  }

  resize() {
    this._fullScreenRatio = window.innerHeight / this._img.height;
    this._fullWidth = this._img.width * this._fullScreenRatio;
    this._fullHeight = this._img.height * this._fullScreenRatio;

    this._fullModuloLength = this._length * this._fullWidth;

    this._fullBasePosition = {
      x: this.index * this._fullWidth,
      y: 0
    };
  }

  // Update --------------------------------------------------------------------

  update(delta) {

    this._updatePosition(delta);
  }

  _updatePosition(delta) {

    this._currentScale += (this._targetScale - this._currentScale) * 0.1;
    const scale = this._currentScale;

    this._translationDelta += delta;
    this._targetPos.x = this._translationDelta;

    const dx = this._targetPos.x - this._currentPos.x;
    const ax = dx * this._spring;

    this._velocityX += ax;
    this._velocityX *= this._friction;
    this._currentPos.x += this._velocityX;

    let moduloLength = this._moduloLength;
    let margin = this._margin;
    if (this.active()) {
      this._currentBasePosition.x += ( this._fullBasePosition.x - this._currentBasePosition.x ) * 0.1;
      moduloLength = this._fullModuloLength;
      margin = this._fullWidth;
    } else {
      this._currentBasePosition.x += ( this._basePosition.x - this._currentBasePosition.x ) * 0.1;
    }

    const x = modulo( this._currentBasePosition.x + this._currentPos.x, moduloLength ) - margin;

    const y = this._basePosition.y;

    const transform = `translate3d(${x}px,${y}px,0) scale3d(${scale},${scale},1)`;

    this.el.style.webkitTransform = transform;
    this.el.style.MozTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.OTransform = transform;
    this.el.style.transform = transform;
  }
}
