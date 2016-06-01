import * as angular from 'angular';
import { addHomeStateDef } from './home/home.state-def';
import { portalNavigationComponent } from './navigation/portal-navigation.component';

angular.module('portal.general', ['portal.router', 'ui.router'])
  .config(function ($stateProvider:angular.ui.IStateProvider) {
    addHomeStateDef($stateProvider);
  })
  .component('portalNav', portalNavigationComponent);

export default angular.module('portal.general').name;
