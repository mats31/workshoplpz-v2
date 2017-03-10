import Signal from 'min-signal';

class Signals {

  constructor() {

    // Assets
    this.onAssetLoaded = new Signal();
    this.onAssetsLoaded = new Signal();

    // Webgl
    this.onWeblGLMousemove = new Signal();
    this.onWeblGLMouseleave = new Signal();
    this.onProjectClick = new Signal();
  }
}

window.Signals = new Signals();

export default window.Signals;
