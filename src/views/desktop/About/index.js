import createDOM from 'utils/dom/createDOM';
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
      vimeo: this.el.querySelector('.js-about__vimeo'),
      description: this.el.querySelector('.js-about__description'),
      lines: this.el.querySelectorAll('.js-about__line'),
    };
  }

  show({ delay = 0 } = {}) {
    this.el.style.display = 'block';

    TweenLite.killTweensOf([this._ui.title, this._ui.mail, this._ui.twitter, this._ui.instagram, this._ui.vimeo, this._ui.description, this._ui.lines]);

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
      this._ui.vimeo,
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
      this._ui.description,
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
      this._ui.lines,
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
  }

  hide({ delay = 0 } = {}) {

    TweenLite.killTweensOf([this._ui.title, this._ui.mail, this._ui.twitter, this._ui.instagram, this._ui.vimeo, this._ui.description, this._ui.lines]);
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
      this._ui.vimeo,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenLite.to(
      this._ui.description,
      1,
      {
        delay,
        opacity: 0,
        ease: 'Power4.easeOut',
      },
    );

    TweenMax.to(
      this._ui.lines,
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
}
