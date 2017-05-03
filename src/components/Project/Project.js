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

  },

  methods: {

    setPercentLoading(value) {

    },

    /* Events */

    onAssetLoaded(percent) {

    },

    onAssetsLoaded() {

    },
  },

  components: {},
});
