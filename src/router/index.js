import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import MapLeaflet from '@/components/MapLeaflet';
import Auth from '@okta/okta-vue';

Vue.use(Auth, {
  issuer: 'https://dev-857306.okta.com/oauth2/default',
  client_id: '0oank6tto1E2G7C2X4x6',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email',
});

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback(),
    },
    {
      path: '/posts-manager',
      name: 'MapLeaflet',
      component: MapLeaflet,
      meta: {
        requiresAuth: true,
      },
    },
  ],
});

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router;
