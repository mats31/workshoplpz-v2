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
    this._translationShow = 0;

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
    this.el.addEventListener('mousedown', this._onMousedown);
    this.el.addEventListener('mousemove', this._onMousemove);
    this.el.addEventListener('mouseup', this._onMouseup);
    document.addEventListener('mouseleave', this._onMouseup);

    Signals.onResize.add(this._onResize);
    Signals.onEverydayMousedown.add(this._onEverydayMousedown);
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
  _onMousemove(event) {
    if (this._clicked) {

      this._delta = ( event.clientX - this._mouse.x ) * 2;

      this._mouse.x = event.clientX;
      this._mouse.y = event.clientY;

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
  _onEverydayMousedown(index) {
    for (let i = 0; i < this._everydayItems.length; i++) {
      this._everydayItems[i].activate(index);
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
    if (this.needsUpdate) {
      for (let i = 0; i < this._everydayItems.length; i++) {
        this._everydayItems[i].update(this._delta, this._translationShow);
      }
    }
  }
}
