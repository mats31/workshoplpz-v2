import { createCanvas, resizeCanvas } from 'utils/canvas';
import { getRandomColor } from 'utils/color';
import { active } from 'core/decorators';
import triangulate from 'delaunay-triangulate';

@active()
export default class MediaItem {
  constructor(options) {

    this._el = options.el;
    this._media = options.media;
    this._type = options.type;
    this._points = [];
    this._triangles = [];
    this._nbPoints = 70;

    console.log(this._media);

    this._ctx = createCanvas(this._el.offsetWidth, this._el.offsetHeight, true, 2);
    this._el.appendChild(this._ctx.canvas);

    this._setupTriangles();

    setTimeout(()=>{
      this.activate();
      console.log('activate');
    }, 4000);
  }

  _setupTriangles() {

    this._points = [];
    for (let i = 0; i < this._nbPoints; i++) {
      this._points.push([
        Math.random(),
        Math.random(),
      ]);
    }

    this._triangles = triangulate(this._points);
  }

  // State ---------------------------------------------------------------------

  activate() {
    for (let i = 0; i < this._triangles.length; i++) {
      const target = [
        this._triangles[i][0],
        this._triangles[i][1],
        this._triangles[i][2],
        0,
      ];

      target.ease = 'Power4.easeOut';
      target.delay = i * 0.01 * Math.random();

      TweenLite.to(
        this._triangles[i],
        1.5,
        target,
      );
    }
  }

  deactivate() {}

  resize() {

    this._width = this._el.offsetWidth;

    let height = 400;

    if (this._type === 'image') {
      height = this._width * this._media.naturalHeight / this._media.naturalWidth;
    } else {
      // height = this._width * this._media.videoHeight / this._media.videoWidth;
      height = 427;
    }

    this._height = height;

    this._triangleW = this._width * 1.5;
    this._triangleH = this._height * 1.5;

    this._points = [];
    for (let i = 0; i < this._nbPoints; i++) {
      this._points.push([
        Math.random() * this._triangleW - this._width * 0.25,
        Math.random() * this._triangleH - this._height * 0.25,
      ]);
    }

    this._triangles = triangulate(this._points);
    for (let i = 0; i < this._triangles.length; i++) {
      this._triangles[i][3] = 1;
    }

    resizeCanvas(this._ctx, this._width, this._height, true, 2);

    this._ctx.clearRect( 0, 0, this._width, this._height );
    this._drawMask();
  }

  update() {
    this._ctx.clearRect( 0, 0, this._width, this._height );
    this._drawMask();
    this._drawMedia();
  }

  _drawMask() {
    this._ctx.globalCompositeOperation = 'source-over';
    // this._ctx.beginPath();
    for ( let i = 0; i < this._triangles.length; ++i ) {
      const triangle = this._triangles[i];

      this._ctx.beginPath();
      this._ctx.moveTo( this._points[triangle[0]][0], this._points[triangle[0]][1] + triangle[3] * this._triangleH);
      for ( let j = 1; j < triangle.length - 1; ++j) {
        this._ctx.lineTo(this._points[triangle[j]][0], this._points[triangle[j]][1] + triangle[3] * this._triangleH);
      }
      this._ctx.fill();
      this._ctx.closePath();
    }
    // for (let i = 0; i < this._triangles.length; i += 3) {
    //
    //   if (this._triangles[i + 1] && this._triangles[i + 2]) {
    //     // const color = getRandomColor('rgb');
    //     // this._ctx.strokeStyle = `rgb(${color.rgb[0]},${color.rgb[1]},${color.rgb[2]})`;
    //     this._ctx.moveTo(this._triangles[i][0] * this._width, this._triangles[i][1] * this._height);
    //     this._ctx.lineTo(this._triangles[i + 1][0] * this._width, this._triangles[i + 1][1] * this._height);
    //     this._ctx.lineTo(this._triangles[i + 2][0] * this._width, this._triangles[i + 2][1] * this._height);
    //
    //     this._ctx.stroke();
    //
    //
    //     context.moveTo(this._points[this._triangles[0]][0], this._points[this._triangles[0]][1])
    //   }
    // }

    // this._ctx.closePath();
  }

  _drawMedia() {
    this._ctx.globalCompositeOperation = 'source-in';
    this._ctx.beginPath();
    this._ctx.drawImage( this._media, 0, 0, this._width, this._height );
    this._ctx.closePath();
  }

}
