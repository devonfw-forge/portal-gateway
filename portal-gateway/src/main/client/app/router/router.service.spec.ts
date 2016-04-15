import 'angular';
import { RouterProvider, Router } from './router.service';
import { Role } from '../security/role.class';

describe('Router: ', function () {
  let $location:ng.ILocationService;
  let $rootScope:ng.IRootScopeService;
  let securityMock = {
    userHasRole: angular.noop,
    userHasAnyRoleOf: angular.noop
  };

  beforeEach(function () {
    angular.module('test-module', ['portal.router'])
      .config(function ($locationProvider:ng.ILocationProvider, routerProvider:RouterProvider, $stateProvider:angular.ui.IStateProvider) {
        $locationProvider.html5Mode(false);

        routerProvider
          .addApplication('/app1/')
          .label('APP1')
          .allowAnyRoleOf(Role.APP1_USER)

          .addApplication('/app2/some/long/path?param=paramValue')
          .label('APP2')
          .noHashBangPath()
          .permitAll()

          .addApplication('/app3/some/path/to/app3')
          .label('APP3');

        $stateProvider.state('welcome', {
          url: '/portal/welcome',
          template: '<h1>Welcome</h1>'
        });
      })
      .run(function (router:Router) {
        router.switchBetweenApplicationsOnLocationChangeSuccess();
      });

    angular.mock.module(
      'portal.security',
      function ($provide:ng.auto.IProvideService) {
        $provide.value('security', securityMock);
      },
      'test-module');

  });

  beforeEach(inject((_$location_:ng.ILocationService, _$rootScope_:ng.IRootScopeService) => {
    $location = _$location_;
    $rootScope = _$rootScope_;
  }));

  it('switches to another app when it is permitted to all', inject(function ($q:ng.IQService) {
    // given
    spyOn(securityMock, 'userHasAnyRoleOf').and.callThrough();
    // when
    $location.path('/app2/some/path');
    $rootScope.$apply();
    // then
    expect($location.path()).toBe('/app2/some/path');
    expect(securityMock.userHasAnyRoleOf).not.toHaveBeenCalled();
  }));

  xit('switches to another app when user has a specific role', inject(function ($q:ng.IQService) {
    // given
    spyOn(securityMock, 'userHasAnyRoleOf').and.callFake(function () {
      return $q.when(true);
    });
    // when
    $location.path('/app1/some/path');
    $rootScope.$apply();
    // then
    expect($location.path()).toBe('/app1/some/path');
    expect(securityMock.userHasAnyRoleOf).toHaveBeenCalledWith([Role.APP1_USER]);
  }));

  it('shows an error page when a user has no roles needed', inject(function ($q:ng.IQService) {
    // given
    spyOn(securityMock, 'userHasAnyRoleOf').and.callFake(function () {
      return $q.when(false);
    });
    // when
    $location.path('/app1/some/path');
    $rootScope.$apply();
    // then
    expect($location.path()).toBe('/portal/not-authorized');
  }));

  it('shows an error page when a user has neither roles nor \'permitAll\' set', inject(function ($q:ng.IQService) {
    // given
    spyOn(securityMock, 'userHasAnyRoleOf').and.callThrough();
    // when
    $location.path('/app3/some/path');
    $rootScope.$apply();
    // then
    expect($location.path()).toBe('/portal/not-authorized');
    expect(securityMock.userHasAnyRoleOf).not.toHaveBeenCalled();
  }));

  it('goes to an ordinary ui-route state', inject(function ($q:ng.IQService) {
    // when
    $location.path('/portal/welcome');
    $rootScope.$apply();
    expect($location.path()).toBe('/portal/welcome');
  }));

  it('shows an error page when neither a state nor an application matches', inject(function ($q:ng.IQService) {
    // when
    $location.path('/unknown/path');
    $rootScope.$apply();
    expect($location.path()).toBe('/portal/page-not-found');
  }));
});
