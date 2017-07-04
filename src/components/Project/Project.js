import States from 'core/States';
import './project.styl';

import projects from 'config/projects';

import template from './project.html';

export default Vue.extend({

  template,

  data() {

    return {};
  },

  created() {

    this.currentColor = 'rgb(0, 0, 0)';
    this.projectID = null;

    Signals.onAssetLoaded.add(this.onAssetLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  },

  mounted() {},

  methods: {

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

      this.projectID = currentProject.id;
      this.currentColor = currentProject.color;

      this.$refs.projectName.innerHTML = currentProject.title;
      this.$refs.clientName.innerHTML = currentProject.client;
      this.$refs.projectDescription.innerHTML = currentProject.description;
      this.$refs.projectStatut.innerHTML = currentProject.statut;
      this.$refs.projectReward.innerHTML = currentProject.reward;
      this.$refs.projectChapterText.innerHTML = currentProject.chapters[0];
    },

    waitForShow() {

      TweenLite.delayedCall( 1.2, this.show.bind(this) );
    },

    show() {

      const previewID = `${this.projectID}-preview`;

      this.$refs.container.style.display = 'block';
      this.$refs.projectPreview.style.backgroundImage = `url(${States.resources.getImage(previewID).media.src})`;

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
          y: '-50%',
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

      // this.$refs.projectTitleContainer.style.background = this.currentColor;
    },

    /* Events */

    onAssetLoaded(percent) {},

    onAssetsLoaded() {

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
