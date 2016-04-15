import * as angular from 'angular';
import { PortalAppCtrl } from './portal-app.controller';
import { portalNavigationComponent } from './navigation/portal-navigation.component';

angular.module('portal.general', ['portal.router'])
  .controller('PortalAppCtrl', PortalAppCtrl)
  .component('portalNav', portalNavigationComponent);

export default angular.module('portal.general').name;
