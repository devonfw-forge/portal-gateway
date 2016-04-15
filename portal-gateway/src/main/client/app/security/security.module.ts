import * as angular from 'angular';
import { Security } from './security.service';


export default angular.module('portal.security', [])
  .service('security', Security)
  .name;
