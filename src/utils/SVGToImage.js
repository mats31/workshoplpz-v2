import base64js from 'base64-js';

/* eslint no-param-reassign: 0 */

export default function (options) {

  // Init ----------------------------------------------------------------------

  let nbImgsLoaded = 0;
  const selector = options.selector;
  const callback = options.callback;
  let imgs = null;
  let svg = null;

  setup();

  function setup() {

    const fontDefinitions = getFonts();
    // const ie = window.navigator.userAgent.indexOf('MSIE') > 0;
    // const ie10 = window.navigator.userAgent.indexOf('Trident/') > 0;
    // const edge = window.navigator.userAgent.indexOf('Edge/') > 0;
    // const safari = /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent);

    // let prefix = '.fo';
    // if (safari || ie || ie10 || edge) {
    //   prefix = '.noFo';
    // }

    svg = document.querySelector(selector);
    let inlineFontDefinitions = '';

    if (svg.dataset.fonts) {

      const fonts = svg.dataset.fonts.split(',');

      for (let i = 0; i < fonts.length; i++) {

        inlineFontDefinitions += `<style>@font-face{font-family:${fonts[i]};src:${fontDefinitions[fonts[i]]}}</style>`;
      }
    }

    const tempEl = document.createElement('div');
    tempEl.innerHTML = inlineFontDefinitions;

    for (let i = 0; i < tempEl.children.length; i++) {
      svg.appendChild(tempEl.children[i]);
    }

    imgs = svg.querySelectorAll('img');

    start();
  }

  // State ---------------------------------------------------------------------

  function getFonts(obj) {
    const o = obj || {};
    const sheet = document.styleSheets;
    let rule = null;
    let i = sheet.length;
    let j;
    while ( --i >= 0 ) {
      rule = sheet[i].rules || sheet[i].cssRules || [];
      j = rule.length;
      while (--j >= 0) {
        if (rule[j].constructor.name === 'CSSFontFaceRule') {
          // rule[j].slice(0, 10).toLowerCase() === '@font-face'
          o[rule[j].style.fontFamily] = rule[j].style.src;
        }
      }
    }
    return o;
  }

  function start() {
    if (imgs.length > 0) {
      checkImages();
    } else {
      createFinalImage();
    }
  }

  function checkImages() {
    for (let i = 0; i < imgs.length; i++) {

      const canvas = document.createElement('canvas');
      canvas.width = imgs[i].naturalWidth;
      canvas.height = imgs[i].naturalHeight;

      const context = canvas.getContext('2d');
      context.drawImage(imgs[i], 0, 0);

      const previousSrc = imgs[i].src;
      imgs[i].src = canvas.toDataURL();

      this.waitForLoad(imgs[i], previousSrc, i);
    }
  }

  function waitForLoad(targetImg, previousSrc, index) {
    if (targetImg.complete) {
      console.log('complete');
      replaceImg(index, targetImg, null);
      targetImg.onload = null;
      targetImg.onerror = null;
    }

    targetImg.onload = () => {
      console.log('onload');
      replaceImg(index, targetImg, null);
      targetImg.onload = null;
      targetImg.onerror = null;
    };

    targetImg.onerror = () => {
      console.log('onerror');
      replaceImg(
          index,
          null,
          'An error happens when svgToImage try to replace images from svg.',
      );
      targetImg.onload = null;
      targetImg.onerror = null;
    };
  }

  function replaceImg(index, img, error) {
    nbImgsLoaded++;

    if (error) {
      console.error(error);
      return;
    }

    imgs[index].src = img.src;

    if (nbImgsLoaded === imgs.length) {
      createFinalImage();
    }
  }

  function createFinalImage() {
    const serializedXML = new window.XMLSerializer().serializeToString(svg);
    const base64encodedSVG = base64js.fromByteArray(
      new window.TextEncoder().encode(serializedXML),
    );

    const img = document.createElement('img');

    img.onload = () => {
      callback(img, null);

      document.body.appendChild(img);
      document.body.appendChild(svg);
    };

    img.onerror = () => {
      callback(null, 'Error when loading image from svg to image.');
    };

    // img.src = "data:image/png;base64," + base64encodedSVG;
    // img.src = "data:image/svg+xml;base64," + base64encodedSVG;

    // if ($(svg).find("image")[0]) {
    //     img.src = $(svg).find("image")[0].href.baseVal;
    // } else {
    //     img.src = "data:image/svg+xml;base64," + base64encodedSVG;
    // }

    img.src = `data:image/svg+xml;base64,${base64encodedSVG}`;
  }
}
