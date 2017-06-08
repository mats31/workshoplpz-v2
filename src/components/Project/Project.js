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

      for (var i = 0; i < projects.projectList.length; i++) {

        if ( projects.projectList[i].id === this.$route.params.id ) {

          this.populateProject( projects.projectList[i] );
          this.show();

          return;
        } else {

          this.$router.push({ name: 'home' });
        }
      }
    },

    populateProject( currentProject ) {

      this.$refs.projectName.innerHTML = currentProject.title;
      this.$refs.clientName.innerHTML = currentProject.client;
      this.$refs.projectDescription.innerHTML = currentProject.description;
      this.$refs.projectStatut.innerHTML = currentProject.statut;
      this.$refs.projectReward.innerHTML = currentProject.reward;
      this.$refs.projectChapterText.innerHTML = currentProject.chapters[0];
    },

    show() {

      this.$refs.container.style.display = 'block';
    },

    /* Events */

    onAssetLoaded(percent) {

    },

    onAssetsLoaded() {

    },
  },

  components: {},
});
