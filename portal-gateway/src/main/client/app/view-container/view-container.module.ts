import * as angular from 'angular';
import { ViewContainerManager } from './view-container-manager.service';

export default angular.module('portal.view-container', [])
  .service('viewContainerManager', ViewContainerManager)
  .name;
