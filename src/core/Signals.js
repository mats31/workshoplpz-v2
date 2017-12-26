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
  }
}

window.Signals = new Signals();

export default window.Signals;
