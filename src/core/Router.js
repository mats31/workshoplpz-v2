import VueRouter from 'vue-router';

import HomeComponent from '../containers/Home/Home';
import ProjectComponent from 'components/Project/Project';

Vue.use( VueRouter );

export default class Router extends VueRouter {

  constructor() {

    super({
      mode: 'history',
      routes: [
        {
          component: HomeComponent,
          name: 'home',
          path: '/',
          children: [
            {
              component: ProjectComponent,
              name: 'project',
              path: 'project/:id',
            }
          ]
        },
      ],
    });
  }
}
