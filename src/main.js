/* eslint no-unused-vars: "off" */

import 'stylesheets/main.styl';

import domready from 'domready';
import gsap from 'gsap';
import Application from 'containers/Application/Application';
import Router from 'core/Router';
import Signals from 'core/Signals'; /* exported Signals */

import AssetLoader from 'core/AssetLoader';


class Main {

  constructor() {

    this.setup();
  }

  setup() {

    this.router = new Router();
    this.start();
    this.setEvents();
  }

  start() {
    new Application({
      router: this.router,
    }).$mount('#application');
  }

  setEvents() {}
}

domready(() => {

  new Main();
});
