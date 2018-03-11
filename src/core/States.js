import MobileDetect from 'mobile-detect';

class States {

  constructor() {

    this.md = new MobileDetect(window.navigator.userAgent);
    window.md = this.md;

    this.VERSION = this.md.version();
    this.MOBILE = this.md.phone();
    this.TABLET = this.md.tablet();
    this.IOS = this.md.is('iOS');
    this.ANDROID = this.md.is('AndroidOS');
    this.IS_IE = window.navigator.userAgent.indexOf('MSIE ') > 0 || !!window.navigator.userAgent.match(/Trident.*rv\:11\./);
    this.IS_LTE_IE_10 = ( Function('/*@cc_on return document.documentMode===10@*/')() ) !== undefined;
    this.IS_SAFARI = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    this.IS_CHROME = /Chrome/i.test(window.navigator.userAgent);
    this.IS_FF = window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    this.resources = {
      images: [],
      textures: [],
      videos: [],
      models: [],
      getImage(id) {
        return this.images.find( image => image.id === id );
      },
      getTexture(id) {
        return this.textures.find( texture => texture.id === id );
      },
      getVideo(id) {
        return this.videos.find( video => video.id === id );
      },
      getModel(id) {
        return this.models.find( model => model.id === id );
      },
    };

    this.application = {
      projectActived: false,
    };
  }
}

export default new States();
