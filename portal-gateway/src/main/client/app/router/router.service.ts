import { Security } from '../security/security.service';
import { Role } from '../security/role.class';
import { ViewContainerManager } from '../view-container/view-container-manager.service';

export class RouterProvider implements ng.IServiceProvider {
  private routeBuilder = new RouteBuilder();

  private noMatchingStateDetector = function () {
    let noMatchingStateFound = false;

    return {
      noMatchingStateFound: function () {
        noMatchingStateFound = true;
      },
      isDetected: function () {
        return noMatchingStateFound;
      },
      reset: function () {
        noMatchingStateFound = false;
      }
    };
  }();

  addApplication(src:string):RouteBuilder {
    return this.routeBuilder.addApplication(src);
  }

  /* @ngInject */
  constructor($urlRouterProvider:angular.ui.IUrlRouterProvider, $stateProvider:angular.ui.IStateProvider) {
    $urlRouterProvider.deferIntercept();
    $urlRouterProvider.otherwise(() => {
      this.noMatchingStateDetector.noMatchingStateFound();
    });

    $stateProvider
      .state('pageNotFound', {
        url: '/portal/page-not-found',
        template: '<h1>Page not found</h1>'
      })
      .state('notAuthorized', {
        url: '/portal/not-authorized',
        template: '<h1>Not authorized</h1>'
      });
  }

  /* @ngInject */
  $get($rootScope:ng.IRootScopeService, $location:ng.ILocationService, $urlRouter:angular.ui.IUrlRouterService,
       $state:angular.ui.IStateService, security:Security, $q:ng.IQService, viewContainerManager:ViewContainerManager):Router {
    return new Router($rootScope, $location, $urlRouter, $state, security, $q, viewContainerManager,
      this.routeBuilder.build(), this.noMatchingStateDetector);
  }
}

export interface IApplication {
  id:string;
  src:string;
  label?:string;
  roles?:Role[];
  permittedToAll?:boolean;
  noHashBangPath?:boolean;
}

export class Router {
  private currentApp:IApplication;
  /**
   * Indicates if an application configured in this router is currently shown. If not, a ui-router state is shown.
   */
  private appIsShown:boolean;

  constructor(private $rootScope:ng.IRootScopeService, private $location:ng.ILocationService,
              private $urlRouter:angular.ui.IUrlRouterService, private $state:angular.ui.IStateService,
              private security:Security, private $q:ng.IQService, private viewContainerManager:ViewContainerManager,
              private applications:IApplication[], private noMatchingStateDetector:any) {
  }

  getApplicationsUserIsAuthorizedFor():IApplication[] {
    // TODO authorization check
    return this.applications;
  }

  getIdOrStateNameOfCurrentApp():string {
    if (this.appIsShown) {
      return this.currentApp.id;
    } else {
      let currentState = this.$state.current;
      return currentState ? currentState.name : '';
    }
  }

  switchBetweenApplicationsOnLocationChangeSuccess():void {
    this.$urlRouter.listen();
    this.$rootScope.$on('$locationChangeSuccess', (event:any) => {
      let appToWhichCurrentPathLeads:IApplication = this.getApplicationToWhichCurrentPathLeads();
      let currentAppId = this.currentApp && this.currentApp.id;
      if (appToWhichCurrentPathLeads) { // there exists an application configured in the portal router
        // prevent $urlRouter's default handler from firing
        event.preventDefault();
        this.userIsAuthorizedForApp(appToWhichCurrentPathLeads).then(() => {
          // after checking if the user is authorized, sync the current URL to the router
          this.$urlRouter.sync();
          // reset after sync
          this.noMatchingStateDetector.reset();

          this.currentApp = appToWhichCurrentPathLeads;
          this.appIsShown = true;
          let requestedAppId = appToWhichCurrentPathLeads.id;
          let requestedAppSrc = appToWhichCurrentPathLeads.src;
          // send an event and move it to the event handler
          // show spinner
          this.viewContainerManager.hideCurrentAppOrStateAndShowRequestedApp(currentAppId, requestedAppId, requestedAppSrc)
            .then(function () {
              // hide spinner
            }, function () {
              // hide spinner
            });
        }, () => {
          this.appIsShown = false;
          this.$state.go('notAuthorized');
        });
      } else if (this.noMatchingStateDetector.isDetected()) { // neither a portal app nor a ui-router state found
        this.appIsShown = false;
        this.$state.go('pageNotFound');
      } else { // a ui-router state found and is about to be entered
        this.appIsShown = false;
        // check security / make the ui-router container visible and the iframe one invisible
        this.viewContainerManager.hideApplicationAndShowState(currentAppId);
      }
      this.noMatchingStateDetector.reset();
    });

    this.$rootScope.$on('$stateChangeStart', function () {
      console.log('state!!!');
    });

    this.$rootScope.$on('$stateChangeSuccess', () => {
      let currentAppId = this.currentApp && this.currentApp.id;
      this.viewContainerManager.hideApplicationAndShowState(currentAppId);
    });

    this.$rootScope.$on('$locationChangeStart', function () {
      console.log('state!!!');
    });
  }

  private getApplicationToWhichCurrentPathLeads():IApplication {
    let currentPath:string = this.$location.path();
    let urlInfo:IParsedUrlInfo = UrlUtils.parseUrl(currentPath);
    let appId = urlInfo && urlInfo.appId;
    if (appId) {
      for (let i = 0; i < this.applications.length; i++) {
        let app = this.applications[i];
        if (appId === app.id) {
          return app;
        }
      }
    }
  }

  private userIsAuthorizedForApp(application:IApplication):ng.IPromise {
    let deferredAuthorizationCheck = this.$q.defer();

    if (application.roles) {
      this.security.userHasAnyRoleOf(application.roles).then((authorized:boolean) => {
        authorized ? deferredAuthorizationCheck.resolve() : deferredAuthorizationCheck.reject();
      });
    } else if (!application.permittedToAll) {
      return this.$q.reject();
    }

    return deferredAuthorizationCheck.promise;
  }
}

class RouteBuilder {
  private apps:IApplication[] = [];
  private currentApp:IApplication;

  addApplication(src:string):RouteBuilder {
    let parsedUrl:IParsedUrlInfo = UrlUtils.parseUrl(src);
    if (parsedUrl && parsedUrl.appId) {
      this.currentApp = {
        id: parsedUrl.appId,
        src: src
      };
      this.apps.push(this.currentApp);
    } else {
      throw new Error('Could not parse URL passed!');
    }

    return this;
  }

  label(label:string):RouteBuilder {
    this.currentApp.label = label;
    return this;
  }

  allowAnyRoleOf(...roles:Role[]):RouteBuilder {
    if (roles && roles.length > 0) {
      this.currentApp.roles = roles;
    }
    return this;
  }

  permitAll():RouteBuilder {
    this.currentApp.permittedToAll = true;
    return this;
  }

  noHashBangPath():RouteBuilder {
    this.currentApp.noHashBangPath = true;
    return this;
  }

  build():IApplication[] {
    return this.apps;
  }
}

class UrlUtils {
  static parseUrl(url:string):IParsedUrlInfo {
    if (url) {
      let pathElements:string[] = url.split('/');
      if (pathElements && pathElements.length > 1) {
        return {
          appId: pathElements[1],
          hasMoreElementsBesidesAppId: (pathElements.length > 2 && pathElements[2]) ? true : false
        };
      }
    }
  }
}

interface IParsedUrlInfo {
  appId:string;
  hasMoreElementsBesidesAppId:boolean;
}
