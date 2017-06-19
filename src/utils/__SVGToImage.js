import base64js from 'base64-js';

export default function (svg, callback) {

  let nbImgsLoaded = 0;
  const imgs = svg.querySelectorAll('img');

  function createFinalImage() {
    const serializedXML = new window.XMLSerializer().serializeToString(svg);
    const base64encodedSVG = base64js.fromByteArray(
      new window.TextEncoder().encode(serializedXML),
    );

    const img = document.createElement('img');

    img.onload = () => {
      callback(img, null);

      document.body.appendChild(img);
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
  };

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

  function checkImages() {

    for (let i = 0; i < imgs.length; i++) {

      const canvas = document.createElement('canvas');
      canvas.width = imgs[i].naturalWidth;
      canvas.height = imgs[i].naturalHeight;

      const context = canvas.getContext('2d');
      context.drawImage(imgs[i], 0, 0);

      const previousSrc = imgs[i].src;
      imgs[i].src = canvas.toDataURL();

      waitForLoad(imgs[i], previousSrc, i);
    }
  }

  if (imgs.length > 0) {
    checkImages();
  } else {
    createFinalImage();
  }
}
