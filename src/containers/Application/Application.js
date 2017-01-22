import LoaderComponent from 'components/Loader/Loader';

import template from './application.html';

export default Vue.extend({

  template,

  emitterEvents: [],

  data() {

    return {};
  },

  created() {},

  ready() {},

  methods: {},

  components: {
    'loader-component': LoaderComponent,
  },
});
