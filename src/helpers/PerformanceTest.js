import States from 'core/States';

class PerformanceTest {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('experimental-webgl');

    this.devicePixelRatio = window.devicePixelRatio;
    this.debugRendererInfo = this.context.getExtension('WEBGL_debug_renderer_info');
    this.unmaskedRenderer = this.debugRendererInfo ? this.context.getParameter(this.debugRendererInfo.UNMASKED_RENDERER_WEBGL) : '';
    this.gpu = this.getGPU();
    this.version = this.getOptimalVersionName();
    console.log(this.gpu);
    console.log(this.version);
    console.log(`%c PerformanceTest.version: ${this.version} `, 'background: #45343D; padding:5px; font-size: 11px; color: #ffffff');
  }

  getOptimalVersionName() {
    if (!this.gpu) return 'low';
    // if (States.IS_FF) return 'low';

    switch (this.gpu.type) {
      case 'NVIDIA':

        if (!this.gpu.prefix && !this.gpu.model.match('GTX')) return 'low';
        if (this.gpu.prefix.match('GTX') || this.gpu.model.match('GTX')) return 'ultra';

        return 'high';
      case 'AMD':

        if (States.IS_FF) return 'high';

        if (this.gpu.series === '580') return 'high';

        return 'low';

      case 'Intel':

        if (this.gpu.model === 'Intel Iris Pro') return 'high';

        return 'low';

      default:
        return 'high';
    }
  }

  getGPU() {
    const types = ['Intel', 'NVIDIA', 'AMD', 'Adreno', 'Apple'];
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (this.unmaskedRenderer.indexOf(type) > -1) {
        const data = {
          type,
          model: null,
          series: null,
          generation: null,
          tier: null,
          revision: null,
        };

        console.log(this.unmaskedRenderer);

        data.model = this.unmaskedRenderer.replace(/NVIDIA GeForce |AMD Radeon |Apple | OpenGL Engine/g, '');

        const temp = data.model.split(' ');
        data.series = data.type.match(/NVIDIA|AMD/g) ? temp[temp.length - 1] : data.model;
        data.series = data.series.replace(/\D/g, '');

        data.prefix = temp.length > 1 ? temp[0] : null;
        data.generation = data.series.substring(0, data.series.length - 2);
        data.tier = data.series.slice(-2, -1);
        data.revision = data.series.slice(-1);

        if (data.type === 'Apple') {
          data.generation = data.series;
          data.tier = null;
          data.revision = null;
        }

        return data;
      }
    }

    return false;
  }
}

export default new PerformanceTest();
