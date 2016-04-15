import * as angular from 'angular';
import 'angular-ui-router';
import portalSecurity from '../security/security.module';
import portalViewContainer from '../view-container/view-container.module';
import { RouterProvider } from './router.service';


export default angular.module('portal.router', ['ui.router', portalSecurity, portalViewContainer])
  .provider('router', RouterProvider)
  .name;
