import Signal from 'min-signal';

class Signals {

  constructor() {

    this.onAssetLoaded = new Signal();
    this.onAssetsLoaded = new Signal();
    this.onWeblGLMousemove = new Signal();
    this.onWeblGLMouseleave = new Signal();
  }
}

window.Signals = new Signals();

export default window.Signals;
