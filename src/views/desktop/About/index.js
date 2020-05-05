import createDOM from 'utils/dom/createDOM';
import { autobind } from 'core-decorators';
import { visible } from 'core/decorators';
import template from './about.tpl.html';
import './about.scss';


@visible()
export default class AboutView {

  constructor(options) {
    this.el = options.parent.appendChild(
      createDOM(template()),
    );

    this._ui = {
      title: this.el.querySelector('.js-about__title'),
      mail: this.el.querySelector('.js-about__mail'),
      twitter: this.el.querySelector('.js-about__twitter'),
      instagram: this.el.querySelector('.js-about__instagram'),
      behance: this.el.querySelector('.js-about__behance'),
      shop: this.el.querySelector('.js-about__shop'),
      patreon: this.el.querySelector('.js-about__patreon'),
      mathis: this.el.querySelector('.js-about__mathis'),
      firstLines: this.el.querySelectorAll('.js-about__lines .js-about__line:first-child'),
      secondLines: this.el.querySelectorAll('.js-about__lines .js-about__line:last-child'),
    };
  }

  _setupEvents() {
    this._ui.mail.addEventListener('mouseenter', this._onMailMouseenter);
    this._ui.twitter.addEventListener('mouseenter', this._onTwitterMouseenter);
    this._ui.instagram.addEventListener('mouseenter', this._onInstagramMouseenter);
    this._ui.behance.addEventListener('mouseenter', this._onBehanceMouseenter);
    this._ui.shop.addEventListener('mouseenter', this._onShopMouseenter);
    this._ui.patreon.addEventListener('mouseenter', this._onPatreonMouseenter);
  }

  _removeEvents() {
    this._ui.mail.removeEventListener('mouseenter', this._onMailMouseenter);
    this._ui.twitter.removeEventListener('mouseenter', this._onTwitterMouseenter);
    this._ui.instagram.removeEventListener('mouseenter', this._onInstagramMouseenter);
    this._ui.behance.removeEventListener('mouseenter', this._onBehanceMouseenter);
    this._ui.shop.removeEventListener('mouseenter', this._onShopMouseenter);
    this._ui.patreon.removeEventListener('mouseenter', this._onPatreonMouseenter);
  }

  // State ---------------------------------------------------------------------

  show({ delay = 0 } = {}) {
    this._setupEvents();
    this.el.style.display = 'block';

    TweenLite.killTweensOf([this._ui.title, this._ui.mail, this._ui.twitter, this._ui.instagram, this._ui.behance, this._ui.shop, this._ui.mathis, this._ui.firstLines, this._ui.secondLines]);

    TweenLite.fromTo(
      this._ui.title,
      1,
      {
        scaleY: 1.2,
      },
      {
        delay,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.mail,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.twitter,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.instagram,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.behance,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.shop,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.patreon,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.fromTo(
      this._ui.mathis,
      1,
      {
        y: 10,
        scaleY: 1.5,
      },
      {
        delay: delay + 0.25,
        y: 0,
        scaleY: 1,
        opacity: 1,
        ease: 'Power4.easeOut',
      },
    );

    TweenMax.staggerFromTo(
      this._ui.firstLines,
      1,
      {
        scaleX: 0,
      },
      {
        delay: delay + 0.1,
        scaleX: 1,
        ease: 'Power4.easeOut',
      },
      0.11,
    );

    TweenLite.set(
      this._ui.secondLines,
      {
        scaleX: 0,
      },
    );
  }

  hide({ delay = 0 } = {}) {
    this._removeEvents();

    TweenLite.killTweensOf([this._ui.title, this._ui.mail, this._ui.twitter, this._ui.instagram, this._ui.behance, this._ui.mathis, this._ui.firstLines, this._ui.secondLines]);
    TweenLite.to(
      this._ui.title,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.mail,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.twitter,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.instagram,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.behance,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.shop,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.patreon,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.mathis,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenMax.to(
      this._ui.firstLines,
      1,
      {
        delay,
        scaleX: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenMax.to(
      this._ui.secondLines,
      1,
      {
        delay,
        scaleX: 0,
        ease: 'Power4.easeOut',
        onComplete: () => {
          this.el.style.display = 'none';
        },
      },
    );
  }

  _hover(line) {
    const firstLine = line.querySelector('.js-about__line:first-child');
    const secondLine = line.querySelector('.js-about__line:last-child');

    TweenLite.killTweensOf(firstLine);
    TweenLite.set(firstLine, { transformOrigin: 'right center' });
    TweenLite.fromTo(
      firstLine,
      0.5,
      {
        scaleX: 1,
      },
      {
        scaleX: 0,
        ease: 'Power4.easeOut',
      },
    );

    const delay = 0.15;

    TweenLite.killTweensOf(secondLine);
    TweenLite.set(secondLine, { transformOrigin: 'left center' });
    TweenLite.fromTo(
      secondLine,
      0.5,
      {
        scaleX: 0,
      },
      {
        delay,
        scaleX: 1,
        ease: 'Power4.easeOut',
        onComplete: () => {
          TweenLite.set(
            firstLine,
            {
              scaleX: 1,
              transformOrigin: 'left center',
            },
          );
          TweenLite.set(
            secondLine,
            {
              scaleX: 0,
              transformOrigin: 'left center',
            },
          );
        },
      },
    );
  }

  // Events --------------------------------------------------------------------

  @autobind
  _onMailMouseenter() {
    const line = this._ui.mail.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }

  @autobind
  _onTwitterMouseenter() {
    const line = this._ui.twitter.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }

  @autobind
  _onInstagramMouseenter() {
    const line = this._ui.instagram.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }

  @autobind
  _onBehanceMouseenter() {
    const line = this._ui.behance.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }

  @autobind
  _onShopMouseenter() {
    const line = this._ui.shop.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }

  @autobind
  _onPatreonMouseenter() {
    const line = this._ui.patreon.parentNode.querySelector('.js-about__lines');
    this._hover(line);
  }
}
