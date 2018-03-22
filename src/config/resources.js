const ressources = {

  images: [
    { id: 'twitter', url: 'images/twitter.png', description: 'Twitter' },
    { id: 'orange-preview', url: 'images/retrograph-preview.png', description: 'Orange preview' },
    { id: 'constellation-preview', url: 'images/retrograph-preview.png', description: 'Orange preview' },
    { id: 'fuse-preview', url: 'images/retrograph-preview.png', description: 'Orange preview' },
    { id: 'orange-0', url: 'images/orange-0.png', description: 'First orange picture' },
    { id: 'picture-skyfall-0', url: 'images/picture-skyfall-0.png', description: 'First orange picture' },
    { id: 'picture-skyfall-1', url: 'images/picture-skyfall-1.png', description: 'First orange picture' },
    { id: 'picture-skyfall-2', url: 'images/picture-skyfall-2.png', description: 'First orange picture' },
    { id: 'picture-skyfall-3', url: 'images/picture-skyfall-3.png', description: 'First orange picture' },
    { id: 'daphne-preview', url: 'images/daphne/preview.png', description: '' },
    { id: 'daphne-media-0', url: 'images/daphne/media-0.jpg', description: '' },
    { id: 'daphne-media-2', url: 'images/daphne/media-2.jpg', description: '' },
    { id: 'daphne-media-3', url: 'images/daphne/media-3.jpg', description: '' },
    { id: 'daphne-media-4', url: 'images/daphne/media-4.jpg', description: '' },
    { id: 'parcea-preview', url: 'images/parcea/preview.png', description: '' },
    { id: 'parcea-media-0', url: 'images/parcea/media-0.jpg', description: '' },
    { id: 'parcea-media-1', url: 'images/parcea/media-1.jpg', description: '' },
    { id: 'parcea-media-2', url: 'images/parcea/media-2.jpg', description: '' },
    { id: 'parcea-media-3', url: 'images/parcea/media-3.jpg', description: '' },
    { id: 'parcea-media-4', url: 'images/parcea/media-4.jpg', description: '' },
    { id: 'parcea-media-5', url: 'images/parcea/media-5.jpg', description: '' },
    { id: 'orange-media-0', url: 'images/orange/media-0.jpg', description: '' },
    { id: 'everyday-01', url: 'images/everyday-01.jpg', description: '' },
    { id: 'everyday-02', url: 'images/everyday-02.jpg', description: '' },
    { id: 'everyday-03', url: 'images/everyday-03.jpg', description: '' },
    { id: 'everyday-04', url: 'images/everyday-04.jpg', description: '' },
    { id: 'test', url: 'images/test.png', description: 'test' },
  ],

  videos: [
    // { id: 'video', url: 'videos/video.mp4' },
  ],

  sounds: [
    { id: 'whoosh1', url: 'audio/whoosh.mp3', analyser: false },
    { id: 'whoosh2', url: 'audio/whoosh.wav', analyser: false },
  ],

  textures: [
    { id: 'uv', url: 'textures/uv.jpg', description: '' },
    { id: 'daphne-preview', url: 'textures/daphne-preview.jpg', description: '' },
    { id: 'parcea-preview', url: 'textures/parcea-preview.jpg', description: '' },
    { id: 'orange-preview', url: 'textures/orange-preview.jpg', description: '' },
    { id: 'fuse-preview', url: 'textures/fuse-preview.jpg', description: '' },
    { id: 'project-preview', url: 'textures/project-preview.jpg', description: '' },
    { id: 'project-preview-noise', url: 'textures/project-preview-noise.jpg', description: '' },
    { id: 'project-preview-circle', url: 'textures/project-preview-circle.png', description: '' },
    { id: 'project-preview-voronoi', url: 'textures/project-preview-voronoi2.png', description: '' },
    { id: 'background', url: 'textures/background.png', description: '' },
    { id: 'grain', url: 'textures/grain-2.png', description: '' },
    { id: 'preview-wind', url: 'textures/preview-wind.png', description: '' },
    { id: 'preview-mask', url: 'textures/preview-mask.png', description: '' },
    { id: 'orange-text', url: 'textures/orange-text.png', description: '' },
    { id: 'daphne-text', url: 'textures/daphne-text.png', description: '' },
    { id: 'constellation-text', url: 'textures/constellation-text.png', description: '' },
    { id: 'fuse-text', url: 'textures/fuse-text.png', description: '' },
    { id: 'parcea-text', url: 'textures/parcea-text.png', description: '' },
    { id: 'picture-skyfall-0', url: 'textures/picture-skyfall-0.png', description: 'First orange picture' },
    { id: 'picture-skyfall-1', url: 'textures/picture-skyfall-1.png', description: 'First orange picture' },
    { id: 'picture-skyfall-2', url: 'textures/picture-skyfall-2.png', description: 'First orange picture' },
    { id: 'picture-skyfall-3', url: 'textures/picture-skyfall-3.png', description: 'First orange picture' },
    { id: 'map', url: 'textures/map.jpg', description: 'First orange picture' },
  ],

  models: [
    { id: 'forme1-start', url: 'models/forme1-start-test.obj' },
    { id: 'forme1-final', url: 'models/forme1-final.obj' },
    { id: 'daphne', url: 'models/daphne.obj' },
    { id: 'constellation', url: 'models/forme1-accessory.obj' },
    { id: 'orange', url: 'models/orange.obj' },
    { id: 'parcea', url: 'models/parcea.obj' },
    { id: 'fuse', url: 'models/forme1-accessory.obj' },
  ],

  svgs: [
    { id: 'orange', selector: '.svgs__orange' },
  ],
};

module.exports = ressources;
