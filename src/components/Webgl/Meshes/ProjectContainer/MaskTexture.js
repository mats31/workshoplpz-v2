class MaskTexture {

  constructor() {

    this.setup();
  }

  setup() {

    this.createCanvas();
    this.initializePoints();
  }

  createCanvas() {

    this.width = 256;
    this.height = 256;
    this.threshold = 180;
    this.colors = { r: 255, g: 255, b: 255 };
    this.cycle = 0;
    this.nbPoints = 10;
    this.points = [];

    this.mainCanvas = document.createElement('canvas');
    this.mainContext = this.mainCanvas.getContext('2d');
    this.tempCanvas = document.createElement('canvas');
    this.tempCtx = this.tempCanvas.getContext('2d');

    this.mainCanvas.width = this.tempCanvas.width = this.width;
    this.mainCanvas.height = this.tempCanvas.height = this.height;

    /* DEBUG */
    // this.tempCanvas.style.position = 'absolute';
    // this.tempCanvas.style.top = 0;
    // this.tempCanvas.style.left = 0;
    // this.tempCanvas.style.zIndex = 100;
    // document.body.appendChild(this.tempCanvas);

    // this.mainCanvas.style.position = 'absolute';
    // this.mainCanvas.style.top = 0;
    // this.mainCanvas.style.left = 0;
    // this.mainCanvas.style.zIndex = 100;
    // document.body.appendChild(this.mainCanvas);
  }

  initializePoints() {

    for ( let i = 0; i < this.nbPoints; i++ ) {

      const x = Math.random() * this.width;
      const y = Math.random() * this.height;

      const vx = Math.random() * 8 - 4;
      const vy = Math.random() * 8 - 4;

      // const size = Math.floor( Math.random() * 8 ) + 80;
      const size = 150;

      this.points.push({ x, y, vx, vy, size });
    }
  }

  getCanvas() {

    return this.mainCanvas;
  }

  /* ****************** RENDER ****************** */

  update() {

    let len = this.points.length;

    this.tempCtx.clearRect( 0, 0, this.width, this.height );

    while (len--) {

      const point = this.points[len];

      point.x += point.vx;
      point.y += point.vy;

      if (point.x > this.width + point.size) { point.x = 0 - point.size; }
      if (point.x < 0 - point.size) { point.x = this.width + point.size; }
      if (point.y > this.height + point.size) { point.y = 0 - point.size; }
      if (point.y < 0 - point.size) { point.y = this.height + point.size; }

      this.tempCtx.beginPath();

      const grad = this.tempCtx.createRadialGradient( point.x, point.y, 1, point.x, point.y, point.size );
      grad.addColorStop(0, `rgba(${this.colors.r}, ${this.colors.g}, ${this.colors.b}, 1)` );
      grad.addColorStop(1, `rgba(${this.colors.r}, ${this.colors.g}, ${this.colors.b}, 0)` );

      this.tempCtx.fillStyle = grad;
      this.tempCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2 );
      this.tempCtx.fill();
    }

    this.metabalize();
  }

  metabalize() {

    const imageData = this.tempCtx.getImageData( 0, 0, this.width, this.height );
    const pixel = imageData.data;

    for ( let i = 0; i < pixel.length; i += 4 ) {

      if ( pixel[ i + 3 ] < this.threshold ) {

        pixel[ i + 3 ] /= 6;

        if ( pixel[ i + 3 ] > this.threshold / 4) { pixel[ i + 3 ] = 0; }
      }
    }

    this.mainContext.putImageData( imageData, 0, 0 );
  }

}

export default MaskTexture;
