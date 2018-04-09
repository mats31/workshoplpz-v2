import createDOM from 'utils/dom/createDOM';
import States from 'core/States';
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
    this._translationShow = 0;
    this._deltaKeyboard = 0;

    this._mouse = { x: 0, y: 0 };

    this._timeout = null;
    this.needsUpdate = false;

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
    if (!States.TABLET) {
      this.el.addEventListener('mousedown', this._onMousedown);
      this.el.addEventListener('mousemove', this._onMousemove);
      this.el.addEventListener('mouseup', this._onMouseup);
      document.addEventListener('mouseleave', this._onMouseup);

      Signals.onKeydownLeft.add(this._onKeydownLeft);
      Signals.onKeydownRight.add(this._onKeydownRight);
      Signals.onKeyup.add(this._onKeyup);
    } else {
      this.el.addEventListener('touchstart', this._onTouchstart);
      this.el.addEventListener('touchmove', this._onTouchmove);
      this.el.addEventListener('touchend', this._onTouchend);
    }

    Signals.onResize.add(this._onResize);
    Signals.onEverydayMousedown.add(this._onEverydayMousedown);
    Signals.onScrollWheel.add(this._onScrollWheel);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0, transitionFromDown = false } = {}) {
    TweenLite.killTweensOf(this.el);
    TweenLite.killTweensOf(this);
    this.needsUpdate = true;
    this.el.style.display = 'block';
    this.el.style.pointerEvents = 'initial';

    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].show({ delay });
    }

    if (transitionFromDown) {
      TweenLite.fromTo(
        this.el,
        1.7,
        {
          y: window.innerHeight * 0.85,
        },
        {
          delay: delay + 0.7,
          y: 0,
          ease: 'Power4.easeOut',
        },
      );
    } else {
      this._translationShow = 800;
      TweenLite.set(this.el, { y: 0 });
      TweenLite.to(
        this,
        2.2,
        {
          delay,
          _translationShow: 0,
          ease: 'Power4.easeOut',
        },
      );
    }
  }

  hide({ delay = 0, transitionFromTop = false } = {}) {
    TweenLite.killTweensOf(this.el);
    TweenLite.killTweensOf(this);

    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].hide({ delay });
    }

    if (transitionFromTop) {
      TweenLite.to(
        this.el,
        1,
        {
          delay,
          y: window.innerHeight * 0.85,
          ease: 'Power2.easeIn',
          onComplete: () => {
            this.needsUpdate = false;
            this.el.style.display = 'none';
          },
        },
      );
    } else {
      TweenLite.to(
        this,
        0.8,
        {
          _translationShow: '+=400',
          ease: 'Power4.easeIn',
          onComplete: () => {
            this.needsUpdate = false;
            this._translationShow = 0;
            this.el.style.display = 'none';
          },
        },
      );
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
  _onTouchstart(event) {
    this._clicked = true;

    this._mouse.x = event.touches[0].clientX;
    this._mouse.y = event.touches[0].clientY;
  }

  @autobind
  _onMousemove(event) {
    if (this._clicked) {

      this._delta = ( event.clientX - this._mouse.x ) * 2;
      Signals.onEverydayDrag.dispatch(this._delta);

      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;

      clearTimeout(this._timeout);

      this._timeout = setTimeout( () => {
        this._delta = 0;
      }, 50);
    }
  }

  @autobind
  _onTouchmove(event) {
    if (this._clicked) {

      Signals.onCursorSlide.dispatch();

      this._delta = ( event.touches[0].clientX - this._mouse.x ) * 2;
      Signals.onEverydayDrag.dispatch(this._delta);

      this._mouse.x = event.touches[0].clientX;
      this._mouse.y = event.touches[0].clientY;

      clearTimeout(this._timeout);

      this._timeout = setTimeout( () => {
        this._delta = 0;
      }, 50);
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
  _onKeydownLeft() {
    this._deltaKeyboard = Math.max( this._deltaKeyboard -25, -25 );
  }

  @autobind
  _onKeydownRight() {
    this._deltaKeyboard = Math.min( this._deltaKeyboard + 25, 25 );
  }

  @autobind
  _onKeyup() {
    this._deltaKeyboard = 0;
  }

  @autobind
  _onTouchend() {
    this._clicked = false;
    this._delta = 0;

    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].deactivate();
    }
  }

  @autobind
  _onEverydayMousedown(index) {
    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].activate(index);
    }
  }

  @autobind
  _onScrollWheel(event) {
    this._delta = Math.min( 50, Math.max( -50, event.deltaY ) );

    clearTimeout(this._scrollWheelTimeout);

    this._scrollWheelTimeout = setTimeout( () => {
      this._delta = 0;
    }, 50);
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
    if (this.needsUpdate) {
      const delta = this._delta + this._deltaKeyboard;

      for (let i = 0; i < this._everydayItems.length; i++) {
        this._everydayItems[i].update(delta, this._translationShow);
      }
    }
  }
}
