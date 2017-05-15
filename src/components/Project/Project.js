import './project.styl';

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

    this.show();
  },

  methods: {

    setPercentLoading(value) {

    },

    // State -------------------------------------------------------------------

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
