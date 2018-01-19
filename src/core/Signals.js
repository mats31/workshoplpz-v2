import Signal from 'min-signal';

class Signals {

  constructor() {

    // Assets
    this.onAssetLoaded = new Signal();
    this.onAssetsLoaded = new Signal();

    // General
    this.onResize = new Signal();
    this.onScroll = new Signal();
    this.onScrollWheel = new Signal();

    // Webgl
    // this.onWeblGLMousemove = new Signal();
    // this.onWeblGLMouseleave = new Signal();
    this.onProjectClick = new Signal();
    this.onProjectAnimationDone = new Signal();
    this.onProjectCloseMouseenter = new Signal();
    this.onProjectCloseMouseout = new Signal();

    // Everydays
    this.onEverydayMousedown = new Signal();
    this.onEverydayMouseenter = new Signal();
    this.onEverydayMouseout = new Signal();

    // Cursor
    this.onCursorSlide = new Signal();
    this.onCursorUnslide = new Signal();
  }
}

window.Signals = new Signals();

export default window.Signals;
