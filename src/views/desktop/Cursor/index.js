import createDOM from 'utils/dom/createDOM';
import * as pages from 'core/pages';
import { autobind } from 'core-decorators';
import { visible, toggle, opened, focused, selected } from 'core/decorators';
import { createCanvas, resizeCanvas } from 'utils/canvas';
import template from './cursor.tpl.html';
import './cursor.scss';


@visible()
@toggle('slided', 'slide', 'unslide')
@opened(true)
@focused()
@selected()
export default class CursorView {

  // Setup ---------------------------------------------------------------------

  constructor(options) {

    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._page = pages.HOME;

    this._width = this._height = 44;
    this._scale = 1;

    this._clicked = false;
    this._mouse = { x: 0, y: 0 };

    this._setupCanvas();
    this._setupEvents();
  }

  _setupCanvas() {
    this._ctx = createCanvas(this._width, this._height, true, 2);
    this._ctx.strokeStyle = 'white';
    this._canvasW = this._ctx.canvas.width;
    this._canvasH = this._ctx.canvas.height;
    this.el.appendChild(this._ctx.canvas);

    this._line1 = {
      point1: {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        xTarget: this._canvasW * 0.5,
        yTarget: this._canvasH * 0.5,
      },
      point2: {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        xTarget: this._canvasW * 0.5,
        yTarget: this._canvasH * 0.5,
      },
      needsUpdate: false,
    };

    this._line2 = {
      point1: {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        xTarget: this._canvasW * 0.5,
        yTarget: this._canvasH * 0.5,
      },
      point2: {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        xTarget: this._canvasW * 0.5,
        yTarget: this._canvasH * 0.5,
      },
      needsUpdate: false,
    };
  }

  _setupEvents() {
    document.body.addEventListener('mousedown', this._onMousedown);
    document.body.addEventListener('mousemove', this._onMousemove);
    document.body.addEventListener('mouseup', this._onMouseup);
    document.body.addEventListener('mouseleave', this._onMouseleave);

    Signals.onProjectCloseMouseenter.add(this._onCloseMouseenter);
    Signals.onProjectCloseMouseout.add(this._onCloseMouseout);
    Signals.onEverydayMouseenter.add(this._onEverydayMouseenter);
    Signals.onEverydayMouseout.add(this._onEverydayMouseout);
  }

  // State ---------------------------------------------------------------------

  updatePage(page) {
    this._page = page;
  }

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      1,
      {
        delay,
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        ease: 'Expo.easeOut',
      },
    );
    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      1,
      {
        delay,
        x: this._canvasW * 0.5,
        y: this._canvasH,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this._line1.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      1,
      {
        delay,
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        ease: 'Expo.easeOut',
      },
    );
    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      1,
      {
        delay,
        x: this._canvasW * 1,
        y: this._canvasH * 1,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  hide({ delay = 0 } = {}) {
    this._homeMenu.hide({ delay });
  }

  select() {
    TweenLite.killTweensOf(this);
    this._line1.needsUpdate = true;
    this._line2.needsUpdate = true;
    TweenLite.to(
      this,
      1,
      {
        _scale: 0.7,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this._line1.needsUpdate = false;
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  deselect() {
    TweenLite.killTweensOf(this);
    this._line1.needsUpdate = true;
    this._line2.needsUpdate = true;
    TweenLite.to(
      this,
      1,
      {
        _scale: 1,
        ease: 'Expo.easeOut',
        onComplete: () => {
          this._line1.needsUpdate = false;
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  slide(direction) {
    if (direction === 'left') {
      this._slideToLeft();
    } else {
      this._slideToRight();
    }
  }

  _slideToLeft() {
    this._direction = 'left';

    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      1,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        ease: 'Expo.easeOut',
      },
    );
    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 1,
        y: this._canvasH * 1,
        onComplete: () => {
          this._line1.needsUpdate = false;
        },
      },
    );

    // Second line ---
    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );

    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );

    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 1,
        y: this._canvasH * 0,
        onComplete: () => {
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  _slideToRight() {
    this._direction = 'right';

    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      1,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
        ease: 'Expo.easeOut',
      },
    );
    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 0,
        y: this._canvasH * 1,
        onComplete: () => {
          this._line1.needsUpdate = false;
        },
      },
    );

    // Second line ---
    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );

    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );

    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 0,
        y: this._canvasH * 0,
        onComplete: () => {
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  unslide() {
    this._goToNormalState();
  }

  close() {

    // Line 1 ---
    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line1.point1,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 0,
        y: this._canvasH * 1,
      },
    );
    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 1,
        y: this._canvasH * 0,
        onComplete: () => {
          this._line1.needsUpdate = false;
        },
      },
    );

    // Line 2 ---
    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0,
        y: this._canvasH * 0,
      },
    );
    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 1,
        y: this._canvasH * 1,
        onComplete: () => {
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  open() {
    this._goToNormalState();
  }

  focus() {

    // Line1 ---
    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0,
      },
    );

    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 1,
      },
    );

    // Line 2 ---
    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0,
        y: this._canvasH * 0.5,
      },
    );

    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        x: this._canvasW * 1,
        y: this._canvasH * 0.5,
      },
    );
  }

  blur() {
    this._goToNormalState();
  }

  _goToNormalState() {
    TweenLite.killTweensOf(this._line1.point1);
    this._line1.needsUpdate = true;
    TweenLite.to(
      this._line1.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.killTweensOf(this._line1.point2);
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line1.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 0.5,
        y: this._canvasH,
        onComplete: () => {
          this._line1.needsUpdate = false;
        },
      },
    );

    TweenLite.killTweensOf(this._line2.point1);
    this._line2.needsUpdate = true;
    TweenLite.to(
      this._line2.point1,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.killTweensOf(this._line2.point2);
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        x: this._canvasW * 0.5,
        y: this._canvasH * 0.5,
      },
    );
    TweenLite.to(
      this._line2.point2,
      0.15,
      {
        delay: 0.15,
        x: this._canvasW * 1,
        y: this._canvasH * 1,
        onComplete: () => {
          this._line2.needsUpdate = false;
        },
      },
    );
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onCloseMouseenter() {
    this.close();
  }

  @autobind
  _onCloseMouseout() {
    this.open();
  }

  @autobind
  _onEverydayMouseenter() {
    this.focus();
  }

  @autobind
  _onEverydayMouseout() {
    this.blur();
  }

  @autobind
  _onMousedown(event) {
    this.select();

    this._mouse.x = event.pageX;
    this._mouse.y = event.pageY;

    this._clicked = true;
  }

  @autobind
  _onMousemove(event) {
    const x = event.pageX - this._canvasW * 0.5;
    const y = event.pageY - this._canvasH * 0.5;
    const transform = `translate3d(${x}px,${y}px,1px)`;
    this.el.style.webkitTransform = transform;
    this.el.style.MozTransform = transform;
    this.el.style.msTransform = transform;
    this.el.style.OTransform = transform;
    this.el.style.transform = transform;

    if (
      this._clicked && this._page === pages.HOME ||
      this._clicked && this._page === pages.EVERYDAYS
    ) {
      const direction = event.pageX - this._mouse.x;

      if (this.slided()) {
        if (direction > 0 && this._direction === 'left') {
          this._slideToRight();
        } else if (direction < 0 && this._direction === 'right') {
          this._slideToLeft();
        }
      }

      if (direction > 0) {
        this.slide('right');
      } else {
        this.slide('left');
      }

      this.deselect();
    }

    this._mouse.x = event.pageX;
    this._mouse.y = event.pageY;
  }

  @autobind
  _onMouseup() {
    this.deselect();
    this.unslide();
    this.blur();
    this._clicked = false;
  }

  @autobind
  _onMouseleave() {
    this.deselect();
    this.unslide();
    this.blur();
    this._clicked = false;
  }

  // Update --------------------------------------------------------------------

  update() {

    if (this.needsUpdate) {
      this._ctx.clearRect(0, 0, this._canvasW, this._canvasH);
      this._updateScale();
      this._updateLine1();
      this._updateLine2();
      this._ctx.restore();
      // this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    this.needsUpdate = this._line1.needsUpdate || this._line2.needsUpdate;
  }

  _updateScale() {
    this._ctx.save();
    this._ctx.translate(this._canvasW / 2, this._canvasH / 2);
    this._ctx.scale(this._scale, this._scale);
  }

  _updateLine1() {

    // this._line1.point1.x += ( this._line1.point1.xTarget - this._line1.point1.x ) * 0.1;
    // this._line1.point1.y += ( this._line1.point1.yTarget - this._line1.point1.y ) * 0.1;
    //
    // this._line1.point2.x += ( this._line1.point2.xTarget - this._line1.point2.x ) * 0.1;
    // this._line1.point2.y += ( this._line1.point2.yTarget - this._line1.point2.y ) * 0.1;

    const x1 = this._line1.point1.x - this._canvasW * 0.5;
    const y1 = this._line1.point1.y - this._canvasH * 0.5;
    const x2 = this._line1.point2.x - this._canvasW * 0.5;
    const y2 = this._line1.point2.y - this._canvasH * 0.5;

    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
  }

  _updateLine2() {

    // this._line2.point1.x += ( this._line2.point1.xTarget - this._line2.point1.x ) * 0.1;
    // this._line2.point1.y += ( this._line2.point1.yTarget - this._line2.point1.y ) * 0.1;
    //
    // this._line2.point2.x += ( this._line2.point2.xTarget - this._line2.point2.x ) * 0.1;
    // this._line2.point2.y += ( this._line2.point2.yTarget - this._line2.point2.y ) * 0.1;

    const x1 = this._line2.point1.x - this._canvasW * 0.5;
    const y1 = this._line2.point1.y - this._canvasH * 0.5;
    const x2 = this._line2.point2.x - this._canvasW * 0.5;
    const y2 = this._line2.point2.y - this._canvasH * 0.5;

    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
  }

}
