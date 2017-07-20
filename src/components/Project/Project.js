import States from 'core/States';
import './project.styl';

import raf from 'raf';
import Preview from './objects/Preview/Preview';
import projects from 'config/projects';
import template from './project.html';

export default Vue.extend({

  template,

  data() {

    return {};
  },

  created() {

    this.assetsLoaded = true;
    this.currentProject = null;
    this.width = null;
    this.height = null;
    this.webGLState = false;
    this.render = false;
    this.previews = [];

    this.setupWebGL();

    Signals.onAssetLoaded.add(this.onAssetLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  },

  mounted() {

    if (this.assetsLoaded) {

      this.checkRoute();
    }
  },

  methods: {

    setupWebGL() {

      this.section = 0.890625;
      this.heightPicture = 620;
      this.margin = 130;
      this.width = window.innerWidth * this.section;
    },

    setPercentLoading(value) {

    },

    // State -------------------------------------------------------------------

    checkRoute() {

      for (let i = 0; i < projects.projectList.length; i++) {

        if ( projects.projectList[i].id === this.$route.params.id ) {

          this.currentProject = projects.projectList[i];

          this.populateProject( projects.projectList[i] );
          this.waitForShow();

          return true;
        }
      }

      this.$router.push({ name: 'home' });

      return false;
    },

    populateProject( currentProject ) {

      this.currentProject = currentProject;
      this.currentColor = currentProject.color;

      this.$refs.projectName.innerHTML = currentProject.title;
      this.$refs.projectHeaderTitle.innerHTML = currentProject.title;
      this.$refs.projectHeaderReward.innerHTML = currentProject.reward;
      this.$refs.dateYear.innerHTML = currentProject.date;
      this.$refs.projectDescription.innerHTML = currentProject.description;
      this.$refs.projectTeam.innerHTML = currentProject.team;
      this.$refs.projectRole.innerHTML = currentProject.role;
    },

    waitForShow() {

      TweenLite.delayedCall( 1.2, this.show.bind(this) );
    },

    show() {

      const previewID = `${this.currentProject.id}-preview`;

      this.$refs.container.style.display = 'block';
      // this.$refs.projectPreview.style.backgroundImage = `url(${States.resources.getImage(previewID).media.src})`;
      this.$refs.projectPreview.appendChild(States.resources.getImage(previewID).media);

      if (this.currentProject.pictures.length > 0 && !this.webGLState) {

        this.settingWebGLPreview();
        this.webGLState = true;
      }

      // for (let i = 0; i < this.currentProject.pictures.length; i++) {
      //
      //   const pictureContainer = document.createElement('div');
      //   const img = States.resources.getImage(this.currentProject.pictures[i]).media;
      //
      //   pictureContainer.appendChild(img);
      //   this.$refs.projectSecondContainer.appendChild(pictureContainer);
      // }

      TweenLite.fromTo(
        this.$refs.projectPreview,
        0.5,
        {
          autoAlpha: 0,
          scaleY: 0.8,
          y: '-30%',
        },
        {
          autoAlpha: 1,
          scaleY: 1,
          y: '0%',
          ease: 'Power4.easeOt',
        },
      );

      TweenLite.to(
        this.$refs.projectName,
        0.6,
        {
          autoAlpha: 1,
          ease: 'Power2.easeOt',
        },
      );

      this.render = true;
      this.update();

      // this.$refs.projectTitleContainer.style.background = this.currentColor;
    },

    settingWebGLPreview() {

      const length = this.currentProject.pictures.length;
      const texture = States.resources.getTexture(this.currentProject.pictures[0]).media;

      this.ratio = texture.image.naturalHeight / texture.image.naturalWidth;
      this.width = window.innerWidth * 0.890625;
      // this.width = window.innerWidth;
      this.heightPicture = this.width * this.ratio;
      this.height = this.heightPicture * length + this.margin * length;
      // this.height = window.innerHeight;

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 10000 );
      this.camera.position.z = 50;
      this.renderer = new THREE.WebGLRenderer({});
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0x191919, 1);
      this.clock = new THREE.Clock();

      for (let i = 0; i < length; i++) {

        const preview = new Preview({
          texture: States.resources.getTexture(this.currentProject.pictures[i]).media,
          width: this.width,
          height: this.heightPicture,
          fullHeight: this.height,
          length,
          margin: this.margin,
          index: i,
          camera: this.camera,
          ratio: this.ratio,
          parent: this.$refs.projectSecondContainer,
        });

        this.scene.add(preview);
        this.previews.push(preview);
      }

      this.$refs.projectSecondContainer.appendChild(this.renderer.domElement);
    },

    // Update ------------------------------------------------------------------

    update() {

      raf(this.update);

      if (this.render) {

        const time = this.clock.getElapsedTime();

        for (let i = 0; i < this.previews.length; i++) {

          this.previews[i].update( time );
        }

        this.renderer.render( this.scene, this.camera );
      }
    },

    // Events ------------------------------------------------------------------

    onAssetLoaded(percent) {},

    onAssetsLoaded() {

      this.assetsLoaded = true;

      this.checkRoute();
    },
  },

  watch: {

    $route: function(to, from) {

      this.checkRoute(to.name);
    },

  },

  components: {},
});
