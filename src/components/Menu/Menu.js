import template from './menu.html';

import './menu.styl';

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
    this.setupEvents();

    console.log(this);
  },

  // beforeRouteUpdate(to, from, next) {
  //
  //   console.log(to);
  //   console.log(from);
  //   console.log(next);
  //
  //   next();
  //   // react to route changes...
  //   // don't forget to call next()
  // },

  watch: {
    $route() {
      this.checkRoute();
    },
  },

  methods: {

    // State -------------------------------------------------------------------

    checkRoute() {

      if ( this.$route.name === 'projects' ) {

        this.setState( 'projects' );
      }

      if ( this.$route.name === 'everydays' ) {
        this.setState( 'everydays' );
      }
    },

    setState( state ) {

      switch ( state ) {
        case 'about':
          this.$refs.about.classList.add( 'is-active' );
          this.$refs.everydays.classList.remove( 'is-active' );
          this.$refs.projects.classList.remove( 'is-active' );
          break;
        case 'everydays':
          this.$refs.everydays.classList.add( 'is-active' );
          this.$refs.about.classList.remove( 'is-active' );
          this.$refs.projects.classList.remove( 'is-active' );
          break;
        case 'projects':
          this.$refs.projects.classList.add( 'is-active' );
          this.$refs.everydays.classList.remove( 'is-active' );
          this.$refs.about.classList.remove( 'is-active' );
          break;
        default:
          this.$refs.about.classList.remove( 'is-active' );
          this.$refs.everydays.classList.remove( 'is-active' );
          this.$refs.projects.classList.remove( 'is-active' );
      }
    },

    // Events ------------------------------------------------------------------

    setupEvents() {

      this.$refs.everydays.addEventListener( 'click', this.onEverydayClick.bind(this) );
      this.$refs.projects.addEventListener( 'click', this.onProjectClick.bind(this) );
    },

    onProjectClick() {

      this.$router.push({ name: 'projects' });
    },

    onEverydayClick() {

      this.$router.push({ name: 'everydays' });
    },

    onAssetLoaded() {

    },

    onAssetsLoaded() {

    },
  },

  components: {},
});
