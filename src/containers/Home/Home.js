import WebglComponent from 'components/Webgl/Webgl';

import './home.styl';

import template from './home.html';

export default Vue.extend({

  template,

  data() {

    return {};
  },

  created() {

  },

  mounted() {

    this.setupEvent();
  },

  methods: {

    setupEvent() {

      this.$refs.webgl.addEventListener('mousemove', this.onMousemove.bind(this));
      this.$refs.webgl.addEventListener('mouseleave', this.onMouseleave.bind(this));
    },

    onMousemove(e) {

      Signals.onWeblGLMousemove.dispatch(e);
    },

    onMouseleave(e) {

      Signals.onWeblGLMouseleave.dispatch(e);
    },
  },

  components: {
    'webgl-component': WebglComponent,
  },
});
