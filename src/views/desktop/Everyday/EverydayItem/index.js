import States from 'core/States';
import { visible } from 'core/decorators';
import createDOM from 'utils/dom/createDOM';
import { modulo } from 'utils/math';
import template from './everydayItem.tpl.html';


@visible()
export default class EverydayItem {

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this.id = options.id;
    this._length = options.length;

    this._margin = Math.max( 380, window.innerWidth * 0.33 );
    this._spring = 0.01;
    this._friction = 0.85 + Math.random() * 0.03;
    this._velocityX = 0;

    this._currentPos = { x: 0, y: 0, z: 0 };
    this._targetPos = { x: 0, y: 0, z: 0 };
    this._translationDelta = 0;

    this._basePosition = {
      x: options.index * this._margin,
      y: options.index % 2 === 0 ? 0 : 110,
    };

    this._moduloLength = this._length * this._margin;

    this._img = States.resources.getImage(`everyday-${this.id}`).media;
    this._img.classList.add('js-everyday__img');
    this._img.classList.add('everyday__img');

    this.el.appendChild(this._img);
  }

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

  // Update --------------------------------------------------------------------

  update(delta) {

    this._updatePosition(delta);
  }

  _updatePosition(delta) {
    this._translationDelta += delta;
    this._targetPos.x = this._translationDelta;

    const dx = this._targetPos.x - this._currentPos.x;
    const ax = dx * this._spring;

    this._velocityX += ax;
    this._velocityX *= this._friction;
    this._currentPos.x += this._velocityX;

    const x = modulo( this._basePosition.x + this._currentPos.x, this._moduloLength ) - this._margin;
    const y = this._basePosition.y;

    const transform = `translate3d(${x}px,${y}px,0)`;
    this.el.style.webkitTransform = transform;
    this.el.style.MozTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.OTransform = transform;
    this.el.style.transform = transform;
  }
}
