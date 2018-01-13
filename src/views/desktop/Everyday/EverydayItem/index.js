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

    this._currentMargin = Math.max( 500, window.innerWidth * 0.33 );
    this._spring = 0.01;
    this._friction = 0.85 + Math.random() * 0.03;
    this._velocityX = 0;
    this._imgW = this._imgH = Math.max( 300, window.innerWidth * 0.2 );
    this._margin = this._currentMargin = this._imgW * 2;
    this._moduloLength = this._currentModuloLength = this._length * this._margin;
    this._fullModuloLength = this._length * this._fullWidth;

    this._currentPos = { x: 0, y: 0, z: 0 };
    this._targetPos = { x: 0, y: 0, z: 0 };
    this._translationDelta = 0;
    this._offsetFullWidth = 0;

    this._currentScale = 1;
    this._targetScale = 1;
    this._fullScreenRatio = 1;
    this._tappedIndex = 0;
    this._offsetTarget = 0;
    this._deltaFactor = 1;

    this._currentTransformOrgin = 50;
    this._targetTransformOrigin = 50;

    this._currentBasePosition = {
      x: this.index * this._margin,
      y: this.index % 2 === 0 ? 0 : 110,
    };

    this._basePosition = {
      x: this.index * this._margin,
      y: this.index % 2 === 0 ? window.innerHeight * 0.5 : window.innerHeight * 0.6,
    };

    this._x = 0;
    this._y = 0;

    this._img = States.resources.getImage(`everyday-${this.id}`).media;
    this._img.classList.add('js-everyday__img');
    this._img.classList.add('everyday__img');
    this._img.ondragstart = () => false;
    this._fullWidth = this._img.width;
    this._fullHeight = this._img.height;
    this._fullBasePosition = {
      x: this.index * this._fullWidth,
      y: 0,
    };

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

  activate(index) {
    this._tappedIndex = index;
    // this._offsetTarget = ( this._fullWidth * index ) + this._currentPos.x - ( window.innerWidth * 0.5 - this._fullWidth * 0.5 );
    this._offsetTarget = ( this._fullWidth * index ) + this._currentPos.x - ( window.innerWidth * 0.5 - ( window.innerWidth - this._fullWidth ) * 0.5 );
    this._targetScale = this._fullScreenRatio;
    this._deltaFactor = 2;
    this._targetTransformOrigin = 0;
    // this._currentModuloLength = this._fullModuloLength;
  }

  deactivate() {
    this._targetScale = 1;
    this._deltaFactor = 1;
    this._targetTransformOrigin = 50;
    // this._currentModuloLength = this._moduloLength;
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onMousedown() {

    let translationFactor;
    let customIndex;

    // if (this._currentPos.x > 0) {
    //   translationFactor = Math.floor( Math.abs(this._currentPos.x - this._margin + this._imgW) / ( this._length * this._margin) );
    //   const firstItem = this.index === 0 && Math.abs(this._currentPos.x) < Math.abs(this._margin * ( this._length - 1 )) ? this._length : 0;
    //   const secondItem = this.index === 1 && Math.abs(this._currentPos.x) < Math.abs(this._margin * ( this._length - 2 )) ? this._length : 0;
    //   const thirdItem = this.index === 2 && Math.abs(this._currentPos.x) < Math.abs(this._margin * ( this._length - 3 )) ? this._length : 0;
    //   customIndex = ( this.index - this._length ) - translationFactor * this._length + firstItem + secondItem + thirdItem;
    // }

    if (this._currentPos.x > 0) {

      const xPos = this._currentPos.x + this._basePosition.x - window.innerWidth;
      const sideFactor = xPos > 0 ? 1 : 0;
      translationFactor = Math.floor( Math.abs(xPos) / (this._length * this._margin) );

      customIndex = sideFactor * ( ( this.index - this._length ) - translationFactor * this._length );
    } else {
      translationFactor = Math.floor( Math.abs(this._currentPos.x + this._basePosition.x - window.innerWidth) / (this._length * this._margin) );
      customIndex = this.index + this._length * translationFactor;
    }

    Signals.onEverydayMousedown.dispatch(customIndex);
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
    this._imgW = this._imgH = Math.max( 300, window.innerWidth * 0.2 );
    this.el.style.width = `${this._imgW}px`;

    this._margin = this._imgW * 2;

    this._fullScreenRatio = window.innerHeight / this._imgH;
    this._fullWidth = this._imgW * this._fullScreenRatio;
    this._fullHeight = this._imgH * this._fullScreenRatio;

    this._moduloLength = this._length * this._margin;
    this._fullModuloLength = this._length * this._fullWidth;

    const y1 = window.innerHeight * 0.5 - this._imgH * 0.5;
    const y2 = window.innerHeight * 0.5 - this._imgH * 0.5 + window.innerHeight * 0.07;

    this._basePosition = {
      x: this.index * this._margin,
      y: this.index % 2 === 0 ? y1 : y2,
    };

    this._fullBasePosition = {
      x: this.index * this._fullWidth,
      y: y1,
    };
  }

  // Update --------------------------------------------------------------------

  update(delta) {

    this._updatePosition(delta);
    // this._updateTransformOrigin();
  }

  _updatePosition(delta) {

    this._currentScale += (this._targetScale - this._currentScale) * 0.1;
    const scale = this._currentScale;

    this._translationDelta += delta * this._deltaFactor;
    this._targetPos.x = this._translationDelta;

    if (this.active()) {
      this._currentPos.x += ( this._targetPos.x - this._currentPos.x ) * 0.1;
    } else {
      const dx = this._targetPos.x - this._currentPos.x;
      const ax = dx * this._spring;

      this._velocityX += ax;
      this._velocityX *= this._friction;
      this._currentPos.x += this._velocityX;
    }

    if (this.active()) {
      this._currentBasePosition.x += ( this._fullBasePosition.x - this._currentBasePosition.x ) * 0.1;
      this._currentBasePosition.y += ( this._fullBasePosition.y - this._currentBasePosition.y ) * 0.1;
      // this._offsetFullWidth += ( this._fullWidth * 0.5 * this._tappedIndex - this._offsetFullWidth ) * 0.1;
      this._offsetFullWidth += ( this._offsetTarget - this._offsetFullWidth ) * 0.1;
      this._currentMargin += ( this._fullWidth - this._currentMargin ) * 0.1;
      this._currentModuloLength += ( this._fullModuloLength - this._currentModuloLength ) * 0.1;
    } else {
      this._currentBasePosition.x += ( this._basePosition.x - this._currentBasePosition.x ) * 0.1;
      this._currentBasePosition.y += ( this._basePosition.y - this._currentBasePosition.y ) * 0.1;
      this._offsetFullWidth += -this._offsetFullWidth * 0.1;
      this._currentMargin += ( this._margin - this._currentMargin ) * 0.1;
      this._currentModuloLength += ( this._moduloLength - this._currentModuloLength ) * 0.1;
    }

    // const x = modulo( this._basePosition.x + this._currentPos.x, this._moduloLength ) - this._margin;
    this._x = modulo( this._currentBasePosition.x + this._currentPos.x - this._offsetFullWidth + this._currentMargin, this._currentModuloLength) - this._currentMargin;
    // const x = this._currentBasePosition.x + this._currentPos.x - this._offsetFullWidth;

    this._y = this._currentBasePosition.y;

    const transform = `translate3d(${this._x}px,${this._y}px,0) scale3d(${scale},${scale},1)`;

    this.el.style.webkitTransform = transform;
    this.el.style.MozTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.OTransform = transform;
    this.el.style.transform = transform;
  }

  _updateTransformOrigin() {

    if (this.active()) {
      this._currentTransformOrgin += ( this._targetTransformOrigin - this._currentTransformOrgin ) * 1;
    } else {
      this._currentTransformOrgin = this._targetTransformOrigin;
    }


    const transformOrigin = `${this._currentTransformOrgin}% 50%`;

    this.el.style.webkitTransformOrigin = transformOrigin;
    this.el.style.MozTransformOrigin = transformOrigin;
    this.el.style.msTransformOrigin = transformOrigin;
    this.el.style.OTransformOrigin = transformOrigin;
    this.el.style.transformOrigin = transformOrigin;
  }
}
