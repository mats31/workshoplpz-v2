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

    this.checkRoute(this.$route.name);
    this.setupEvent();
  },

  ready() {},

  watch: {

    $route: function(to, from) {

      this.checkRoute(to.name);
    },

  },

  methods: {

    setupEvent() {

      window.addEventListener('resize', this.onResize.bind(this));

      Signals.onAssetsLoaded.add(this.onAssetsLoaded);
    },

    // State -------------------------------------------------------------------

    checkRoute(name) {

      switch (name) {
        case 'projects':
          document.body.style.overflow = 'hidden';
          break;
        case 'project':
          document.body.style.overflow = 'visible';
          break;
        default:
          document.body.style.overflow = 'hidden';
      }
    },

    // Events ------------------------------------------------------------------

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
