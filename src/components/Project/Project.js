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

    Signals.onAssetLoaded.add(this.onAssetLoaded);
    Signals.onAssetsLoaded.add(this.onAssetsLoaded);
  },

  mounted() {

    this.checkRoute();
  },

  methods: {

    setPercentLoading(value) {

    },

    // State -------------------------------------------------------------------

    checkRoute() {

      for (let i = 0; i < projects.projectList.length; i++) {

        if ( projects.projectList[i].id === this.$route.params.id ) {

          this.currentProject = projects.projectList[i];

          this.populateProject( projects.projectList[i] );
          this.show();

          return true;
        }
      }

      this.$router.push({ name: 'home' });

      return false;
    },

    populateProject( currentProject ) {

      // const previewID = `${currentProject.id}-preview`;
      // this.$refs.projectPreview.style.backgroundImage = `url(images/${States.resources.getImage(previewID).media})`;

      this.$refs.projectTitleContainer.style.background = currentProject.color;
      this.$refs.projectName.innerHTML = currentProject.title;
      this.$refs.clientName.innerHTML = currentProject.client;
      this.$refs.projectDescription.innerHTML = currentProject.description;
      this.$refs.projectStatut.innerHTML = currentProject.statut;
      this.$refs.projectReward.innerHTML = currentProject.reward;
      this.$refs.projectChapterText.innerHTML = currentProject.chapters[0];
    },

    show() {

      TweenLite.delayedCall(
        1.5,
        () => {
          this.$refs.container.style.display = 'block';
        },
      );
    },

    /* Events */

    onAssetLoaded(percent) {

    },

    onAssetsLoaded() {

    },
  },

  watch: {

    $route: function(to, from) {

      this.checkRoute(to.name);
    },

  },

  components: {},
});
