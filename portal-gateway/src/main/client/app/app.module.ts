/// <reference path="../typings/main.d.ts" />
import * as angular from 'angular';
import 'tmp/app/app.templates.js';

import portalGeneral from './general/general.module';
import portalRouter from './router/router.module';
import { RouterProvider, Router } from './router/router.service';
import { Role } from './security/role.class';

angular.module('portal', [portalGeneral, portalRouter])
  .config(function ($locationProvider:ng.ILocationProvider, routerProvider:RouterProvider,
                    $urlRouterProvider:angular.ui.IUrlRouterProvider, $stateProvider:angular.ui.IStateProvider) {
    $locationProvider.html5Mode(false);

    routerProvider
      .addApplication('/app1/')
      .label('APP1')
      .allowAnyRoleOf(Role.APP1_USER);

    $stateProvider.state('welcome', {
      url: '/portal/welcome',
      template: '<h1>Welcome</h1>',
      resolve: {
        testMe: function () {
          return 'test';
        }
      }
    });

    $urlRouterProvider.when('', '/portal/welcome');
  })
  .run(function (router:Router) {
    router.switchBetweenApplicationsOnLocationChangeSuccess();
  });
