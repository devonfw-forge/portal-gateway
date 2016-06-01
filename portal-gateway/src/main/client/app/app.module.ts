/// <reference path="../typings/main.d.ts" />
import * as angular from 'angular';
import 'tmp/app/app.templates.js';

import portalGeneral from './general/general.module';
import portalRouter from './router/router.module';
import { RouterProvider, Router } from './router/router.service';
import { Role } from './security/role.class';

angular.module('portal', [portalGeneral, portalRouter])
  .config(function ($locationProvider:ng.ILocationProvider, routerProvider:RouterProvider,
                    $urlRouterProvider:angular.ui.IUrlRouterProvider) {
    $locationProvider.html5Mode(false);

    routerProvider
      .addApplication('/app1/')
      .label('APP1')
      .allowAnyRoleOf(Role.APP1_USER)

      .addApplication('/app2/')
      .label('APP2')
      .allowAnyRoleOf(Role.APP1_USER);

    $urlRouterProvider.when('', '/portal/home');
  })
  .run(function (router:Router) {
    router.switchBetweenApplicationsOnLocationChangeSuccess();
  });
