import LoaderComponent from 'components/Loader/Loader';

import template from './application.html';

export default Vue.extend({

  template,

  emitterEvents: [],

  data() {

    return {};
  },

  created() {},

  mounted() {

    this.setupEvent();
  },

  ready() {},

  methods: {

    setupEvent() {

      window.addEventListener('resize', this.onResize.bind(this));

      Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    },

    // Events

    onAssetsLoaded() {

      Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
    },

    onResize() {

      Signals.onResize.dispatch( window.innerWidth, window.innerHeight );
    },
  },

  components: {
    'loader-component': LoaderComponent,
  },
});
